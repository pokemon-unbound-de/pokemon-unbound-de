/* ROM-Erkennung der Patch-Seite: welche Basis hat die Person gewählt?
   Exakt per MD5 (FireRed USA Rev 0, Unbound EN 1.0.1, Unbound 2.1.1.1 = Port-Basis, alle bereits gepatchten DE-Versionen),
   sonst per GBA-Header (Spielcode 0xAC, Revision 0xBC). Nur Prüfsummen/Header, keine Dateidaten verlassen den Browser. */
(function (global) {
  'use strict';

  function headerInfo(u8) {
    if (!u8 || u8.length < 0xC0) return { code: '', rev: -1 };
    let code = '';
    for (let i = 0xAC; i < 0xB0; i++) code += String.fromCharCode(u8[i]);
    return { code, rev: u8[0xBC] };
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

  /* -> { grund, titel, text }  grund: firered | unbound101 | port | port_gesperrt | bereits_gepatcht | unbound2x | rev1 | de | leafgreen | unbekannt */
  function erkenne(md5, size, u8, release, kennungen) {
    const h = headerInfo(u8);
    md5 = (md5 || '').toLowerCase();
    if (md5 === release.baseMd5) return { grund: 'firered' };
    if (release.unboundBaseMd5 && md5 === release.unboundBaseMd5) return { grund: 'unbound101' };
    const port = release.port || {};
    const portBasis = (port.baseMd5 || '').toLowerCase();
    if (portBasis && md5 === portBasis) {                         // Unbound EN 2.1.1.1 = Basis des Ports
      if (portBereit(release)) return { grund: 'port' };
      return { grund: 'port_gesperrt', titel: 'Port-Beta noch nicht freigegeben', untertitel: 'Unbound EN 2.1.1.1 erkannt',
        text: 'Das ist Unbound EN 2.1.1.1, die Basis für den Port. Der Beta-Patch ist hier noch nicht verfügbar. Infos zum Start gibt es auf Discord. Für die bisherige Version brauchst du Unbound EN 1.0.1 oder FireRed (USA) Rev 0.' };
    }
    const gepatcht = (kennungen.bereits_gepatcht || {})[md5];
    if (gepatcht) {
      return { grund: 'bereits_gepatcht', titel: 'Diese ROM ist schon deutsch',
        text: `Das ist bereits ${gepatcht}. Für ein Update brauchst du wieder deine Original-ROM (FireRed USA Rev 0 oder Unbound EN 1.0.1) – deinen Spielstand (.sav) kannst du einfach weiterverwenden.` };
    }
    const zweix = (kennungen.unbound2x || {})[md5];
    if (zweix) {
      return { grund: 'unbound2x', titel: `${zweix} erkannt`,
        text: portBereit(release)
          ? 'Für den Port passen FireRed (USA) Rev 0 oder genau Unbound EN 2.1.1.1 mit der jeweiligen passenden Prüfsumme. Der 1.0.1-Patch passt zu Unbound EN 1.0.1 oder FireRed (USA) Rev 0.'
          : 'Für den Port brauchst du genau Unbound EN 2.1.1.1. Der Beta-Patch ist hier noch nicht verfügbar. Für die bisherige Version brauchst du Unbound EN 1.0.1 oder FireRed (USA) Rev 0.' };
    }
    if (size > 16777216 && h.code === 'BPRE') {
      return { grund: 'unbound2x', titel: 'Nicht unterstützte Datei',
        text: 'Größe und Spielcode deuten auf eine veränderte FireRed-Datei hin; die Version lässt sich nicht sicher erkennen. Bitte FireRed (USA) Rev 0 oder Unbound EN 1.0.1 verwenden. ' + (portBereit(release)
          ? 'Für den Port passen FireRed (USA) Rev 0 oder genau Unbound EN 2.1.1.1 mit der jeweiligen passenden Prüfsumme.'
          : 'Für genau Unbound EN 2.1.1.1 ist der Beta-Patch hier noch nicht verfügbar. Infos zum Start gibt es auf Discord.') };
    }
    if (h.code === 'BPRE' && h.rev === 1) {
      return { grund: 'rev1', titel: 'FireRed (USA) Rev 1 erkannt',
        text: 'Das ist die spätere Revision 1. Der Patch braucht FireRed (USA) Rev 0 (MD5 e26ee0d4…).' };
    }
    if (h.code === 'BPRD') {
      return { grund: 'de', titel: 'Möglicherweise deutsche Feuerrote Edition',
        text: 'Der Spielcode deutet auf die deutsche Feuerrote Edition hin; diese Datei passt nicht. Der Patch benötigt die englische FireRed (USA) Rev 0 (1.0) oder Unbound EN 1.0.1.' };
    }
    if (h.code.startsWith('BPG')) {
      return { grund: 'leafgreen', titel: 'BlattGrün / LeafGreen erkannt',
        text: 'Unbound basiert auf FireRed. Bitte FireRed (USA) Rev 0 verwenden.' };
    }
    return { grund: 'unbekannt', titel: 'Diese ROM kennen wir nicht',
      text: 'Du brauchst FireRed (USA) Rev 0 oder Unbound EN 1.0.1.' };
  }

  function hilfeMail(adresse, info) {
    const betreff = `Hilfe Patch-Seite – ${info.grund}`;
    const text = [
      'Hallo NevioCore-Team,', '', 'beim Patchen kommt bei mir eine Fehlermeldung.', '',
      `Fehlergrund: ${info.grund} (${info.titel || ''})`, `MD5 meiner ROM: ${info.md5 || 'unbekannt'}`,
      `Patch-Version: ${info.version || ''}`, `Browser: ${info.browser || ''}`, '',
      '(Bitte keine ROM anhängen.)'
    ].join('\n');
    return `mailto:${adresse}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`;
  }

  const api = { erkenne, headerInfo, hilfeMail, portBereit };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.RomErkennung = api;
})(typeof window !== 'undefined' ? window : globalThis);
