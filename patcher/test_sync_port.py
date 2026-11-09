"""Offline-Test des Port-Teils von sync_release.py (keine ROMs, keine Netzzugriffe): python patcher/test_sync_port.py
Prüft mit erfundenen Mini-Patches und dem Prüfsummen-Format der Port-Vorschau (tools/vorschau_paket.py):
  - Port AUS: Block ohne Patches, kein Zugriff auf das Port-Release
  - Port AN: Block aus PRUEFSUMMEN.txt + Assets, Patches geprüft (SHA256, BPS-CRC), Fehlerfälle brechen ab"""
import hashlib
import struct
import sys
import zlib
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sync_release as S  # noqa: E402


def fake_bps(source_crc, target_crc, marker):
    body = b"BPS1" + marker
    head = body + struct.pack("<II", source_crc, target_crc)
    return head + struct.pack("<I", zlib.crc32(head))


OUT_CRC = 0x1234ABCD
UNBOUND_CRC = 0xCAFEBABE
PATCH_FR = fake_bps(S.BASE_CRC32, OUT_CRC, b"fr")
PATCH_UN = fake_bps(UNBOUND_CRC, OUT_CRC, b"un")
sha = lambda d: hashlib.sha256(d).hexdigest()  # noqa: E731


def pruefsummen(md5_un=S.PORT_UNBOUND_MD5, patch_fr=PATCH_FR):
    return "\n".join([
        "Prüfsummen – Pokémon Unbound DE Port-Beta", "",
        "== Weg A: Basis Pokémon FireRed (USA) Rev 0  (16777216 Byte)", f"  MD5     {S.BASE_MD5}", "  SHA-256 " + "1" * 64,
        f"  CRC32   {S.BASE_CRC32:08x}", f"  Patch   Unbound_DE_Port_x_von_FireRed.bps  (SHA-256 {sha(patch_fr)})", "",
        "== Weg B: Basis Pokémon Unbound 2.1.1.1 EN  (33554432 Byte)", f"  MD5     {md5_un}", f"  SHA-256 {S.PORT_UNBOUND_SHA256}",
        f"  CRC32   {UNBOUND_CRC:08x}", f"  Patch   Unbound_DE_Port_x_von_Unbound.bps  (SHA-256 {sha(PATCH_UN)})", "",
        "== Ergebnis (bei beiden Wegen identisch)  (33554432 Byte)", "  MD5     " + "f" * 32, "  SHA-256 " + "2" * 64,
        f"  CRC32   {OUT_CRC:08x}", ""]).encode("utf-8")


TAG = "port-v2.1.1.1-DE-0.1-beta"


def api(sums, patch_fr=PATCH_FR):
    def asset(name, data):
        return {"name": name, "digest": "sha256:" + sha(data), "browser_download_url": "https://x/" + name}
    return {"tag_name": TAG, "draft": False, "html_url": "https://github.com/x/releases/tag/" + TAG,
            "assets": [asset("PRUEFSUMMEN.txt", sums), asset("Unbound_DE_Port_x_von_FireRed.bps", patch_fr),
                       asset("Unbound_DE_Port_x_von_Unbound.bps", PATCH_UN)]}


def mit_netz(sums, patch_fr=PATCH_FR, meta_fr=None):
    import json
    meta = api(sums, meta_fr or patch_fr)
    dateien = {"PRUEFSUMMEN.txt": sums, "Unbound_DE_Port_x_von_FireRed.bps": patch_fr, "Unbound_DE_Port_x_von_Unbound.bps": PATCH_UN}

    def fetch(url, binary=True):
        if url.startswith(S.PORT_API):
            return json.dumps(meta).encode("utf-8")
        return dateien[url.rsplit("/", 1)[1]]
    S.fetch = fetch


rot = 0


def pruefe(name, ok):
    global rot
    rot += 0 if ok else 1
    print(("OK  " if ok else "ROT ") + name)


def wirft(fn):
    try:
        fn()
    except (ValueError, KeyError):
        return True
    return False


# 1) AUS: nur Basis-Kennung, kein Release-Zugriff
aus = S.port_block_aus({"enabled": False, "tag": ""})
pruefe("AUS: enabled false, keine Patch-Felder", aus["enabled"] is False and "fireredPatch" not in aus and aus["baseMd5"] == S.PORT_UNBOUND_MD5)
pruefe("AUS: ungültiger Tag wird verworfen", S.port_block_aus({"tag": "../evil"})["tag"] == "")
pruefe("AUS: gültiger Tag bleibt erhalten", S.port_block_aus({"tag": TAG})["tag"] == TAG)

# 2) AN: Release lesen, Block bauen, Patches prüfen
mit_netz(pruefsummen())
info = S.load_port_release(TAG)
block = S.port_block_an(info)
pruefe("AN: Version aus Tag", block["version"] == "2.1.1.1-DE-0.1-beta" and block["enabled"] is True)
pruefe("AN: Ergebnis-MD5/CRC aus PRUEFSUMMEN.txt", block["outputMd5"] == "f" * 32 and block["outputCrc32"] == f"{OUT_CRC:08x}")
pruefe("AN: Unbound-Basis-CRC aus PRUEFSUMMEN.txt", block["baseCrc32"] == f"{UNBOUND_CRC:08x}")
pruefe("AN: Patch-Hashes", block["fireredPatchSha256"] == sha(PATCH_FR) and block["unboundPatchSha256"] == sha(PATCH_UN))
pruefe("AN: Pfade unter patches/port_", block["fireredPatch"].startswith("patches/port_") and block["unboundPatch"].startswith("patches/port_"))
dateien = S.port_patches(info)
pruefe("AN: beide Patches geladen und geprüft", [d for d, _ in dateien] == [PATCH_FR, PATCH_UN])

# 3) Fehlerfälle
pruefe("FEHLER: ungültiger Tag", wirft(lambda: S.load_port_release("v0.1.8")))
mit_netz(pruefsummen(md5_un="0" * 32))
pruefe("FEHLER: falsche Unbound-2.1.1.1-Basis", wirft(lambda: S.load_port_release(TAG)))
kaputt = fake_bps(0xDEADBEEF, OUT_CRC, b"fr")                       # falsche Quell-CRC
mit_netz(pruefsummen(patch_fr=kaputt), patch_fr=kaputt)
pruefe("FEHLER: BPS mit falscher Quell-CRC", wirft(lambda: S.port_patches(S.load_port_release(TAG))))
mit_netz(pruefsummen(), patch_fr=PATCH_FR, meta_fr=kaputt)
pruefe("FEHLER: Asset-Digest weicht von PRUEFSUMMEN.txt ab", wirft(lambda: S.load_port_release(TAG)))
print("ROT: %d" % rot if rot else "GRUEN")
sys.exit(1 if rot else 0)
