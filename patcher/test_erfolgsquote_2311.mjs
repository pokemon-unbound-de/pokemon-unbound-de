// Erfolgsquote (I9 23.11.): neue Fehlergründe mit klarem nächsten Schritt. Synthetisch, keine ROMs: node patcher/test_erfolgsquote_2311.mjs
// Grundlage: Wochenstatistik 23.11. (unbekannt 22 von 40 Fehlern; Top 5 der unbekannten Dateien, siehe Fall-Namen)
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const E = require('./rom_erkennung.js');
const echt = JSON.parse(readFileSync(new URL('./release.json', import.meta.url), 'utf8'));
const kennungen = JSON.parse(readFileSync(new URL('./rom_kennungen.json', import.meta.url), 'utf8'));
const aus = { ...echt, port: { ...echt.port, enabled: false } };
const MB16 = 16777216, MB32 = 33554432, fake = '1'.repeat(32);

function datei(laenge, anfangBytes = [], code = '', rev = 0, gba = true) {
  const u8 = new Uint8Array(Math.max(laenge, 0xC0));
  anfangBytes.forEach((b, i) => { u8[i] = b; });
  for (let i = 0; i < code.length; i++) u8[0xAC + i] = code.charCodeAt(i);
  if (gba) u8[0xB2] = 0x96;
  u8[0xBC] = rev;
  return u8;
}
const bytes = s => [...s].map(c => c.charCodeAt(0));
const pruefe = (name, info, grund, muster) => {
  assert.equal(info.grund, grund, `${name}: Grund ${info.grund}, erwartet ${grund}`);
  assert.ok(info.titel && info.text, `${name}: Titel und Text fehlen`);
  if (muster) assert.match(info.text, muster, `${name}: Text ohne nächsten Schritt`);
  console.log(`OK  ${name.padEnd(52)} -> ${info.grund} | ${info.titel}`);
};
let n = 0;
const fall = (...a) => { pruefe(...a); n++; };

// Top 5 der Woche (Prüfsummen-Anfang-Größe-Spielcode), nachgestellt
fall('a6639b40-16732k-G___ (eigener .bps v0.1.8 von FireRed)', E.erkenne(fake, 17133493, datei(64, bytes('BPS1'), 'G\x05\xF7\xED', 0, false), echt, kennungen, 'x.bps'), 'patchdatei', /eigene Spieldatei \(\.gba\)/);
fall('8183204a-950k-____ (eigener .bps Port beta3b)', E.erkenne(fake, 972800, datei(64, bytes('BPS1'), '', 0, false), echt, kennungen, ''), 'patchdatei', /eigene Spieldatei/);
fall('d4230b56-16586k-__T_ (vermutlich 7z/RAR, Annahme)', E.erkenne(fake, 16984064, datei(64, [0x37, 0x7A, 0xBC, 0xAF, 0x27, 0x1C], '\x00\x00T\x00', 0, false), echt, kennungen, 'unbound.7z'), 'archiv', /Entpacke/);
fall('ba45ff6f-16384k-BPRE (FireRed Rev 0, verändert)', E.erkenne(fake, MB16, datei(64, [], 'BPRE', 0), echt, kennungen, 'firered.gba'), 'firered_veraendert', /unveränderte Sicherung/);
fall('8ed0e8d4-1024k-____ (keine GBA-Datei)', E.erkenne(fake, 1048576, datei(64, [], '', 0, false), echt, kennungen, 'spiel.gb'), 'keine_gba', /eigene Spieldatei/);

// weitere neue Gründe
fall('ZIP ohne Spieldatei (unser Beta-Paket)', E.erkenne(fake, 17228000, datei(64, [0x50, 0x4B, 0x03, 0x04], '', 0, false), echt, kennungen, 'paket.zip'), 'archiv', /kein|keine/);
fall('RAR-Archiv', E.erkenne(fake, 9000000, datei(64, bytes('Rar!'), '', 0, false), echt, kennungen, 'x.rar'), 'archiv', /Entpacke/);
fall('Spielstand .sav (128 KB)', E.erkenne(fake, 131072, datei(131072, [], '', 0, false), echt, kennungen, 'Unbound.sav'), 'spielstand', /\.gba/);
fall('Spielstand nur an der Größe (64 KB)', E.erkenne(fake, 65536, datei(65536, [], '', 0, false), echt, kennungen, ''), 'spielstand', /\.gba/);
fall('FireRed Französisch (BPRF)', E.erkenne(fake, MB16, datei(64, [], 'BPRF', 0), echt, kennungen), 'firered_sprache', /FireRed \(USA\) Rev 0/);
fall('Emerald (BPEE)', E.erkenne(fake, MB16, datei(64, [], 'BPEE', 0), echt, kennungen), 'anderes_spiel', /BPEE/);
fall('Rev 1 mit Erklärung', E.erkenne(fake, MB16, datei(64, [], 'BPRE', 1), echt, kennungen), 'rev1', /brauchen Rev 0/);
fall('Feuerrote Edition (DE)', E.erkenne(fake, MB16, datei(64, [], 'BPRD', 0), echt, kennungen), 'de', /englische/);

