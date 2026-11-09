// Test der ROM-Erkennung per MD5-/Header-Simulation (keine ROMs): node patcher/test_rom_erkennung.mjs
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
const E = require('./rom_erkennung.js');
const kennungen = JSON.parse(readFileSync(new URL('./rom_kennungen.json', import.meta.url), 'utf8'));
const echt = JSON.parse(readFileSync(new URL('./release.json', import.meta.url), 'utf8'));   // ausgelieferter Stand (Port-Flag muss AUS sein)
const PORT_MD5 = '9cad8e771940e7f7094d13911552cef0';
const release = { baseMd5: 'e26ee0d44e809351c8ce2d73c7400cdd', unboundBaseMd5: '52192d7e7268245e2e30b7d1a802d33d',
  port: { enabled: false, baseMd5: PORT_MD5 } };                      // Standard: Port AUS
const portAn = {                                                        // freigegebener Port (Beispielwerte, keine echten Hashes)
  enabled: true, version: '2.1.1.1-DE-0.1-beta', baseMd5: PORT_MD5, baseCrc32: 'a1b2c3d4', outputMd5: 'f'.repeat(32),
  fireredPatch: 'patches/port_firered_rev0.bps', fireredPatchSha256: 'a'.repeat(64),
  unboundPatch: 'patches/port_unbound_2111.bps', unboundPatchSha256: 'b'.repeat(64) };
const releaseAn = Object.assign({}, release, { port: portAn });
const releaseUnvollstaendig = Object.assign({}, release, { port: Object.assign({}, portAn, { outputMd5: '' }) });
const releaseOhnePort = { baseMd5: release.baseMd5, unboundBaseMd5: release.unboundBaseMd5 };    // altes Manifest ohne Block

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
  ['Unbound 2.1.1.1 (Port AUS)', zweix, MB32, kopf('BPRE', 0), 'port_gesperrt'],
  ['Unbound 2.1.1.1 (Port AN)', zweix, MB32, kopf('BPRE', 0), 'port', releaseAn],
  ['Unbound 2.1.1.1 (Port-Block unvollständig)', zweix, MB32, kopf('BPRE', 0), 'port_gesperrt', releaseUnvollstaendig],
  ['Unbound 2.1.1.1 (altes Manifest ohne Port)', zweix, MB32, kopf('BPRE', 0), 'unbound2x', releaseOhnePort],
  ['Unbound andere Version', '4'.repeat(32), MB32, kopf('BPRE', 0), 'unbound2x'],
  ['Unbound andere Version (Port AN)', '4'.repeat(32), MB32, kopf('BPRE', 0), 'unbound2x', releaseAn],
  ['FireRed USA Rev 0 (Port AN)', release.baseMd5, MB16, kopf('BPRE', 0), 'firered', releaseAn],
  ['Unbound EN 1.0.1 (Port AN)', release.unboundBaseMd5, MB32, kopf('BPRE', 0), 'unbound101', releaseAn],
  ['Emerald', '5'.repeat(32), MB16, kopf('BPEE', 0), 'unbekannt'],
  ['Datei ohne Header', '6'.repeat(32), 100, new Uint8Array(100), 'unbekannt'],
  ...gepatcht.map(m => ['bereits gepatcht ' + kennungen.bereits_gepatcht[m], m, MB32, kopf('BPRE', 0), 'bereits_gepatcht'])
];
let rot = 0;
for (const [name, md5, size, u8, soll, rel] of faelle) {
  const r = E.erkenne(md5, size, u8, rel || release, kennungen);
  const ok = r.grund === soll;
  if (!ok) rot++;
  console.log(`${ok ? 'OK ' : 'ROT'} ${name.padEnd(36)} -> ${r.grund}${r.titel ? ' | ' + r.titel : ''}`);
}
const mail = E.hilfeMail('neviocore@pokemonunboundde.studio', { grund: 'rev1', titel: 'FireRed (USA) Rev 1 erkannt', md5: '0'.repeat(32), version: 'v0.1.7.2', browser: 'Test' });
const mailOk = mail.startsWith('mailto:neviocore@pokemonunboundde.studio?subject=') && decodeURIComponent(mail).includes('MD5 meiner ROM: 0000');
console.log(`${mailOk ? 'OK ' : 'ROT'} Hilfe-Mail vorausgefüllt (${mail.length} Zeichen)`);
if (!mailOk) rot++;

// Port-Freigabe: Meldungstext, Feature-Flag und Block-Prüfung
const zusaetze = [];
const gesperrt = E.erkenne(zweix, MB32, kopf('BPRE', 0), release, kennungen);
zusaetze.push(['Meldung „Port-Beta noch nicht freigegeben“', gesperrt.titel === 'Port-Beta noch nicht freigegeben' && gesperrt.untertitel.includes('2.1.1.1')]);
zusaetze.push(['Port-Flag im ausgelieferten release.json AUS', !echt.port || echt.port.enabled === false]);
zusaetze.push(['release.json: Port-Basis-MD5 = 9cad8e77…', !echt.port || echt.port.baseMd5 === PORT_MD5]);
zusaetze.push(['portBereit: ausgeliefertes release.json = nein', E.portBereit(echt) === false]);
zusaetze.push(['portBereit: AUS = nein', E.portBereit(release) === false]);
zusaetze.push(['portBereit: vollständiger Block AN = ja', E.portBereit(releaseAn) === true]);
zusaetze.push(['portBereit: AN ohne Ergebnis-MD5 = nein', E.portBereit(releaseUnvollstaendig) === false]);
zusaetze.push(['portBereit: enabled als Text "true" = nein', E.portBereit(Object.assign({}, release, { port: Object.assign({}, portAn, { enabled: 'true' }) })) === false]);
zusaetze.push(['portBereit: Patchpfad außerhalb patches/ = nein', E.portBereit(Object.assign({}, release, { port: Object.assign({}, portAn, { fireredPatch: '../x.bps' }) })) === false]);
zusaetze.push(['portBereit: ohne Port-Block = nein', E.portBereit(releaseOhnePort) === false]);
for (const [name, ok] of zusaetze) {
  if (!ok) rot++;
  console.log(`${ok ? 'OK ' : 'ROT'} ${name}`);
}
const gesamt = faelle.length + 1 + zusaetze.length;
console.log(rot ? `ROT: ${rot} Fälle` : `GRUEN: ${gesamt}/${gesamt}`);
process.exit(rot ? 1 : 0);
