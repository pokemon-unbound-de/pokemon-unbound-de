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
# Weg B (Besitzer der englischen Unbound-ROM): Basis Unbound EN 1.0.1 – die Seite erkennt sie per MD5 und nimmt
# automatisch diesen Patch (Fehlerquote 26.10.: 59 Fehler auf 71 Erfolge, u. a. falsche Basis)
UNBOUND_MD5 = "52192d7e7268245e2e30b7d1a802d33d"
UNBOUND_CRC32 = 0x95EA47FC


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


def verify_bps(data, source_crc=BASE_CRC32):
    if len(data) < 16 or data[:4] != b"BPS1":
        raise ValueError("not a BPS patch")
    source, target, patch = struct.unpack_from("<III", data, len(data) - 12)
    if source != source_crc or zlib.crc32(data[:-4]) != patch:
        raise ValueError("BPS source or patch CRC mismatch")
    return target


def asset_sha256(asset):
    digest = asset.get("digest") or ""
    if not re.fullmatch(r"sha256:[a-f0-9]{64}", digest):
        raise ValueError(f"SHA256 digest missing for {asset['name']}")
    return digest.split(":", 1)[1]


def cached_patch_matches(patch, expected_sha, expected_crc, source_crc=BASE_CRC32):
    try:
        return (hashlib.sha256(patch).hexdigest() == expected_sha
                and f"{verify_bps(patch, source_crc):08x}" == expected_crc)
    except (ValueError, struct.error):
        return False


# --- Port-Beta (Unbound 2.1.1.1 DE) ------------------------------------------------------------------------------
# Optionaler Block "port" in release.json. Feature-Flag: "port.enabled" (Standard false). Der Port wird nur dann aus
# einem eigenen GitHub-Release (Tag "port-v<Version>", Assets: PRUEFSUMMEN.txt + zwei BPS) gelesen und gespiegelt, wenn
# das Flag in der eingecheckten release.json true ist. Ist es false, schreibt der Sync nur die Basis-Kennung (keine
# Patches, kein Netzzugriff auf das Port-Release). Freischalten = PR, der "enabled" auf true und "tag" setzt.
PORT_API = "https://api.github.com/repos/pokemon-unbound-de/pokemon-unbound-de/releases/tags/"
PORT_TAG = re.compile(r"port-v\d+(?:\.\d+){2,3}(?:-[A-Za-z0-9._]+)*")
PORT_UNBOUND_MD5 = "9cad8e771940e7f7094d13911552cef0"          # Unbound EN 2.1.1.1 (Basis des Ports)
PORT_UNBOUND_SHA256 = "7aa25bbf568f7cfcf6ee1cf2e9e6ff637350b3d0705c2375cabb6baa7d9739f7"
PORT_UNBOUND_SIZE = 33554432
PORT_FIRERED_PATH = "patches/port_firered_rev0.bps"
PORT_UNBOUND_PATH = "patches/port_unbound_2111.bps"


def port_block_aus(local_port):
    tag = str(local_port.get("tag", ""))
    return {"enabled": False, "tag": tag if PORT_TAG.fullmatch(tag) else "",
            "baseMd5": PORT_UNBOUND_MD5, "baseSha256": PORT_UNBOUND_SHA256, "baseSize": PORT_UNBOUND_SIZE}


def sums_in(section):
    def grab(pattern, label):
        match = re.search(pattern, section, re.I)
        if not match:
            raise ValueError(f"{label} missing in port checksums")
        return match.group(1).lower()
    return {"md5": md5_in(section),
            "sha256": grab(r"\bSHA-256\s+([a-f0-9]{64})\b", "SHA-256"),
            "crc32": grab(r"\bCRC32\s+([a-f0-9]{8})\b", "CRC32"),
            "size": int(grab(r"\((\d+)\s*Byte\)", "size"))}


def patch_in(section):
    match = re.search(r"^\s*Patch\s+(\S+\.bps)\s+\(SHA-256\s+([a-f0-9]{64})\)", section, re.I | re.M)
    if not match:
        raise ValueError("patch line missing in port checksums")
    return match.group(1), match.group(2).lower()


