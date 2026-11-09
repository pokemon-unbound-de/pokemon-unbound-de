# Patch-Seite – Pokémon Unbound auf Deutsch

Statische Seite für GitHub Pages: patcht die eigene **Pokémon FireRed (USA), Rev 0** direkt im Browser mit dem
deutschen Patch des neuesten Releases. Die ROM verlässt den Browser nicht; es werden keine ROMs bereitgestellt.

- Patch-Engine: [Rom Patcher JS](https://github.com/marcrobledo/RomPatcher.js) (MIT, siehe `ROMPATCHER_LICENSE.txt`).
- `sync_release.py` (läuft im Workflow `.github/workflows/patcher-pages.yml`): holt `.bps` + `MD5.txt` des neuesten
  regulären Releases, prüft Basis-MD5, BPS-CRC und Ergebnis-MD5 und schreibt `release.json`. Vorabversionen werden
  nicht übernommen. Der Release-Text braucht die Zeile `Unbound-Basis: X.Y.Z`.
- Die Seite prüft vor dem Download die MD5 der erzeugten ROM gegen `release.json` (sonst kein Download).
- Statistik ist aus (`stats_config.json`: `enabled: false`).

## Port-Beta (Unbound 2.1.1.1) – Feature-Flag, Standard AUS

`release.json` hat den optionalen Block `port`. Solange `port.enabled` `false` ist (Stand jetzt), liefert die Seite
keinen Port-Patch aus: eine erkannte Unbound-EN-2.1.1.1-ROM (MD5 `9cad8e77…`) bekommt die Meldung „Port-Beta noch
nicht freigegeben“, sonst ändert sich nichts. `sync_release.py` schreibt dann nur die Basis-Kennung und greift nicht
auf ein Port-Release zu.

Freischalten (erst nach der Port-Beta, nur per Pull Request nach Freigabe):
1. Port-Release mit Tag `port-v<Version>` (z. B. `port-v2.1.1.1-DE-0.1-beta`, Vorabversion erlaubt) anlegen. Assets:
   `PRUEFSUMMEN.txt` im Format der Port-Vorschau (`== Weg A` FireRed, `== Weg B` Unbound 2.1.1.1, `== Ergebnis`, je mit
   MD5/SHA-256/CRC32 und je einer Zeile `Patch <name>.bps (SHA-256 …)`) und die beiden BPS (FireRed → Port ca. 17 MB,
   Unbound 2.1.1.1 → Port ca. 1 MB).
2. In `release.json` `port.enabled` auf `true` und `port.tag` auf den Tag setzen, dann `python patcher/sync_release.py`
   (oder den Workflow) laufen lassen. Der Sync prüft Basis-Prüfsummen, SHA-256 der Assets, BPS-CRCs und dass beide Wege
   dasselbe Ergebnis liefern, spiegelt die Patches nach `patches/port_*.bps` und trägt Ergebnis-MD5, Version und
   Hashes in `port` ein. Schlägt eine Prüfung fehl, bricht der Sync ab (die Seite wird dann nicht veröffentlicht).
3. Die Seite zeigt dann die Auswahl „Unbound 1.0.1 DE“ / „Port Unbound 2.1.1 DE (Beta)“: FireRed Rev 0 → je nach
   Auswahl, Unbound 2.1.1.1 → immer Port. Das Ergebnis wird gegen `port.outputMd5` geprüft.

Tests: `node patcher/test_rom_erkennung.mjs` (Erkennung, Flag, Block-Prüfung) und `python patcher/test_sync_port.py`
(Port-Teil des Syncs, offline mit erfundenen Mini-Patches). Es liegen keine ROM-Daten und keine Port-Patches im Repo.

Pokémon Unbound © Skeli. Unabhängige, nichtkommerzielle Fan-Übersetzung.
