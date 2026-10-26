// Test der ROM-Erkennung per MD5-/Header-Simulation (keine ROMs): node patcher/test_rom_erkennung.mjs
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const E = require('./rom_erkennung.js');
const kennungen = JSON.parse(readFileSync(new URL('./rom_kennungen.json', import.meta.url), 'utf8'));
const release = { baseMd5: 'e26ee0d44e809351c8ce2d73c7400cdd', unboundBaseMd5: '52192d7e7268245e2e30b7d1a802d33d' };

function kopf(code, rev) {          // simulierter GBA-Header (nur Spielcode + Revision belegt)
  const u8 = new Uint8Array(0xC0);
  for (let i = 0; i < 4; i++) u8[0xAC + i] = code.charCodeAt(i);
  u8[0xBC] = rev;
  return u8;
}
const MB16 = 16777216, MB32 = 33554432;
const gepatcht = Object.keys(kennungen.bereits_gepatcht);
const zweix = Object.keys(kennungen.unbound2x)[0];
const faelle = [
  ['FireRed USA Rev 0', release.baseMd5, MB16, kopf('BPRE', 0), 'firered'],
  ['Unbound EN 1.0.1', release.unboundBaseMd5, MB32, kopf('BPRE', 0), 'unbound101'],
  ['FireRed USA Rev 1', '0'.repeat(32), MB16, kopf('BPRE', 1), 'rev1'],
  ['Feuerrote Edition (DE)', '1'.repeat(32), MB16, kopf('BPRD', 0), 'de'],
  ['LeafGreen USA', '2'.repeat(32), MB16, kopf('BPGE', 0), 'leafgreen'],
  ['BlattGrüne Edition (DE)', '3'.repeat(32), MB16, kopf('BPGD', 0), 'leafgreen'],
  ['Unbound 2.1.1.1', zweix, MB32, kopf('BPRE', 0), 'unbound2x'],
  ['Unbound andere Version', '4'.repeat(32), MB32, kopf('BPRE', 0), 'unbound2x'],
  ['Emerald', '5'.repeat(32), MB16, kopf('BPEE', 0), 'unbekannt'],
  ['Datei ohne Header', '6'.repeat(32), 100, new Uint8Array(100), 'unbekannt'],
  ...gepatcht.map(m => ['bereits gepatcht ' + kennungen.bereits_gepatcht[m], m, MB32, kopf('BPRE', 0), 'bereits_gepatcht'])
];
let rot = 0;
for (const [name, md5, size, u8, soll] of faelle) {
  const r = E.erkenne(md5, size, u8, release, kennungen);
  const ok = r.grund === soll;
  if (!ok) rot++;
  console.log(`${ok ? 'OK ' : 'ROT'} ${name.padEnd(36)} -> ${r.grund}${r.titel ? ' | ' + r.titel : ''}`);
}
const mail = E.hilfeMail('neviocore@pokemonunboundde.studio', { grund: 'rev1', titel: 'FireRed (USA) Rev 1 erkannt', md5: '0'.repeat(32), version: 'v0.1.7.2', browser: 'Test' });
const mailOk = mail.startsWith('mailto:neviocore@pokemonunboundde.studio?subject=') && decodeURIComponent(mail).includes('MD5 meiner ROM: 0000');
console.log(`${mailOk ? 'OK ' : 'ROT'} Hilfe-Mail vorausgefüllt (${mail.length} Zeichen)`);
if (!mailOk) rot++;
console.log(rot ? `ROT: ${rot} Fälle` : `GRUEN: ${faelle.length + 1}/${faelle.length + 1}`);
process.exit(rot ? 1 : 0);