def load_port_release(tag):
    """Liest das Port-Release (nur Metadaten + PRUEFSUMMEN.txt, noch keine Patches) und prüft Basis-Kennungen."""
    if not PORT_TAG.fullmatch(tag):
        raise ValueError(f"port.enabled is true but port.tag is invalid: {tag!r}")
    release = json.loads(fetch(PORT_API + tag, binary=False))
    if release.get("tag_name") != tag or release.get("draft"):
        raise ValueError(f"port release {tag} not found or still a draft")
    assets = {item["name"]: item for item in release["assets"]}
    if "PRUEFSUMMEN.txt" not in assets:
        raise ValueError("port release lacks PRUEFSUMMEN.txt")
    checksums_sha = asset_sha256(assets["PRUEFSUMMEN.txt"])
    data = fetch(assets["PRUEFSUMMEN.txt"]["browser_download_url"])
    if hashlib.sha256(data).hexdigest() != checksums_sha:
        raise ValueError("port checksum asset digest mismatch")
    notes = data.decode("utf-8-sig")
    if not ("== Weg A:" in notes and "== Weg B:" in notes and "== Ergebnis" in notes):
        raise ValueError("unexpected port checksum format")
    section_a = notes.split("== Weg A:", 1)[1].split("== Weg B:", 1)[0]
    section_b = notes.split("== Weg B:", 1)[1].split("== Ergebnis", 1)[0]
    section_r = notes.split("== Ergebnis", 1)[1]
    sum_a, sum_b, sum_r = sums_in(section_a), sums_in(section_b), sums_in(section_r)
    if sum_a["md5"] != BASE_MD5 or sum_a["crc32"] != f"{BASE_CRC32:08x}":
        raise ValueError("port: FireRed base ROM changed")
    if (sum_b["md5"], sum_b["sha256"], sum_b["size"]) != (PORT_UNBOUND_MD5, PORT_UNBOUND_SHA256, PORT_UNBOUND_SIZE):
        raise ValueError("port: Unbound 2.1.1.1 base ROM changed")
    patches = {}
    for key, section in (("firered", section_a), ("unbound", section_b)):
        name, sha = patch_in(section)
        if name not in assets:
            raise ValueError(f"port release lacks asset {name}")
        if asset_sha256(assets[name]) != sha:
            raise ValueError(f"port asset {name}: digest differs from PRUEFSUMMEN.txt")
        patches[key] = {"name": name, "sha256": sha, "url": assets[name]["browser_download_url"]}
    return {"tag": tag, "version": tag[len("port-v"):], "url": release["html_url"], "checksums_sha": checksums_sha,
            "base_crc32": sum_b["crc32"], "output_md5": sum_r["md5"], "output_crc32": sum_r["crc32"], "patches": patches}


def port_block_an(info):
    return {"enabled": True, "tag": info["tag"], "version": info["version"],
            "baseMd5": PORT_UNBOUND_MD5, "baseSha256": PORT_UNBOUND_SHA256, "baseSize": PORT_UNBOUND_SIZE,
            "baseCrc32": info["base_crc32"], "outputMd5": info["output_md5"], "outputCrc32": info["output_crc32"],
            "fireredPatch": PORT_FIRERED_PATH, "fireredPatchSha256": info["patches"]["firered"]["sha256"],
            "unboundPatch": PORT_UNBOUND_PATH, "unboundPatchSha256": info["patches"]["unbound"]["sha256"],
            "checksumsAssetSha256": info["checksums_sha"], "releaseUrl": info["url"]}


def port_cached(info):
    """True, wenn beide Port-Patches lokal schon vorliegen und zu Release und Zielprüfsumme passen."""
    try:
        return (cached_patch_matches((SITE / PORT_FIRERED_PATH).read_bytes(), info["patches"]["firered"]["sha256"],
                                     info["output_crc32"], BASE_CRC32)
                and cached_patch_matches((SITE / PORT_UNBOUND_PATH).read_bytes(), info["patches"]["unbound"]["sha256"],
                                         info["output_crc32"], int(info["base_crc32"], 16)))
    except OSError:
        return False


