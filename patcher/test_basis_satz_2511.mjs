// Basis-Satz, Größe/Kopf, Browser-Download und Zähler ohne Prüfsumme (I8 25.11., Auftrag I3 18:40). Synthetisch, keine ROMs:
//   node patcher/test_basis_satz_2511.mjs
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
const E = require('./rom_erkennung.js');
const echt = JSON.parse(readFileSync(new URL('./release.json', import.meta.url), 'utf8'));
const kennungen = JSON.parse(readFileSync(new URL('./rom_kennungen.json', import.meta.url), 'utf8'));
// wie live (25.11.): Stable v1.0.0, Port 2.0.0-beta.2 freigegeben
const live = { ...echt, version: 'v1.0.0', outputMd5: '155aba19258e1f7ccd00264961b643ee' };
const aus = { ...live, port: { ...live.port, enabled: false } };
const MB16 = 16777216, MB32 = 33554432, fake = '1'.repeat(32);

function datei(laenge, anfangBytes = [], code = '', rev = 0, gba = true, versatz = 0) {
  const u8 = new Uint8Array(Math.max(laenge, 0xC0 + versatz));
  anfangBytes.forEach((b, i) => { u8[i] = b; });
  for (let i = 0; i < code.length; i++) u8[versatz + 0xAC + i] = code.charCodeAt(i);
  if (gba) u8[versatz + 0xB2] = 0x96;
  u8[versatz + 0xBC] = rev;
  return u8;
}
const bytes = s => [...s].map(c => c.charCodeAt(0));
let n = 0;
function fall(name, info, grund, satzMuster, rel = live) {
  assert.equal(info.grund, grund, `${name}: Grund ${info.grund}, erwartet ${grund}`);
  assert.ok(info.satz && /^(Das ist|Diese Datei)/.test(info.satz) && info.satz.endsWith('.'), `${name}: kein Basis-Satz: ${info.satz}`);
  assert.match(info.satz, satzMuster, `${name}: Satz passt nicht: ${info.satz}`);
  assert.ok(!/undefined|null|NaN/.test(info.satz + (info.text || '')), `${name}: Platzhalter im Text`);
  console.log(`OK  ${name.padEnd(44)} ${info.satz}`);
  n++;
}

// 1) Basis per Hash, ein Satz mit passender Version
fall('FireRed Rev 0', E.erkenne(live.baseMd5, MB16, datei(64, [], 'BPRE'), live, kennungen), 'firered',
  /^Das ist FireRed \(USA\) Rev 0 englisch, passend: v1\.0\.0 \(Unbound 1\.0\.1\) und die Port-Beta v2\.0\.0-beta\.2 \(Unbound 2\.1\.1\.1\)\.$/);
fall('FireRed Rev 0, Port aus', E.erkenne(live.baseMd5, MB16, datei(64, [], 'BPRE'), aus, kennungen), 'firered',
  /^Das ist FireRed \(USA\) Rev 0 englisch, passend: v1\.0\.0\.$/);
fall('Unbound EN 1.0.1', E.erkenne(live.unboundBaseMd5, MB32, datei(64, [], 'BPRE'), live, kennungen), 'unbound101',
  /^Das ist Unbound 1\.0\.1 englisch, passend: v1\.0\.0\.$/);
fall('Unbound EN 2.1.1.1 (Beispiel aus dem Auftrag)', E.erkenne(live.port.baseMd5, MB32, datei(64, [], 'BPRE'), live, kennungen), 'port',
  /^Das ist Unbound 2\.1\.1\.1 englisch, passend: Port-Beta v2\.0\.0-beta\.2\.$/);
fall('Unbound EN 2.1.1.1, Port aus', E.erkenne(live.port.baseMd5, MB32, datei(64, [], 'BPRE'), aus, kennungen), 'port_gesperrt', /noch nicht freigegeben/);

