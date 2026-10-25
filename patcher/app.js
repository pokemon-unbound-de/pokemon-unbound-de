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
  apply: document.getElementById('rom-patcher-button-apply')
};

function setStatus(message, kind = 'idle') {
  ui.status.textContent = message;
  ui.statusDot.dataset.kind = kind;
  ui.verifyLine.dataset.kind = kind;
}

const pendingEvents = [];
let invalidBaseCounted = false;

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

async function start() {
  try {
    const response = await fetch('release.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Release-Manifest: HTTP ${response.status}`);
    const release = await response.json();
    if (!/^v\d+\.\d+(?:\.\d+){0,2}$/.test(release.version) || !/^\d+(?:\.\d+){2,3}$/.test(release.unboundVersion) || !/^[a-f0-9]{32}$/.test(release.baseMd5)) {
      throw new Error('Release-Manifest ungültig');
    }
    ui.version.textContent = release.version;
    ui.unboundVersion.textContent = release.unboundVersion;
    ui.releaseLink.href = release.releaseUrl;
    const latestResponse = await fetch('https://api.github.com/repos/pokemon-unbound-de/pokemon-unbound-de/releases/latest', { cache: 'no-store' });
    if (!latestResponse.ok) throw new Error('Aktuellen GitHub-Release nicht prüfbar');
    const latest = await latestResponse.json();
    if (latest.tag_name !== release.version) {
      throw new Error(`Neuer Release ${latest.tag_name} erkannt. Patch wird aktualisiert; bitte später erneut laden.`);
    }
    const directPatch = document.getElementById('bps-direct');
    directPatch.href = `${release.patch}?sha=${release.patchSha256.slice(0, 12)}`;
    directPatch.download = `Pokemon_Unbound_${release.unboundVersion}_DE_${release.version}.bps`;
    directPatch.hidden = false;
    directPatch.addEventListener('click', () => trackEvent('bps-direkt', release.version));
    RomPatcherWeb.initialize({
      language: 'de',
      requireValidation: true,
      allowDropFiles: false,
      onloadrom(romFile) {
        invalidBaseCounted = false;
        trackEvent('rom-gewaehlt');
        ui.fileLabel.textContent = romFile.fileName || ui.fileInput.files[0]?.name || 'ROM ausgewählt';
        ui.fileSubtitle.textContent = 'Basis wird geprüft';
        setStatus('Prüfsumme wird berechnet …');
      },
      onvalidaterom(_romFile, valid) {
        if (!valid && !invalidBaseCounted) {
          trackEvent('patch-fehler');
          invalidBaseCounted = true;
        }
        ui.fileSubtitle.textContent = valid ? 'FireRed Rev 0 erkannt' : 'Nicht unterstützte ROM';
        setStatus(valid ? 'Basis geprüft. Bereit zum Patchen.' : 'Falsche Basis: Bitte FireRed (USA), Rev 0 wählen.', valid ? 'good' : 'bad');
      },
      onpatch(romFile) {
        const hash = romFile.hashMD5().toLowerCase();
        if (hash !== release.outputMd5) {
          trackEvent('patch-fehler');
          setStatus('Ergebnis weicht von der erwarteten Prüfsumme ab. Kein Download.', 'bad');
          throw new Error('Patch-Check fehlgeschlagen');
        }
        setStatus(`Fertig. Ergebnis geprüft (${release.version}).`, 'good');
      },
      ondownloadstart() {
        trackEvent('patch-erfolg', release.version);
      }
    }, {
      file: `${release.patch}?sha=${release.patchSha256.slice(0, 12)}`,
      name: `Pokémon Unbound DE ${release.version}`,
      inputMd5: release.baseMd5,
      inputCrc32: parseInt(release.baseCrc32, 16),
      outputName: `Pokemon_Unbound_${release.unboundVersion}_DE_${release.version}`
    });
    setStatus('Bereit. Bitte FireRed (USA), Rev 0 wählen.');
  } catch (error) {
    setStatus(`Patcher nicht bereit: ${error.message}`, 'bad');
    ui.apply.disabled = true;
  }
}

window.addEventListener('load', start);