def port_patches(info):
    """Lädt beide Port-Patches, prüft SHA256 und BPS-CRCs (beide Wege -> dieselbe Ergebnis-CRC). -> [(Daten, Pfad)]"""
    files = []
    for key, path, source_crc in (("firered", SITE / PORT_FIRERED_PATH, BASE_CRC32),
                                  ("unbound", SITE / PORT_UNBOUND_PATH, int(info["base_crc32"], 16))):
        data = fetch(info["patches"][key]["url"])
        if hashlib.sha256(data).hexdigest() != info["patches"][key]["sha256"]:
            raise ValueError(f"port patch {key}: asset digest mismatch")
        if f"{verify_bps(data, source_crc):08x}" != info["output_crc32"]:
            raise ValueError(f"port patch {key}: BPS target differs from checksum file")
        files.append((data, path))
    return files


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
    unbound_name = f"pokemon_unbound_de_{version}.bps"
    if patch_name not in assets or unbound_name not in assets or "MD5.txt" not in assets:
        raise ValueError("latest release lacks FireRed patch, Unbound patch or MD5.txt")
    patch_sha = asset_sha256(assets[patch_name])
    unbound_sha = asset_sha256(assets[unbound_name])
    checksums_sha = asset_sha256(assets["MD5.txt"])
    unbound_version = unbound_version_in(release.get("body") or "")
    manifest_path = SITE / "release.json"
    patch_path = SITE / "patches/latest_firered_rev0.bps"
    unbound_path = SITE / "patches/latest_unbound_101.bps"
    local = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.exists() else {}
    local_port = local.get("port") if isinstance(local.get("port"), dict) else {}
    port_info = load_port_release(str(local_port.get("tag", ""))) if local_port.get("enabled") is True else None
    port_wanted = port_block_an(port_info) if port_info else port_block_aus(local_port)
    if manifest_path.exists() and patch_path.exists() and unbound_path.exists():
        local_patch = patch_path.read_bytes()
        same = (local.get("version") == version and local.get("port") == port_wanted
                and (port_info is None or port_cached(port_info))
                and local.get("unboundVersion") == unbound_version
                and local.get("patchSha256") == patch_sha and local.get("checksumsAssetSha256") == checksums_sha
                and local.get("baseMd5") == BASE_MD5 and local.get("baseCrc32") == f"{BASE_CRC32:08x}"
                and local.get("releaseUrl") == release["html_url"]
                and cached_patch_matches(local_patch, patch_sha, local.get("outputCrc32"))
                and local.get("unboundPatchSha256") == unbound_sha and local.get("unboundBaseMd5") == UNBOUND_MD5
                and cached_patch_matches(unbound_path.read_bytes(), unbound_sha, local.get("outputCrc32"), UNBOUND_CRC32)
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
    if "== Weg B:" not in notes or md5_in(notes.split("== Weg B:", 1)[1].split("== Ergebnis", 1)[0]) != UNBOUND_MD5:
        raise ValueError("release Unbound base ROM changed")
    patch = fetch(assets[patch_name]["browser_download_url"])
    target_crc = verify_bps(patch)
    if hashlib.sha256(patch).hexdigest() != patch_sha:
        raise ValueError("release patch asset digest mismatch")
    unbound_patch = fetch(assets[unbound_name]["browser_download_url"])
    if verify_bps(unbound_patch, UNBOUND_CRC32) != target_crc:       # beide Wege -> dasselbe Ergebnis
        raise ValueError("Unbound patch target differs from FireRed patch target")
    if hashlib.sha256(unbound_patch).hexdigest() != unbound_sha:
        raise ValueError("release Unbound patch asset digest mismatch")
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
        "unboundBase": "Pokémon Unbound (EN) 1.0.1",
        "unboundBaseMd5": UNBOUND_MD5,
        "unboundBaseCrc32": f"{UNBOUND_CRC32:08x}",
        "unboundPatch": "patches/latest_unbound_101.bps",
        "unboundPatchSha256": unbound_sha,
        "checksumsAssetSha256": checksums_sha,
        "releaseUrl": release["html_url"],
        "port": port_wanted,
    }
    port_files = port_patches(port_info) if port_info else []     # nur bei port.enabled; vor dem ersten Schreiben geprüft
    for data, path in ((patch, patch_path), (unbound_patch, unbound_path), *port_files):
        with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as staged:
            staged.write(data)
            staged_patch = staged.name
        os.replace(staged_patch, path)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=SITE, delete=False) as staged:
        json.dump(manifest, staged, ensure_ascii=False, indent=2)
        staged.write("\n")
        staged_manifest = staged.name
    os.replace(staged_manifest, manifest_path)
    port_text = f"Port {port_info['version']} AN" if port_info else "Port AUS"
    print(f"SYNCED {version}: BPS CRC {target_crc:08x}, SHA256 {patch_sha}; {port_text}")


if __name__ == "__main__":
    main()
