const ui = {
  version: document.getElementById('version'),
  unboundVersion: document.getElementById('unbound-version'),
  releaseLink: document.getElementById('release-link'),
  status: document.getElementById('status'),
  statusDot: document.getElementById('status-dot'),
  verifyLine: document.getElementById('verify-line'),
  fileLabel: document.getElementById('file-label'),
  fileSubtitle: document.getElementById('file-subtitle'),
  fileInput: document.getElementById('rom-patcher-input-file-rom'),
  apply: document.getElementById('rom-patcher-button-apply'),
  hilfe: document.getElementById('hilfe'),
  hilfeTitel: document.getElementById('hilfe-titel'),
  hilfeText: document.getElementById('hilfe-text'),
  hilfeMail: document.getElementById('hilfe-mail')
};
const HILFE_ADRESSE = 'neviocore@pokemonunboundde.studio';

function setStatus(message, kind = 'idle') {
  ui.status.textContent = message;
  ui.statusDot.dataset.kind = kind;
  ui.verifyLine.dataset.kind = kind;
}

const pendingEvents = [];
let fehlerGezaehlt = false;
const FEHLER_KEY = 'patch-letzter-fehler';     // Tab-Sitzung: „Erfolg nach Fehlschlag“ zählen, auch nach Neuladen

function fehlerMerken(grund) {
  try { sessionStorage.setItem(FEHLER_KEY, grund); } catch (_) { /* Zählung ist optional */ }
}

function fehlerAbholen() {
  try {
    const grund = sessionStorage.getItem(FEHLER_KEY);
    sessionStorage.removeItem(FEHLER_KEY);
    return grund;
  } catch (_) { return null; }
}

function trackEvent(name, version = '') {
  const path = version ? `${name}-${version}` : name;
  const event = { path, title: path, event: true, no_session: true, referrer: '' };
  if (window.goatcounter?.count) window.goatcounter.count(event);
  else pendingEvents.push(event);
}

window.flushGoatEvents = function () {
  if (!window.goatcounter?.count) return;
  for (const event of pendingEvents.splice(0)) window.goatcounter.count(event);
};

function hilfeZeigen(info) {
  ui.hilfeTitel.textContent = info.titel;
  ui.hilfeText.textContent = info.text;
  ui.hilfeMail.href = RomErkennung.hilfeMail(HILFE_ADRESSE, info);
  ui.hilfe.hidden = false;
}

function hilfeVerbergen() {
  ui.hilfe.hidden = true;
}