// 2) schon gepatcht: aktuell (beide Linien) und ältere Version
fall('schon v1.0.0', E.erkenne(live.outputMd5, MB32, datei(64, [], 'BPRE'), live, kennungen), 'bereits_gepatcht',
  /^Das ist schon Pokémon Unbound DE v1\.0\.0, die neueste Version\.$/);
fall('schon Port-Beta 2.0.0-beta.2', E.erkenne(live.port.outputMd5, MB32, datei(64, [], 'BPRE'), live, kennungen), 'bereits_gepatcht',
  /^Das ist schon die deutsche Port-Beta 2\.0\.0-beta\.2, die neueste Version\.$/);
const alt = Object.keys(kennungen.bereits_gepatcht).find(k => kennungen.bereits_gepatcht[k] === 'Pokémon Unbound DE v0.1');
fall('schon ältere DE-Version', E.erkenne(alt, MB32, datei(64, [], 'BPRE'), live, kennungen), 'bereits_gepatcht',
  /^Das ist schon Pokémon Unbound DE v0\.1, passend: keine unserer Versionen\.$/);

fall('schon Port-Beta 3b (öffentlich, alt)', E.erkenne('29758b848624300621c9949725bfd65a', MB32, datei(64, [], 'BPRE'), live, kennungen), 'bereits_gepatcht',
  /^Das ist schon Pokémon Unbound DE Port-Beta 3b \(Unbound 2\.1\.1\.1\), passend: keine unserer Versionen\.$/);

// 3) falsche Fassung
fall('FireRed Rev 1', E.erkenne(fake, MB16, datei(64, [], 'BPRE', 1), live, kennungen), 'rev1', /^Das ist FireRed \(USA\) Rev 1, passend: keine unserer Versionen/);
fall('Feuerrote (DE)', E.erkenne(fake, MB16, datei(64, [], 'BPRD'), live, kennungen), 'de', /^Das ist die deutsche Feuerrote Edition, passend: keine unserer Versionen/);
fall('unbekannte 32-MB-FireRed', E.erkenne(fake, MB32, datei(64, [], 'BPRE'), live, kennungen), 'unbound2x', /unbekannte FireRed-Datei mit 32 MB/);

// 4) Größe/Kopf (neu)
fall('abgebrochener Download (9,5 MB, BPRE)', E.erkenne(fake, 9961472, datei(64, [], 'BPRE'), live, kennungen), 'unvollstaendig', /9,5 MB statt 16 MB/);
fall('Kopf beschädigt (16 MB, kein 0x96)', E.erkenne(fake, MB16, datei(64, [], '', 0, false), live, kennungen), 'kopf_kaputt', /beschädigtem Kopf/);
fall('Kopf beschädigt (32 MB)', E.erkenne(fake, MB32, datei(64, [], '', 0, false), live, kennungen), 'kopf_kaputt', /beschädigtem Kopf/);
fall('512 Byte Vorspann', E.erkenne(fake, MB16 + 512, datei(64, [], 'BPRE', 0, true, 512), live, kennungen), 'kopf_versatz', /512 Byte Vorspann/);

// 5) Browser/Download (neu): Webseite statt Datei, auch mit .gba-Endung und BOM
fall('HTML statt ROM (.gba)', E.erkenne(fake, 48213, datei(64, bytes('<!DOCTYPE html><html>'), '', 0, false), live, kennungen, 'unbound.gba'), 'webseite', /gespeicherte Webseite/);
fall('HTML mit BOM', E.erkenne(fake, 9000, datei(64, [0xEF, 0xBB, 0xBF, ...bytes('\n<html lang="de">')], '', 0, false), live, kennungen, 'x'), 'webseite', /Webseite/);

// 6) Bestandsgründe behalten ihren Grund und bekommen einen Satz
fall('Patch-Datei', E.erkenne(fake, 17133493, datei(64, bytes('BPS1'), '', 0, false), live, kennungen, 'x.bps'), 'patchdatei', /Patch-Datei/);
fall('Spielstand', E.erkenne(fake, 0x20000, datei(64, [], '', 0, false), live, kennungen, 'x.sav'), 'spielstand', /Spielstand/);
fall('anderes Spiel', E.erkenne(fake, MB16, datei(64, [], 'BPEE'), live, kennungen), 'anderes_spiel', /anderes GBA-Spiel/);