// schon deutsch: aktuelle Versionen kommen direkt aus release.json, ältere aus rom_kennungen.json
fall('aktuelle DE-Version (release.outputMd5)', E.erkenne(echt.outputMd5, MB32, datei(64, [], 'BPRE', 0), echt, kennungen), 'bereits_gepatcht', /nichts patchen/);
if (echt.port?.outputMd5) fall('aktuelle Port-Beta (port.outputMd5)', E.erkenne(echt.port.outputMd5, MB32, datei(64, [], 'BPRE', 0), echt, kennungen), 'bereits_gepatcht', /nichts patchen/);
for (const v of ['v0.1.8', 'v0.1.9']) {
  const md5 = Object.keys(kennungen.bereits_gepatcht).find(k => kennungen.bereits_gepatcht[k].endsWith(v));
  assert.ok(md5, `rom_kennungen.json: ${v} fehlt (python tools/patcher_kennungen.py neu laufen lassen)`);
  fall(`gepatcht ${v} wird erkannt`, E.erkenne(md5, MB32, datei(64, [], 'BPRE', 0), echt, kennungen), 'bereits_gepatcht');
}

// Unbound 2.x: Knopf „Zur Port-Beta wechseln“ nur, wenn der Port freigegeben ist
const zweixAn = E.erkenne(fake, MB32, datei(64, [], 'BPRE', 0), echt, kennungen);
assert.equal(zweixAn.grund, 'unbound2x');
assert.equal(zweixAn.aktion, E.portBereit(echt) ? 'zur_port_beta' : undefined);
const zweixAus = E.erkenne(fake, MB32, datei(64, [], 'BPRE', 0), aus, kennungen);
assert.equal(zweixAus.aktion, undefined);
console.log('OK  unbound2x: Knopf zur Port-Beta nur bei freigegebenem Port'); n++;

// Sicherheit: echte Basen bleiben vorne, auch wenn der Dateiname täuscht
assert.equal(E.erkenne(echt.baseMd5, MB16, datei(64, [], 'BPRE', 0), echt, kennungen, 'patch.bps').grund, 'firered');
assert.equal(E.erkenne(echt.unboundBaseMd5, MB32, datei(64, [], 'BPRE', 0), echt, kennungen, 'x.sav').grund, 'unbound101');
console.log('OK  exakte Prüfsumme schlägt Dateiendung'); n++;
// Spielcode aus der Datei wird bereinigt (nur A-Z, 0-9), bevor er im Text steht
assert.doesNotMatch(E.erkenne(fake, MB16, datei(64, [], 'B<x>', 0), echt, kennungen).text, /[<>]/);
console.log('OK  Spielcode im Text bereinigt'); n++;

// GOLD-Liste I5 Nr. 1: Quell-CRC32 aus der BPS-Fußzeile (letzte 12 Byte: Quelle, Ziel, Patch; little endian)
const bps = new Uint8Array(40);
bps.set(bytes('BPS1'));
bps.set([0x1C, 0x76, 0x88, 0xDD], 28);                     // Quelle dd88761c wie FireRed Rev 0
assert.equal(E.bpsQuellCrc(bps), 'dd88761c');
assert.equal(E.bpsQuellCrc(bps).length, 8);
const klein = new Uint8Array(40); klein.set(bytes('BPS1')); klein.set([0x01, 0, 0, 0], 28);
assert.equal(E.bpsQuellCrc(klein), '00000001');               // führende Nullen bleiben
assert.equal(E.bpsQuellCrc(new Uint8Array(40)), null);        // ohne BPS1-Anfang: nichts anzeigen
assert.equal(E.bpsQuellCrc(bytes('BPS1')), null);             // zu kurz
console.log('OK  Quell-CRC32 aus der BPS-Fußzeile'); n++;
const mailCrc = decodeURIComponent(E.hilfeMail('a@b.c', { grund: 'rev1', md5: fake, crc32: '0badf00d' }));
assert.match(mailCrc, /CRC32 meiner ROM: 0badf00d/);
assert.doesNotMatch(decodeURIComponent(E.hilfeMail('a@b.c', { grund: 'rev1', md5: fake })), /CRC32/);
console.log('OK  Hilfe-Mail mit CRC32 nur, wenn bekannt'); n++;

console.log(`GRUEN: ${n}/${n}`);
