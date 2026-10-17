const ui = {
  version: document.getElementById('version'),
  unboundVersion: document.getElementById('unbound-version'),
  releaseLink: document.getElementById('release-link'),
  status: document.getElementById('status'),
  statusDot: document.getElementById('status-dot'),
  verifyLine: document.getElementById('verify-line'),
  fileLabel: document.getElementById('file-label'),
  fileSubtitle: document.getElementById('file-subtitle'),
  telemetryNote: document.getElementById('telemetry-note'),
  fileInput: document.getElementById('rom-patcher-input-file-rom'),
  apply: document.getElementById('rom-patcher-button-apply')
};

function setStatus(message, kind = 'idle') {
  ui.status.textContent = message;
  ui.statusDot.dataset.kind = kind;
  ui.verifyLine.dataset.kind = kind;
}

let statsEndpoint = null;

function reportDownloadStart(release) {
  if (!statsEndpoint) return;
  const body = JSON.stringify({ release: release.version, unbound: release.unboundVersion });
  fetch(statsEndpoint, {
    method: 'POST',
    mode: 'cors',
    credentials: 'omit',
    referrerPolicy: 'no-referrer',
    headers: { 'Content-Type': 'text/plain' },
    body,
    keepalive: true
  }).catch(() => {});
}

async function start() {
  try {
    const response = await fetch('release.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Release-Manifest: HTTP ${response.status}`);
    const release = await response.json();
    if (!/^v\d+\.\d+(?:\.\d+)?$/.test(release.version) || !/^\d+(?:\.\d+){2,3}$/.test(release.unboundVersion) || !/^[a-f0-9]{32}$/.test(release.baseMd5)) {
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
    try {
      const statsResponse = await fetch('stats_config.json', { cache: 'no-store' });
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        if (stats.enabled && /^https:\/\//.test(stats.endpoint || '')) {
          statsEndpoint = stats.endpoint;
          ui.telemetryNote.hidden = false;
        }
      }
    } catch (_) {
      statsEndpoint = null;
    }
    RomPatcherWeb.initialize({
      language: 'de',
      requireValidation: true,
      allowDropFiles: false,
      onloadrom(romFile) {
        ui.fileLabel.textContent = romFile.fileName || ui.fileInput.files[0]?.name || 'ROM ausgewählt';
        ui.fileSubtitle.textContent = 'Basis wird geprüft';
        setStatus('Prüfsumme wird berechnet …');
      },
      onvalidaterom(_romFile, valid) {
        ui.fileSubtitle.textContent = valid ? 'FireRed Rev 0 erkannt' : 'Nicht unterstützte ROM';
        setStatus(valid ? 'Basis geprüft. Bereit zum Patchen.' : 'Falsche Basis: Bitte FireRed (USA), Rev 0 wählen.', valid ? 'good' : 'bad');
      },
      onpatch(romFile) {
        const hash = romFile.hashMD5().toLowerCase();
        if (hash !== release.outputMd5) {
          setStatus('Ergebnis weicht von der erwarteten Prüfsumme ab. Kein Download.', 'bad');
          throw new Error('Patch-Check fehlgeschlagen');
        }
        setStatus(`Fertig. Ergebnis geprüft (${release.version}).`, 'good');
      },
      ondownloadstart() {
        reportDownloadStart(release);
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