// 7) Zähler ohne Prüfsumme: Größenklasse + Familie, nie Hex aus der Datei
const z = [E.zaehlKennung(MB16, datei(64, [], 'BPRE')), E.zaehlKennung(MB32, datei(64, [], '', 0, false)),
  E.zaehlKennung(1048576, datei(64, [], 'BPEE')), E.zaehlKennung(MB16 + 1, datei(64, [], 'BPRF'))];
assert.deepEqual(z, ['16M-BPRE', '32M-keingba', 'klein-gba', 'andere-BPRx']);
for (const k of z) assert.match(k, /^(16M|32M|klein|andere)-(BPRE|BPRD|BPRx|BPGx|gba|keingba)$/);
console.log('OK  Zählkennung ohne Prüfsumme', z.join(' '));
n++;
const app = readFileSync(new URL('./app.js', import.meta.url), 'utf8');
assert.ok(!/trackEvent\([^)]*md5/.test(app), 'app.js zählt noch eine Prüfsumme');
// Review I5 P1 (2, 3): ein Weg für Basis- und Ergebnisfehler, gebunden an Grund + Release-Tag
assert.ok(/fehlerZaehlen\(fehlerInfo\.grund, zielTag\(\)\)/.test(app), 'Basisfehler nicht an Release-Tag gebunden');
assert.ok(/fehlerZaehlen\('ergebnis', tagVon\(modus\)\)/.test(app), 'Ergebnisfehler nicht über fehlerZaehlen');
assert.ok(!/trackEvent\('patch-fehler', 'ergebnis'\)/.test(app), 'Ergebnisfehler zählt noch am Weg vorbei');
assert.ok(/trackEvent\('patch-erfolg', tagVon\(modus\)\)/.test(app) && !/replace\(' ', '-'\)/.test(app), 'Erfolg nicht per Release-Tag');
assert.equal('patch-erfolg-' + live.port.tag, 'patch-erfolg-port-v2.0.0-beta.2', 'Port-Erfolg = patch-erfolg-<tag_name>');
// Zerlegung „fehler-<grund>-<tag>“: kein Grund enthält „-“, sonst wäre der Tag nicht eindeutig
const gruende = new Set([...app.matchAll(/grund: '([^']+)'/g), ...readFileSync(new URL('./rom_erkennung.js', import.meta.url), 'utf8').matchAll(/grund: '([^']+)'/g)].map(m => m[1]));
for (const g of gruende) assert.ok(!g.includes('-'), `Grund ${g} enthält „-“`);
// Review I5 P1 (1): 20 MiB heißt nicht „32 MB“
const mib20 = E.erkenne(fake, 20 * 1048576, datei(64, [], 'BPRE'), live, kennungen);
assert.equal(mib20.grund, 'unbound2x');
assert.ok(/mit 20 MB/.test(mib20.satz) && !/32/.test(mib20.satz), `20 MiB: ${mib20.satz}`);
assert.match(E.erkenne(fake, MB32, datei(64, [], 'BPRE'), live, kennungen).satz, /mit 32 MB/);
const html = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
assert.ok(/Datenschutz:/.test(html) && /IP-Adressen werden nicht gespeichert/.test(html) && !/Prüfsummen-Anfang/.test(html), 'Datenschutzsatz');
// Hinweis I5: die Hilfe-Mail enthält MD5/CRC32, also nicht „verlassen deinen Browser nicht“
assert.ok(/Keine Prüfsummen an die Seitenstatistik/.test(html) && !/verlassen deinen Browser nicht/.test(html), 'Datenschutzsatz vs. Hilfe-Mail');
console.log('OK  Zähler je Grund + Release-Tag, ein Weg für Ergebnisfehler, 20 MiB ohne „32 MB“, Datenschutzsatz');
n++;
console.log(`GRUEN: ${n}/${n}`);