async function start() {
  try {
    const response = await fetch('release.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Release-Manifest: HTTP ${response.status}`);
    const release = await response.json();
    if (!/^v\d+\.\d+(?:\.\d+){0,2}$/.test(release.version) || !/^\d+(?:\.\d+){2,3}$/.test(release.unboundVersion) || !/^[a-f0-9]{32}$/.test(release.baseMd5)) {
      throw new Error('Release-Manifest ungültig');
    }
    const kennungen = await fetch('rom_kennungen.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : {}).catch(() => ({}));
    ui.version.textContent = release.version;
    ui.unboundVersion.textContent = release.unboundVersion;
    ui.releaseLink.href = release.releaseUrl;
    const latestResponse = await fetch('https://api.github.com/repos/pokemon-unbound-de/pokemon-unbound-de/releases/latest', { cache: 'no-store' });
    if (!latestResponse.ok) throw new Error('Aktuellen GitHub-Release nicht prüfbar');
    const latest = await latestResponse.json();
    if (latest.tag_name !== release.version) {
      throw new Error(`Neuer Release ${latest.tag_name} erkannt. Patch wird aktualisiert; bitte später erneut laden.`);
    }
    const outputName = `Pokemon_Unbound_${release.unboundVersion}_DE_${release.version}`;
    const patchFireRed = {
      file: `${release.patch}?sha=${release.patchSha256.slice(0, 12)}`,
      name: `Pokémon Unbound DE ${release.version} (von FireRed USA Rev 0)`,
      inputMd5: release.baseMd5,
      inputCrc32: parseInt(release.baseCrc32, 16),
      outputName
    };
    const patchUnbound = release.unboundPatch ? {
      file: `${release.unboundPatch}?sha=${release.unboundPatchSha256.slice(0, 12)}`,
      name: `Pokémon Unbound DE ${release.version} (von Unbound EN 1.0.1)`,
      inputMd5: release.unboundBaseMd5,
      inputCrc32: parseInt(release.unboundBaseCrc32, 16),
      outputName
    } : null;
    let modus = 'firered';
    let wechsel = false;

    const directPatch = document.getElementById('bps-direct');
    directPatch.href = patchFireRed.file;
    directPatch.download = `${outputName}.bps`;
    directPatch.hidden = false;
    directPatch.addEventListener('click', () => trackEvent('bps-direkt', release.version));
    RomPatcherWeb.initialize({
      language: 'de',
      requireValidation: true,
      allowDropFiles: false,
      onloadrom(romFile) {
        fehlerGezaehlt = false;
        hilfeVerbergen();
        trackEvent('rom-gewaehlt');
        ui.fileLabel.textContent = romFile.fileName || ui.fileInput.files[0]?.name || 'ROM ausgewählt';
        ui.fileSubtitle.textContent = 'Basis wird geprüft';
        setStatus('Prüfsumme wird berechnet …');
      },
      onvalidaterom(romFile, valid) {
        if (valid) {
          if (wechsel) ui.apply.disabled = false;   // nach Patchwechsel: Bibliothek schaltet nur nach CRC-Lauf frei
          wechsel = false;
          hilfeVerbergen();
          ui.fileSubtitle.textContent = modus === 'unbound' ? 'Unbound EN 1.0.1 erkannt' : 'FireRed Rev 0 erkannt';
          setStatus('Basis geprüft. Bereit zum Patchen.', 'good');
          return;
        }
        const md5 = romFile.hashMD5().toLowerCase();
        const info = RomErkennung.erkenne(md5, romFile.fileSize, romFile._u8array, release, kennungen);
        // automatisch den passenden Patch nehmen (Unbound EN 1.0.1 <-> FireRed Rev 0); höchstens ein Wechsel je ROM
        if (!wechsel && ((info.grund === 'unbound101' && patchUnbound && modus !== 'unbound') || (info.grund === 'firered' && modus !== 'firered'))) {
          wechsel = true;
          modus = info.grund === 'unbound101' ? 'unbound' : 'firered';
          ui.fileSubtitle.textContent = modus === 'unbound' ? 'Unbound EN 1.0.1 erkannt' : 'FireRed Rev 0 erkannt';
          setStatus('Passender Patch wird geladen …');
          RomPatcherWeb.setEmbededPatches(modus === 'unbound' ? patchUnbound : patchFireRed);
          directPatch.href = (modus === 'unbound' ? patchUnbound : patchFireRed).file;
          return;
        }
        if (!fehlerGezaehlt) {
          trackEvent('patch-fehler', info.grund);                 // nur der Grund, keine Dateidaten
          fehlerMerken(info.grund);
          if (info.grund === 'unbekannt') {                       // Prüfsummen-Anfang, Größe, Spielcode: Erkennung erweitern
            const code = RomErkennung.headerInfo(romFile._u8array).code.replace(/[^A-Z0-9]/g, '_') || 'kein';
            trackEvent('rom-unbekannt', `${md5.slice(0, 8)}-${Math.round(romFile.fileSize / 1024)}k-${code}`);
          }
          fehlerGezaehlt = true;
        }
        ui.fileSubtitle.textContent = 'Nicht unterstützte ROM';
        setStatus(info.titel || 'Falsche Basis.', 'bad');
        hilfeZeigen(Object.assign({ md5, version: release.version, browser: navigator.userAgent }, info));
      },
      onpatch(romFile) {
        const hash = romFile.hashMD5().toLowerCase();
        if (hash !== release.outputMd5) {
          trackEvent('patch-fehler', 'ergebnis');
          fehlerMerken('ergebnis');
          const info = { grund: 'ergebnis', titel: 'Ergebnis weicht ab',
            text: 'Die erzeugte ROM hat nicht die erwartete Prüfsumme. Es wurde nichts heruntergeladen.' };
          setStatus('Ergebnis weicht von der erwarteten Prüfsumme ab. Kein Download.', 'bad');
          hilfeZeigen(Object.assign({ md5: hash, version: release.version, browser: navigator.userAgent }, info));
          throw new Error('Patch-Check fehlgeschlagen');
        }
        setStatus(`Fertig. Ergebnis geprüft (${release.version}).`, 'good');
      },
      ondownloadstart() {
        trackEvent('patch-erfolg', release.version);
        const vorher = fehlerAbholen();
        if (vorher) trackEvent('patch-erfolg-nach-fehler', vorher);
      }
    }, patchFireRed);
    setStatus('Bereit. Bitte FireRed (USA) Rev 0 oder Unbound EN 1.0.1 wählen.');
  } catch (error) {
    setStatus(`Patcher nicht bereit: ${error.message}`, 'bad');
    ui.apply.disabled = true;
  }
}

window.addEventListener('load', start);
