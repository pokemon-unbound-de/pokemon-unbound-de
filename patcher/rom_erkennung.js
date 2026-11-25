/* ROM-Erkennung der Patch-Seite: welche Basis hat die Person gewählt?
   Exakt per MD5 (FireRed USA Rev 0, Unbound EN 1.0.1, Unbound 2.1.1.1 = Port-Basis, alle bereits gepatchten DE-Versionen),
   dann per Dateianfang (Patch-Datei, Archiv), Dateiname (nur lokal, z. B. .sav) und GBA-Header (Spielcode 0xAC, Revision 0xBC,
   fester Wert 0x96 an 0xB2). Nur Prüfsummen/Header, keine Dateidaten verlassen den Browser. */
(function (global) {
  'use strict';

  function headerInfo(u8) {
    if (!u8 || u8.length < 0xC0) return { code: '', rev: -1, gba: false };
    let code = '';
    for (let i = 0xAC; i < 0xB0; i++) code += String.fromCharCode(u8[i]);
    return { code, rev: u8[0xBC], gba: u8[0xB2] === 0x96 };   // 0xB2 = 0x96 steht in jedem echten GBA-Header
  }

  /* Port-Beta (Unbound 2.1.1.1 DE): nur "bereit", wenn release.port.enabled === true UND der Block vollständig und
     wohlgeformt ist (Feature-Flag, Standard AUS). Alles andere gilt als „noch nicht freigegeben“. */
  const HEX32 = /^[a-f0-9]{32}$/, HEX64 = /^[a-f0-9]{64}$/, HEX8 = /^[a-f0-9]{8}$/;
  function portBereit(release) {
    const p = release && release.port;
    return !!(p && p.enabled === true
      && /^\d+(?:\.\d+){2,3}(?:-[A-Za-z0-9._]+)*$/.test(p.version || '')
      && HEX32.test(p.baseMd5 || '') && HEX8.test(p.baseCrc32 || '') && HEX32.test(p.outputMd5 || '')
      && /^patches\/port_[a-z0-9_]+\.bps$/.test(p.fireredPatch || '') && HEX64.test(p.fireredPatchSha256 || '')
      && /^patches\/port_[a-z0-9_]+\.bps$/.test(p.unboundPatch || '') && HEX64.test(p.unboundPatchSha256 || ''));
  }

  function anfang(u8, n) {
    let s = '';
    for (let i = 0; i < Math.min(n, u8 ? u8.length : 0); i++) s += String.fromCharCode(u8[i]);
    return s;
  }

  /* Dateiart aus den ersten Bytes (und lokal aus der Endung): patch | zip | archiv | null.
     ZIP mit ROM entpackt Rom Patcher JS selbst; hier landet nur ein ZIP ohne Spieldatei (z. B. unser Beta-Paket). */
  function dateiArt(u8, dateiname) {
    const s = anfang(u8, 6);
    if (/^(BPS1|UPS1|PATCH|PPF|BDF)/.test(s) || /^\xD6\xC3\xC4/.test(s)) return 'patch';   // \xD6\xC3\xC4 = xdelta/VCDIFF
    if (s.startsWith('PK\x03\x04')) return 'zip';
    if (s.startsWith('7z\xBC\xAF\x27\x1C') || s.startsWith('Rar!') || s.startsWith('\x1F\x8B')) return 'archiv';
    if (/\.(bps|ips|ups|ppf|xdelta)$/i.test(dateiname || '')) return 'patch';
    if (/\.(7z|rar|gz|tar)$/i.test(dateiname || '')) return 'archiv';
    // Browser/Download: statt der Datei wurde eine Webseite gespeichert (Fehlerseite, Weiterleitung, Download-Portal)
    if (/^(\xEF\xBB\xBF)?\s*<(!doctype|html|head|\?xml)/i.test(anfang(u8, 64))) return 'webseite';
    return null;
  }

  const MB16 = 16777216, MB32 = 33554432;
  /* Größe/Kopf (I8 25.11.): -> 'kopf_versatz' | 'unvollstaendig' | 'kopf_kaputt' | null */
  function groesseKopf(u8, size, h) {
    if (u8 && (size === MB16 + 512 || size === MB32 + 512) && u8.length > 512 + 0xB2 && u8[512 + 0xB2] === 0x96) return 'kopf_versatz';
    if (h.gba && h.code.startsWith('BPR') && size < MB16) return 'unvollstaendig';
    if (!h.gba && (size === MB16 || size === MB32)) return 'kopf_kaputt';
    return null;
  }

  function mb(size) { return (size / 1048576).toFixed(1).replace('.', ','); }

  /* Ein Satz: was ist das, und welche Version passt dazu (I3 25.11. 18:40: „Das ist Unbound 2.1.1.1 englisch, passend: …“). */
  function basisSatz(info, release) {
    const port = portBereit(release) ? release.port : null;
    const v = release.version || '';
    const pv = port ? `v${String(port.version).replace(/^v/, '')}` : '';
    const beide = port ? `${v} (Unbound 1.0.1) und die Port-Beta ${pv} (Unbound 2.1.1.1)` : v;
    const keiner = 'passend: keine unserer Versionen';   // was stattdessen nötig ist, steht im Hilfetext darunter
    switch (info.grund) {
      case 'firered': return `Das ist FireRed (USA) Rev 0 englisch, passend: ${beide}.`;
      case 'unbound101': return `Das ist Unbound 1.0.1 englisch, passend: ${v}.`;
      case 'port': return `Das ist Unbound 2.1.1.1 englisch, passend: ${pv ? 'Port-Beta ' + pv : 'die Port-Beta (noch nicht freigegeben)'}.`;
      case 'port_gesperrt': return 'Das ist Unbound 2.1.1.1 englisch, passend: die Port-Beta, die hier noch nicht freigegeben ist.';
      case 'bereits_gepatcht': return `Das ist schon ${info.version_de || 'eine deutsche Version'}, ${info.aktuell ? 'du musst nichts patchen' : keiner}.`;
      case 'unbound2x': return `Das ist ${info.name_2x || 'eine unbekannte 32-MB-Datei auf FireRed-Basis (meist eine andere Unbound-Version oder eine ältere deutsche ROM)'}, ${keiner}.`;
      case 'rev1': return `Das ist FireRed (USA) Rev 1, ${keiner}.`;
      case 'de': return `Das ist die deutsche Feuerrote Edition, ${keiner}.`;
      case 'leafgreen': return `Das ist BlattGrün / LeafGreen, ${keiner}.`;
      case 'firered_sprache': return `Das ist FireRed in einer anderen Sprache, ${keiner}.`;
      case 'firered_veraendert': return `Das ist eine veränderte FireRed (USA) Rev 0, ${keiner}.`;
      case 'unvollstaendig': return `Das ist eine unvollständige FireRed-Datei (${mb(info.size)} MB statt 16 MB), ${keiner}.`;
      case 'kopf_kaputt': return `Das ist eine Datei in ROM-Größe mit beschädigtem Kopf, ${keiner}.`;
      case 'kopf_versatz': return `Das ist eine ROM mit 512 Byte Vorspann, ${keiner}.`;
      case 'webseite': return `Das ist eine gespeicherte Webseite, kein Spiel; ${keiner}.`;
      case 'patchdatei': return `Das ist eine Patch-Datei, kein Spiel; ${keiner}.`;
      case 'archiv': return `Das ist ein Archiv, kein Spiel; ${keiner}.`;
      case 'spielstand': return `Das ist ein Spielstand, kein Spiel; ${keiner}.`;
      case 'anderes_spiel': return `Das ist ein anderes GBA-Spiel, ${keiner}.`;
      case 'keine_gba': return `Das ist keine GBA-Spieldatei, ${keiner}.`;
      default: return `Diese Datei kennen wir nicht, ${keiner}.`;
    }
  }

  /* Anonyme Zählkennung ohne Prüfsumme (I3 25.11.: keine fremden Hashes): Größenklasse + Spielcode-Familie. */
  function zaehlKennung(size, u8) {
    const h = headerInfo(u8);
    const g = size === MB16 ? '16M' : size === MB32 ? '32M' : size < MB16 ? 'klein' : 'andere';
    const f = !h.gba ? 'keingba' : h.code === 'BPRE' ? 'BPRE' : h.code === 'BPRD' ? 'BPRD'
      : h.code.startsWith('BPR') ? 'BPRx' : h.code.startsWith('BPG') ? 'BPGx' : 'gba';
    return `${g}-${f}`;
  }

  const SAVE_GROESSEN = [0x2000, 0x8000, 0x10000, 0x20000, 0x20010];
  function istSpielstand(size, dateiname) {
    return /\.(sav|srm|sa1|sgm|ss\d|st\d|state)$/i.test(dateiname || '') || SAVE_GROESSEN.includes(size);
  }

  function basisText(release) {
    return portBereit(release)
      ? 'FireRed (USA) Rev 0 oder Unbound EN 1.0.1, für die Port-Beta genau Unbound EN 2.1.1.1'
      : 'FireRed (USA) Rev 0 oder Unbound EN 1.0.1';
  }

  /* -> { grund, titel, text, aktion? }
     grund: firered | unbound101 | port | port_gesperrt | bereits_gepatcht | unbound2x | patchdatei | archiv | spielstand |
            rev1 | de | leafgreen | firered_sprache | firered_veraendert | anderes_spiel | keine_gba | unbekannt
     aktion (optional): 'zur_port_beta' = die Seite bietet einen Knopf „Zur Port-Beta wechseln“ an */
  function erkenne(md5, size, u8, release, kennungen, dateiname) {
    const info = erkenneGrund(md5, size, u8, release, kennungen, dateiname);
    info.satz = basisSatz(Object.assign({ size }, info), release);
    return info;
  }

  function erkenneGrund(md5, size, u8, release, kennungen, dateiname) {
    const h = headerInfo(u8);
    md5 = (md5 || '').toLowerCase();
    kennungen = kennungen || {};
    const basis = basisText(release);
    if (md5 === release.baseMd5) return { grund: 'firered' };
    if (release.unboundBaseMd5 && md5 === release.unboundBaseMd5) return { grund: 'unbound101' };
    const port = release.port || {};
    const portBasis = (port.baseMd5 || '').toLowerCase();
    if (portBasis && md5 === portBasis) {                         // Unbound EN 2.1.1.1 = Basis des Ports
      if (portBereit(release)) return { grund: 'port' };
      return { grund: 'port_gesperrt', titel: 'Port-Beta noch nicht freigegeben', untertitel: 'Unbound EN 2.1.1.1 erkannt',
        text: 'Das ist Unbound EN 2.1.1.1, die Basis für den Port. Der Beta-Patch ist hier noch nicht verfügbar. Infos zum Start gibt es auf Discord. Für die bisherige Version brauchst du Unbound EN 1.0.1 oder FireRed (USA) Rev 0.' };
    }

    // Schon deutsch: die aktuellen Ergebnisse stehen in release.json (nie veraltet), ältere in rom_kennungen.json
    if (release.outputMd5 && md5 === release.outputMd5.toLowerCase()) {
      return { grund: 'bereits_gepatcht', version_de: `Pokémon Unbound DE ${release.version}`, aktuell: true,
        titel: 'Das ist schon die aktuelle deutsche Version', untertitel: `Pokémon Unbound DE ${release.version} erkannt`,
        text: `Diese ROM ist bereits Pokémon Unbound DE ${release.version}, die neueste Version. Du musst nichts patchen: spiel einfach weiter.` };
    }
    if (port.outputMd5 && md5 === port.outputMd5.toLowerCase()) {
      return { grund: 'bereits_gepatcht', version_de: `die deutsche Port-Beta ${port.version || ''}`.trim(), aktuell: true,
        titel: 'Das ist schon die aktuelle Port-Beta', untertitel: 'Port-Beta DE erkannt',
        text: `Diese ROM ist bereits die deutsche Port-Beta ${port.version || ''}. Du musst nichts patchen: spiel einfach weiter.` };
    }
    const gepatcht = (kennungen.bereits_gepatcht || {})[md5];
    if (gepatcht) {
      return { grund: 'bereits_gepatcht', version_de: gepatcht, aktuell: false,
        titel: 'Diese ROM ist schon deutsch', untertitel: `${gepatcht} erkannt`,
        text: `Das ist bereits ${gepatcht}. Für das Update brauchst du wieder deine Original-ROM (${basis}). Bei einem Update der 1.0.1-Linie kannst du deinen Spielstand (.sav) einfach weiterverwenden.` };
    }

    const zweix = (kennungen.unbound2x || {})[md5];
    if (zweix) {
      return { grund: 'unbound2x', name_2x: zweix, titel: `${zweix} erkannt`, aktion: portBereit(release) ? 'zur_port_beta' : undefined,
        text: portBereit(release)
          ? 'Für den Port passen FireRed (USA) Rev 0 oder genau Unbound EN 2.1.1.1 mit der jeweiligen passenden Prüfsumme. Der 1.0.1-Patch passt zu Unbound EN 1.0.1 oder FireRed (USA) Rev 0.'
          : 'Für den Port passen genau Unbound EN 2.1.1.1 oder FireRed (USA) Rev 0. Der Beta-Patch ist hier noch nicht verfügbar. Für die bisherige Version kannst du Unbound EN 1.0.1 oder FireRed (USA) Rev 0 verwenden.' };
    }

    // Keine Spieldatei: Patch, Archiv, Spielstand (häufigster Teil von „unbekannt“, Wochenstatistik 23.11.)
    const art = dateiArt(u8, dateiname);
    if (art === 'patch') {
      return { grund: 'patchdatei', titel: 'Das ist eine Patch-Datei, nicht dein Spiel', untertitel: 'Patch-Datei gewählt',
        text: `Du hast eine Patch-Datei (z. B. .bps) gewählt. Den Patch bringt diese Seite schon mit. Wähle hier stattdessen deine eigene Spieldatei (.gba): ${basis}.` };
    }
    if (art === 'zip') {
      return { grund: 'archiv', titel: 'In dieser ZIP-Datei steckt kein Spiel', untertitel: 'ZIP ohne Spieldatei',
        text: `Die ZIP-Datei enthält keine Spieldatei (nur Patch oder Text). Den Patch bringt diese Seite schon mit. Wähle deine eigene Spieldatei (.gba): ${basis}.` };
    }
    if (art === 'archiv') {
      return { grund: 'archiv', titel: 'Bitte zuerst entpacken', untertitel: 'Gepacktes Archiv gewählt',
        text: `Das ist ein gepacktes Archiv (.7z, .rar oder .gz). Entpacke es zuerst, zum Beispiel mit 7-Zip, und wähle dann hier die .gba-Datei darin. Passend: ${basis}.` };
    }
    if (art === 'webseite') {
      return { grund: 'webseite', titel: 'Das ist eine Webseite, kein Spiel', untertitel: 'Webseite statt Spieldatei',
        text: `Beim Herunterladen wurde eine Webseite gespeichert statt der Spieldatei (das passiert bei Fehlerseiten und Download-Portalen). Wähle deine eigene Spieldatei (.gba): ${basis}.` };
    }
    const gk = groesseKopf(u8, size, h);
    if (gk === 'kopf_versatz') {
      return { grund: 'kopf_versatz', titel: 'Vor dem Spiel hängen 512 Byte', untertitel: 'ROM mit Vorspann',
        text: `Die Datei ist 512 Byte größer als eine GBA-ROM, weil vorne ein Kopier-Vorspann hängt. Damit passt keine Prüfsumme. Nimm eine Sicherung ohne Vorspann: ${basis}.` };
    }
    if (gk === 'unvollstaendig') {
      return { grund: 'unvollstaendig', titel: 'Die Datei ist unvollständig', untertitel: `${mb(size)} MB statt 16 MB`,
        text: `Die Datei ist nur ${mb(size)} MB groß. Eine FireRed-ROM hat genau 16 MB. Meist ist der Download abgebrochen oder die ROM wurde gekürzt („trimmed“). Lade bzw. kopiere sie vollständig neu: ${basis}.` };
    }
    if (gk === 'kopf_kaputt') {
      return { grund: 'kopf_kaputt', titel: 'Dateikopf beschädigt', untertitel: 'ROM-Größe, aber kein gültiger Kopf',
        text: `Die Datei hat die Größe einer GBA-ROM, aber ihr Kopf ist beschädigt. Meist ist beim Kopieren oder Herunterladen etwas schiefgegangen. Nimm eine frische Kopie: ${basis}.` };
    }
    if (!h.gba && istSpielstand(size, dateiname)) {
      return { grund: 'spielstand', titel: 'Das ist ein Spielstand, kein Spiel', untertitel: 'Spielstand gewählt',
        text: `Das sieht nach einem Spielstand (.sav) aus. Wähle hier die Spieldatei (.gba): ${basis}. Den Spielstand brauchst du erst beim Spielen im Emulator.` };
    }

    if (size > 16777216 && h.code === 'BPRE') {
      return { grund: 'unbound2x', titel: 'Nicht unterstützte Datei', aktion: portBereit(release) ? 'zur_port_beta' : undefined,
        text: 'Größe und Spielcode deuten auf eine veränderte FireRed-Datei hin; die Version lässt sich nicht sicher erkennen. Oft ist das eine andere Unbound-Version oder eine ältere deutsche Version von uns. Bitte FireRed (USA) Rev 0 oder Unbound EN 1.0.1 verwenden. ' + (portBereit(release)
          ? 'Für den Port passen FireRed (USA) Rev 0 oder genau Unbound EN 2.1.1.1 mit der jeweiligen passenden Prüfsumme.'
          : 'Für den Port passen genau Unbound EN 2.1.1.1 oder FireRed (USA) Rev 0. Der Beta-Patch ist hier noch nicht verfügbar. Infos zum Start gibt es auf Discord.') };
    }
    if (h.code === 'BPRE' && h.rev === 1) {
      return { grund: 'rev1', titel: 'FireRed (USA) Rev 1 erkannt', untertitel: 'FireRed Rev 1 erkannt',
        text: `Du hast FireRed (USA) Rev 1, die spätere Auflage. Wir brauchen Rev 0 (MD5 e26ee0d4…), denn der Patch ist Byte für Byte auf Rev 0 gebaut. Nimm eine Sicherung von FireRed (USA) Rev 0 oder Unbound EN 1.0.1.` };
    }
    if (h.code === 'BPRD') {
      return { grund: 'de', titel: 'Deutsche Feuerrote Edition erkannt', untertitel: 'Feuerrote Edition (DE) erkannt',
        text: 'Das ist die deutsche Feuerrote Edition. Sie passt nicht: Unbound baut auf der englischen Fassung auf. Der Patch braucht FireRed (USA) Rev 0 oder Unbound EN 1.0.1.' };
    }
    if (h.code.startsWith('BPG')) {
      return { grund: 'leafgreen', titel: 'BlattGrün / LeafGreen erkannt', untertitel: 'BlattGrün / LeafGreen erkannt',
        text: 'Unbound basiert auf FireRed, nicht auf BlattGrün. Bitte FireRed (USA) Rev 0 oder Unbound EN 1.0.1 verwenden.' };
    }
    const sicher = h.code.replace(/[^A-Z0-9]/g, '');
    if (h.code.startsWith('BPR') && h.code !== 'BPRE') {
      return { grund: 'firered_sprache', titel: 'FireRed in einer anderen Sprache erkannt', untertitel: `Spielcode ${sicher}`,
        text: `Das ist FireRed in einer anderen Sprache oder Region (Spielcode ${sicher}). Der Patch braucht genau die englische FireRed (USA) Rev 0 oder Unbound EN 1.0.1.` };
    }
    if (h.code === 'BPRE' && h.rev === 0) {
      return { grund: 'firered_veraendert', titel: 'FireRed (USA) Rev 0, aber verändert', untertitel: 'Prüfsumme weicht ab',
        text: 'Das ist FireRed (USA) Rev 0, aber die Datei ist verändert (andere Prüfsumme). Häufige Gründe: ein anderer Patch oder Hack ist schon drin, Cheats oder ein Speicher-Patch, oder die Datei ist gekürzt. Nimm eine unveränderte Sicherung (MD5 e26ee0d4…) oder Unbound EN 1.0.1.' };
    }
    if (!h.gba) {
      return { grund: 'keine_gba', titel: 'Das ist keine GBA-Spieldatei', untertitel: 'Keine GBA-Datei',
        text: `Diese Datei ist kein GBA-Spiel. Wähle deine eigene Spieldatei (.gba): ${basis}.` };
    }
    if (sicher && !h.code.startsWith('BPR')) {
      return { grund: 'anderes_spiel', titel: 'Das ist ein anderes GBA-Spiel', untertitel: `Spielcode ${sicher}`,
        text: `Das ist ein anderes GBA-Spiel (Spielcode ${sicher}). Unbound baut auf FireRed auf. Du brauchst ${basis}.` };
    }
    return { grund: 'unbekannt', titel: 'Diese ROM kennen wir nicht',
      text: `Du brauchst ${basis}.` };
  }

  /* BPS-Fußzeile: die letzten 12 Byte sind Quell-, Ziel- und Patch-CRC32 (little endian). -> Quell-CRC32 als 8 Hex oder null */
  function bpsQuellCrc(u8) {
    if (!u8 || u8.length < 16 || anfang(u8, 4) !== 'BPS1') return null;
    const o = u8.length - 12;
    return ((u8[o] | (u8[o + 1] << 8) | (u8[o + 2] << 16) | (u8[o + 3] << 24)) >>> 0).toString(16).padStart(8, '0');
  }

  function hilfeMail(adresse, info) {
    const betreff = `Hilfe Patch-Seite – ${info.grund}`;
    const text = [
      'Hallo NevioCore-Team,', '', 'beim Patchen kommt bei mir eine Fehlermeldung.', '',
      `Fehlergrund: ${info.grund} (${info.titel || ''})`, `MD5 meiner ROM: ${info.md5 || 'unbekannt'}`,
      ...(info.crc32 ? [`CRC32 meiner ROM: ${info.crc32}`] : []),
      `Patch-Version: ${info.version || ''}`, `Browser: ${info.browser || ''}`, '',
      '(Bitte keine ROM anhängen.)'
    ].join('\n');
    return `mailto:${adresse}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
  }

  const api = { erkenne, headerInfo, hilfeMail, portBereit, dateiArt, bpsQuellCrc, basisSatz, zaehlKennung };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.RomErkennung = api;
})(typeof window !== 'undefined' ? window : globalThis);
