"""Refresh this static site from the public, patch-only GitHub release."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import struct
import tempfile
from urllib.request import Request, urlopen
import zlib


SITE = Path(__file__).resolve().parent
API = "https://api.github.com/repos/pokemon-unbound-de/pokemon-unbound-de/releases/latest"
BASE_MD5 = "e26ee0d44e809351c8ce2d73c7400cdd"
BASE_CRC32 = 0xDD88761C


def fetch(url, binary=True):
    accept = "application/octet-stream" if binary else "application/vnd.github+json"
    request = Request(url, headers={"User-Agent": "unbound-de-patcher-sync", "Accept": accept})
    with urlopen(request, timeout=60) as response:
        return response.read()


def md5_in(section):
    match = re.search(r"\bMD5\s+([a-fA-F0-9]{32})\b", section)
    if not match:
        raise ValueError("MD5 missing in release notes")
    return match.group(1).lower()


def unbound_version_in(release_body):
    explicit = re.search(r"(?im)^\s*(?:\*\*)?Unbound-Basis(?:\*\*)?\s*:\s*v?(\d+(?:\.\d+){2,3})\b", release_body)
    legacy = re.search(r"\bUnbound\s+EN\s+v?(\d+(?:\.\d+){2,3})\b", release_body, re.I)
    match = explicit or legacy
    if not match:
        raise ValueError("Unbound version missing; add 'Unbound-Basis: X.Y.Z' to release notes")
    return match.group(1)


def verify_bps(data):
    if len(data) < 16 or data[:4] != b"BPS1":
        raise ValueError("not a BPS patch")
    source, target, patch = struct.unpack_from("<III", data, len(data) - 12)
    if source != BASE_CRC32 or zlib.crc32(data[:-4]) != patch:
        raise ValueError("BPS source or patch CRC mismatch")
    return target


def asset_sha256(asset):
    digest = asset.get("digest") or ""
    if not re.fullmatch(r"sha256:[a-f0-9]{64}", digest):
        raise ValueError(f"SHA256 digest missing for {asset['name']}")
    return digest.split(":", 1)[1]


def cached_patch_matches(patch, expected_sha, expected_crc):
    try:
        return (hashlib.sha256(patch).hexdigest() == expected_sha
                and f"{verify_bps(patch):08x}" == expected_crc)
    except (ValueError, struct.error):
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="validate the local mirror, do not write")
    parser.add_argument("--expect-version", default="", help="fail if GitHub latest has not reached this release tag")
    args = parser.parse_args()
    release = json.loads(fetch(API, binary=False))
    version = release["tag_name"]
    if not re.fullmatch(r"v\d+\.\d+(?:\.\d+){0,2}", version):   # auch Hotfix-Tags wie v0.1.7.1
        raise ValueError("unexpected release tag")
    if args.expect_version and version != args.expect_version:
        raise ValueError(f"GitHub latest is {version}, expected {args.expect_version}")
    assets = {item["name"]: item for item in release["assets"]}
    patch_name = f"pokemon_unbound_de_{version}_von_firered_usa.bps"
    if patch_name not in assets or "MD5.txt" not in assets:
        raise ValueError("latest release lacks FireRed patch or MD5.txt")
    patch_sha = asset_sha256(assets[patch_name])
    checksums_sha = asset_sha256(assets["MD5.txt"])
    unbound_version = unbound_version_in(release.get("body") or "")
    manifest_path = SITE / "release.json"
    patch_path = SITE / "patches/latest_firered_rev0.bps"
    if manifest_path.exists() and patch_path.exists():
        local = json.loads(manifest_path.read_text(encoding="utf-8"))
        local_patch = patch_path.read_bytes()
        same = (local.get("version") == version and local.get("unboundVersion") == unbound_version
                and local.get("patchSha256") == patch_sha and local.get("checksumsAssetSha256") == checksums_sha
                and local.get("baseMd5") == BASE_MD5 and local.get("baseCrc32") == f"{BASE_CRC32:08x}"
                and local.get("releaseUrl") == release["html_url"]
                and cached_patch_matches(local_patch, patch_sha, local.get("outputCrc32"))
                and re.fullmatch(r"[a-f0-9]{32}", local.get("outputMd5", "")))
        if same:
            print(f"{'CHECK OK' if args.check else 'CURRENT'} {version}: BPS SHA256 {patch_sha}; no asset download")
            return
    if args.check:
        raise ValueError("site is not synchronized with latest release")
    notes_data = fetch(assets["MD5.txt"]["browser_download_url"])
    if hashlib.sha256(notes_data).hexdigest() != checksums_sha:
        raise ValueError("release checksum asset digest mismatch")
    notes = notes_data.decode("utf-8-sig")
    if "== Weg A:" not in notes or "== Ergebnis" not in notes:
        raise ValueError("unexpected release checksum format")
    base_section = notes.split("== Weg A:", 1)[1].split("== Weg B:", 1)[0]
    result_section = notes.split("== Ergebnis", 1)[1]
    if md5_in(base_section) != BASE_MD5:
        raise ValueError("release base ROM changed")
    result_md5 = md5_in(result_section)
    patch = fetch(assets[patch_name]["browser_download_url"])
    target_crc = verify_bps(patch)
    if hashlib.sha256(patch).hexdigest() != patch_sha:
        raise ValueError("release patch asset digest mismatch")
    manifest = {
        "version": version,
        "unboundVersion": unbound_version,
        "base": "Pokémon FireRed (USA), Rev 0",
        "baseMd5": BASE_MD5,
        "baseCrc32": f"{BASE_CRC32:08x}",
        "outputMd5": result_md5,
        "outputCrc32": f"{target_crc:08x}",
        "patch": "patches/latest_firered_rev0.bps",
        "patchSha256": patch_sha,
        "checksumsAssetSha256": checksums_sha,
        "releaseUrl": release["html_url"],
    }
    with tempfile.NamedTemporaryFile(dir=patch_path.parent, delete=False) as staged:
        staged.write(patch)
        staged_patch = staged.name
    os.replace(staged_patch, patch_path)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=SITE, delete=False) as staged:
        json.dump(manifest, staged, ensure_ascii=False, indent=2)
        staged.write("\n")
        staged_manifest = staged.name
    os.replace(staged_manifest, manifest_path)
    print(f"SYNCED {version}: BPS CRC {target_crc:08x}, SHA256 {patch_sha}")


if __name__ == "__main__":
    main()
