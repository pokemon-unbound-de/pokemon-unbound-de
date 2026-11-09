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
  hilfeMail: document.getElementById('hilfe-mail'),
  ziel: document.getElementById('ziel'),
  portHinweis: document.getElementById('port-hinweis'),
  feldHinweis: document.getElementById('field-hint'),
  basisHinweis: document.getElementById('footnote-basis')
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
    // Port-Beta (Unbound 2.1.1.1 DE): nur wenn release.port.enabled === true und der Block vollständig ist (Feature-Flag, Standard AUS)
    const port = RomErkennung.portBereit(release) ? release.port : null;
    const portName = port ? `Pokemon_Unbound_2.1.1.1_DE_Port-${port.version}` : '';
    const patchPortFireRed = port ? {
      file: `${port.fireredPatch}?sha=${port.fireredPatchSha256.slice(0, 12)}`,
      name: `Pokémon Unbound DE Port ${port.version} (von FireRed USA Rev 0)`,
      inputMd5: release.baseMd5,
      inputCrc32: parseInt(release.baseCrc32, 16),
      outputName: portName
    } : null;
    const patchPortUnbound = port ? {
      file: `${port.unboundPatch}?sha=${port.unboundPatchSha256.slice(0, 12)}`,
      name: `Pokémon Unbound DE Port ${port.version} (von Unbound EN 2.1.1.1)`,
      inputMd5: port.baseMd5,
      inputCrc32: parseInt(port.baseCrc32, 16),
      outputName: portName
    } : null;
    const PATCHES = { firered: patchFireRed, unbound: patchUnbound, port_firered: patchPortFireRed, port_unbound: patchPortUnbound };
    const ERKANNT = { firered: 'FireRed Rev 0 erkannt', unbound: 'Unbound EN 1.0.1 erkannt', port_firered: 'FireRed Rev 0 erkannt', port_unbound: 'Unbound EN 2.1.1.1 erkannt' };
    const BASIS_VON_MODUS = { firered: 'firered', port_firered: 'firered', unbound: 'unbound101', port_unbound: 'port' };
    const istPort = m => m === 'port_firered' || m === 'port_unbound';
    const versionVon = m => istPort(m) ? `Port ${port.version}` : release.version;
    let modus = 'firered';
    let wechsel = false;
    let ziel = 'v101';       // Auswahl der Person, nur sichtbar wenn der Port freigegeben ist
    let romGrund = null;     // erkannte Basis der zuletzt gewählten ROM
    let romGeladen = false;

    if (port) {
      ui.ziel.hidden = false;
      ui.portHinweis.hidden = true;
      ui.feldHinweis.textContent = '.gba · FireRed USA Rev 0, Unbound EN 1.0.1 oder 2.1.1.1';
      ui.basisHinweis.textContent = 'Du benötigst eine eigene legale Sicherung: FireRed (USA) Rev 0 oder Pokémon Unbound (EN) 1.0.1 – für die Port-Beta Pokémon Unbound (EN) 2.1.1.1 (genau diese Version). Nicht passend: FireRed Rev 1, die deutsche Feuerrote Edition, BlattGrün, andere Unbound-2.x-Versionen oder eine schon gepatchte deutsche ROM.';
    } else {
      ui.portHinweis.textContent = 'Port Unbound 2.1.1 (Beta): noch nicht freigegeben. Deine Unbound-EN-2.1.1.1-ROM wird erkannt, sobald die Beta live ist – Infos auf Discord.';
      ui.portHinweis.hidden = false;
    }

    const directPatch = document.getElementById('bps-direct');
    directPatch.href = patchFireRed.file;
    directPatch.download = `${outputName}.bps`;
    directPatch.hidden = false;
    directPatch.addEventListener('click', () => trackEvent('bps-direkt', versionVon(modus).replace(' ', '-')));

    // welcher Patch passt zu (erkannter Basis, Auswahl)? null = passt nicht
    function modusFuer(grund) {
      if (grund === 'port') return 'port_unbound';
      if (grund === 'firered') return ziel === 'port' ? 'port_firered' : 'firered';
      if (grund === 'unbound101') return ziel === 'port' || !patchUnbound ? null : 'unbound';
      return null;
    }

    function falscheBasis() {
      if (romGrund === 'unbound101' && ziel === 'port') {
        return { grund: 'port_falsche_basis', titel: 'Für den Port brauchst du eine andere Basis', untertitel: 'Unbound EN 1.0.1 erkannt',
          text: 'Der Port läuft auf Unbound EN 2.1.1.1 oder auf FireRed (USA) Rev 0. Deine ROM ist Unbound EN 1.0.1 – dafür wähle oben „Unbound 1.0.1“.' };
      }
      if (romGrund === 'port' && ziel === 'v101') {
        return { grund: 'v101_falsche_basis', titel: 'Dafür brauchst du eine andere Basis', untertitel: 'Unbound EN 2.1.1.1 erkannt',
          text: 'Unbound EN 2.1.1.1 passt nur zum Port. Für „Unbound 1.0.1“ brauchst du FireRed (USA) Rev 0 oder Unbound EN 1.0.1.' };
      }
      return null;
    }

    function fehlerZeigen(info, md5) {
      ui.fileSubtitle.textContent = info.untertitel || 'Nicht unterstützte ROM';
      setStatus(info.titel || 'Falsche Basis.', 'bad');
      hilfeZeigen(Object.assign({ md5, version: release.version, browser: navigator.userAgent }, info));
    }

    function patchWaehlen(neu) {
      RomPatcherWeb.setEmbededPatches(PATCHES[neu]);   // wirft, solange noch ein Patch lädt
      wechsel = romGeladen;                            // nach Patchwechsel: Bibliothek schaltet nur nach CRC-Lauf frei
      modus = neu;
      if (romGeladen) setStatus('Passender Patch wird geladen …');
      directPatch.href = PATCHES[modus].file;
      directPatch.download = `${PATCHES[modus].outputName}.bps`;
    }

    function zielSetzen(neu) {
      ziel = neu;
      for (const radio of ui.ziel.querySelectorAll('input[name=ziel]')) radio.checked = radio.value === neu;
    }

    function zielGeaendert(neu) {
      if (!port || neu === ziel) return;
      const vorher = ziel;
      zielSetzen(neu);
      hilfeVerbergen();
      const fehler = falscheBasis();
      if (fehler) {
        ui.apply.disabled = true;
        fehlerZeigen(fehler, '');
        return;
      }
      const basis = romGrund === 'firered' || romGrund === 'unbound101' || romGrund === 'port' ? romGrund : null;
      try {
        patchWaehlen((basis && modusFuer(basis)) || (ziel === 'port' ? 'port_firered' : 'firered'));
      } catch (_) {
        zielSetzen(vorher);
        setStatus('Der Patch lädt noch – bitte kurz warten und dann erneut wählen.', 'bad');
      }
    }

    if (port) {
      for (const radio of ui.ziel.querySelectorAll('input[name=ziel]')) {
        radio.addEventListener('change', () => zielGeaendert(radio.value));
      }
    }
    RomPatcherWeb.initialize({
      language: 'de',
      requireValidation: true,
      allowDropFiles: false,
      onloadrom(romFile) {
        fehlerGezaehlt = false;
        romGeladen = true;
        romGrund = null;
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
          romGrund = BASIS_VON_MODUS[modus];
          ui.fileSubtitle.textContent = ERKANNT[modus];
          setStatus(istPort(modus) ? 'Basis geprüft. Bereit für die Port-Beta.' : 'Basis geprüft. Bereit zum Patchen.', 'good');
          return;
        }
        const md5 = romFile.hashMD5().toLowerCase();
        const info = RomErkennung.erkenne(md5, romFile.fileSize, romFile._u8array, release, kennungen);
        romGrund = info.grund;
        if (info.grund === 'port') zielSetzen('port');          // 2.1.1.1 passt nur zum Port: Auswahl folgt der ROM
        // automatisch den passenden Patch nehmen (Unbound EN 1.0.1 / FireRed Rev 0 / Port); höchstens ein Wechsel je ROM
        const gewuenscht = modusFuer(info.grund);
        if (!wechsel && gewuenscht && gewuenscht !== modus) {
          ui.fileSubtitle.textContent = ERKANNT[gewuenscht];
          patchWaehlen(gewuenscht);
          return;
        }
        const fehlerInfo = falscheBasis() || info;               // z. B. Port gewählt, ROM ist Unbound 1.0.1
        if (!fehlerGezaehlt) {
          trackEvent('patch-fehler', fehlerInfo.grund);           // nur der Grund, keine Dateidaten
          fehlerMerken(fehlerInfo.grund);
          if (info.grund === 'unbekannt') {                       // Prüfsummen-Anfang, Größe, Spielcode: Erkennung erweitern
            const code = RomErkennung.headerInfo(romFile._u8array).code.replace(/[^A-Z0-9]/g, '_') || 'kein';
            trackEvent('rom-unbekannt', `${md5.slice(0, 8)}-${Math.round(romFile.fileSize / 1024)}k-${code}`);
          }
          fehlerGezaehlt = true;
        }
        fehlerZeigen(fehlerInfo, md5);
      },
      onpatch(romFile) {
        const hash = romFile.hashMD5().toLowerCase();
        const erwartet = istPort(modus) ? port.outputMd5 : release.outputMd5;
        if (hash !== erwartet) {
          trackEvent('patch-fehler', 'ergebnis');
          fehlerMerken('ergebnis');
          const info = { grund: 'ergebnis', titel: 'Ergebnis weicht ab',
            text: 'Die erzeugte ROM hat nicht die erwartete Prüfsumme. Es wurde nichts heruntergeladen.' };
          setStatus('Ergebnis weicht von der erwarteten Prüfsumme ab. Kein Download.', 'bad');
          hilfeZeigen(Object.assign({ md5: hash, version: versionVon(modus), browser: navigator.userAgent }, info));
          throw new Error('Patch-Check fehlgeschlagen');
        }
        setStatus(`Fertig. Ergebnis geprüft (${versionVon(modus)}).`, 'good');
      },
      ondownloadstart() {
        trackEvent('patch-erfolg', versionVon(modus).replace(' ', '-'));
        const vorher = fehlerAbholen();
        if (vorher) trackEvent('patch-erfolg-nach-fehler', vorher);
      }
    }, patchFireRed);
    setStatus(port ? 'Bereit. Bitte FireRed (USA) Rev 0, Unbound EN 1.0.1 oder (Port) Unbound EN 2.1.1.1 wählen.'
      : 'Bereit. Bitte FireRed (USA) Rev 0 oder Unbound EN 1.0.1 wählen.');
  } catch (error) {
    setStatus(`Patcher nicht bereit: ${error.message}`, 'bad');
    ui.apply.disabled = true;
  }
}

window.addEventListener('load', start);
