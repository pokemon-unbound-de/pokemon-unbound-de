/* ROM-Erkennung der Patch-Seite: welche Basis hat die Person gewählt?
   Exakt per MD5 (FireRed USA Rev 0, Unbound EN 1.0.1, Unbound 2.1.1.1, alle bereits gepatchten DE-Versionen),
   sonst per GBA-Header (Spielcode 0xAC, Revision 0xBC). Nur Prüfsummen/Header, keine Dateidaten verlassen den Browser. */
(function (global) {
  'use strict';

  function headerInfo(u8) {
    if (!u8 || u8.length < 0xC0) return { code: '', rev: -1 };
    let code = '';
    for (let i = 0xAC; i < 0xB0; i++) code += String.fromCharCode(u8[i]);
    return { code, rev: u8[0xBC] };
  }

  /* -> { grund, titel, text }  grund: firered | unbound101 | bereits_gepatcht | unbound2x | rev1 | de | leafgreen | unbekannt */
  function erkenne(md5, size, u8, release, kennungen) {
    const h = headerInfo(u8);
    md5 = (md5 || '').toLowerCase();
    if (md5 === release.baseMd5) return { grund: 'firered' };
    if (release.unboundBaseMd5 && md5 === release.unboundBaseMd5) return { grund: 'unbound101' };
    const gepatcht = (kennungen.bereits_gepatcht || {})[md5];
    if (gepatcht) {
      return { grund: 'bereits_gepatcht', titel: 'Diese ROM ist schon deutsch',
        text: `Das ist bereits ${gepatcht}. Für ein Update brauchst du wieder deine Original-ROM (FireRed USA Rev 0 oder Unbound EN 1.0.1) – deinen Spielstand (.sav) kannst du einfach weiterverwenden.` };
    }
    const zweix = (kennungen.unbound2x || {})[md5];
    if (zweix || (size > 16777216 && h.code === 'BPRE')) {
      return { grund: 'unbound2x', titel: zweix ? `${zweix} erkannt` : 'Andere Unbound-Version erkannt',
        text: 'Der Patch passt zu Unbound 1.0.1. Der Port auf 2.1.1.1 ist in Arbeit – Infos auf Discord. Bis dahin: Unbound EN 1.0.1 oder FireRed (USA) Rev 0 verwenden.' };
    }
    if (h.code === 'BPRE' && h.rev === 1) {
      return { grund: 'rev1', titel: 'FireRed (USA) Rev 1 erkannt',
        text: 'Das ist die spätere Revision 1. Der Patch braucht FireRed (USA) Rev 0 (MD5 e26ee0d4…).' };
    }
    if (h.code === 'BPRD') {
      return { grund: 'de', titel: 'Feuerrote Edition (deutsch) erkannt',
        text: 'Der Patch braucht die englische FireRed (USA) Rev 0 – die deutsche Feuerrote Edition passt nicht.' };
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

  const api = { erkenne, headerInfo, hilfeMail };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.RomErkennung = api;
})(typeof window !== 'undefined' ? window : globalThis);
