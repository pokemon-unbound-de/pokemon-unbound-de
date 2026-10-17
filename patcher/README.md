# Patch-Seite – Pokémon Unbound auf Deutsch

Statische Seite für GitHub Pages: patcht die eigene **Pokémon FireRed (USA), Rev 0** direkt im Browser mit dem
deutschen Patch des neuesten Releases. Die ROM verlässt den Browser nicht; es werden keine ROMs bereitgestellt.

- Patch-Engine: [Rom Patcher JS](https://github.com/marcrobledo/RomPatcher.js) (MIT, siehe `ROMPATCHER_LICENSE.txt`).
- `sync_release.py` (läuft im Workflow `.github/workflows/patcher-pages.yml`): holt `.bps` + `MD5.txt` des neuesten
  regulären Releases, prüft Basis-MD5, BPS-CRC und Ergebnis-MD5 und schreibt `release.json`. Vorabversionen werden
  nicht übernommen. Der Release-Text braucht die Zeile `Unbound-Basis: X.Y.Z`.
- Die Seite prüft vor dem Download die MD5 der erzeugten ROM gegen `release.json` (sonst kein Download).
- Statistik ist aus (`stats_config.json`: `enabled: false`).

Pokémon Unbound © Skeli. Unabhängige, nichtkommerzielle Fan-Übersetzung.
