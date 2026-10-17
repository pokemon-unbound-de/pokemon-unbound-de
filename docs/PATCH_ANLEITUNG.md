# Patch-Anleitung – Pokémon Unbound auf Deutsch

[![Neueste Version](https://img.shields.io/github/v/release/pokemon-unbound-de/pokemon-unbound-de?label=Neueste%20Version)](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/latest)

**Credits:** Pokémon Unbound © Skeli. Deutsche Fan-Übersetzung: NevioCore & Community.

> **Wichtig:** Wir verteilen **keine ROMs**. Du brauchst deine **eigene, legal erworbene Basis-ROM**. Bitte frag weder hier noch im Discord nach ROMs oder Download-Links dafür – solche Anfragen und Links werden gelöscht.

## 1. Hauptweg: Patch-Seite (Browser – PC, Handy, Tablet)

Öffne die **[Patch-Seite](https://pokemon-unbound-de.github.io/pokemon-unbound-de/)**, wähle deine eigene **Pokémon FireRed (USA), Rev 0** und tippe auf **Deutsche ROM erstellen**.
Die Seite prüft deine ROM, wendet immer den Patch der **neuesten Beta** an und kontrolliert die fertige ROM per Prüfsumme, bevor sie heruntergeladen wird.
Deine ROM wird dabei nur in deinem Browser verarbeitet und **nicht hochgeladen**.

FireRed **Rev 1**, die europäische/deutsche „Feuerrote Edition“ oder eine bereits gepatchte ROM werden abgelehnt.

## 2. Alternativen (offline / ohne Browser oder mit Unbound-EN-ROM)

Auf der [Release-Seite](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/latest) gibt es beide Patches (`vX.Y.Z` = Versionsnummer der neuesten Beta):

| Weg | Basis-ROM | MD5 der Basis | Patch-Datei |
| --- | --- | --- | --- |
| **A** | Pokémon FireRed (USA), Rev 0 | `e26ee0d44e809351c8ce2d73c7400cdd` | `pokemon_unbound_de_vX.Y.Z_von_firered_usa.bps` (enthält Unbound v1.0.1) |
| B | Pokémon Unbound (englisch) v1.0.1 | `52192d7e7268245e2e30b7d1a802d33d` | `pokemon_unbound_de_vX.Y.Z.bps` |

Beide Wege ergeben exakt dieselbe deutsche ROM. Neuere Unbound-Versionen (z. B. v2.1.1.1) passen **nicht**.
MD5 deiner Datei: Windows `certutil -hashfile "DeineROM.gba" MD5` · macOS `md5 "DeineROM.gba"` · Linux `md5sum "DeineROM.gba"`.

- **[Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/)** (Browser, auch für Weg B): ROM wählen (zeigt die MD5), `.bps` wählen, *Apply patch*.
- **[Floating IPS / Flips](https://github.com/Alcaro/Flips/releases)** (Windows, offline): *Apply Patch* → `.bps` → Basis-ROM → Ziel, z. B. `Pokemon_Unbound_DE_vX.Y.Z.gba`. Ein Prüfsummenfehler heißt: falsche Basis-ROM.
- **UniPatcher** (Android, offline): Patch-Datei und ROM wählen, anwenden – die ROM landet im Ordner der Basis-ROM.

## 3. Spielen und Spielstände

Öffne die deutsche ROM in einem GBA-Emulator deiner Wahl (z. B. mGBA, Delta, RetroArch).

- **Mach vor jedem Update eine Sicherungskopie deiner `.sav`-Datei.**
- **Spielstände der deutschen Beta** laufen nach einem Update weiter (geprüft von v0.1 bis v0.1.4).
- **Spielstände der englischen Unbound v1.0.1** sind meist kompatibel (gleiche Basis), aber ohne Gewähr.
- **Spielstände von Unbound 2.x** passen **nicht**.

## 4. Probleme?

- **Patch schlägt fehl / Prüfsummenfehler / weißer Bildschirm:** fast immer die falsche Basis-ROM → MD5 prüfen (Tabelle oben) oder die Patch-Seite nutzen, die das automatisch tut.
- **Übersetzungsfehler gefunden?** Erst die angehefteten „📌 Bekannten Fehler“ in `#beta-bugs` auf [Discord](https://discord.gg/fSkhHppgcv) ansehen, dann melden – dort oder über das Formular [Übersetzungsfehler melden](https://github.com/pokemon-unbound-de/pokemon-unbound-de/issues/new?template=01-uebersetzungsfehler.yml).

Bitte lade **niemals** ROMs oder gepatchte ROMs hoch – weder in Issues noch im Discord. **Spielstände (`.sav`) gern im Discord-Kanal `#spielstände`** – sie helfen uns, Fehler nachzustellen (in GitHub-Issues bitte keine Dateien außer Screenshots). Screenshots sind super!
