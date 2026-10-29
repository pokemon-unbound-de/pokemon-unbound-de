# Pokémon Unbound auf Deutsch – German Patch (Fan-Übersetzung)

[![Neueste Version](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fpokemon-unbound-de.github.io%2Fpokemon-unbound-de%2Frelease.json&query=%24.version&label=Neueste%20Version&color=blue)](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/latest)

**Pre-Stable ist da!** Spiel Pokémon Unbound auf Deutsch – mit den offiziellen deutschen Pokémon-Begriffen, **bis zum Champ durchspielbar**.

·  🧩 **[Im Browser patchen](https://pokemon-unbound-de.github.io/pokemon-unbound-de/)** 
·  👉 **[Download (neueste Version)](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/latest)** 
·  📖 **[Patch-Anleitung](docs/PATCH_ANLEITUNG.md)** 
·  💬 **[Discord](https://discord.gg/fSkhHppgcv)** 
·  🇩🇪 **[Reddit](https://www.reddit.com/r/PokemonUnboundDE/)**

*English below.*

<p align="center">
  <img src="docs/screenshots/01_title_unbound_de.png" alt="Pokémon Unbound auf Deutsch – Titelbildschirm (German title screen)" width="320">
  <img src="docs/screenshots/04_glumanda_nutzt_kratzer.png" alt="Pokémon Unbound Deutsch – Glumanda nutzt Kratzer (German battle text)" width="320">
</p>

## In 3 Schritten spielen

1. **[Patch-Seite](https://pokemon-unbound-de.github.io/pokemon-unbound-de/) öffnen** (geht auch am Handy) und deine eigene **Pokémon FireRed (USA), Rev 0** auswählen.
2. **Deutsche ROM erstellen** – die Seite prüft deine ROM, patcht im Browser auf die neueste Version und kontrolliert das Ergebnis. Deine ROM wird nicht hochgeladen.
3. **Spielen** in deinem Emulator (z. B. mGBA, Delta, RetroArch).

Andere Wege: Auf der [Release-Seite](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/latest) gibt es beide `.bps`-Dateien – für **FireRed (USA) Rev 0** (`…_von_firered_usa.bps`) und für **Pokémon Unbound (englisch) v1.0.1** (`pokemon_unbound_de_vX.Y.Z.bps`). Die kannst du z. B. mit [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/) oder Flips anwenden.

Klappt etwas nicht? Meist ist es die falsche Basis-ROM – die [Patch-Anleitung](docs/PATCH_ANLEITUNG.md) zeigt, wie du sie per MD5 prüfst.

> **Keine ROMs hier.** Wir verteilen nur den Patch. Du brauchst deine eigene, legal erworbene Basis-ROM.

## Was ist auf Deutsch?

Story, NPC-Dialoge, Kämpfe, Menüs, Items, Attacken, Fähigkeiten und das Missionsbuch, dazu der Titelbildschirm, die Typ-Symbole, der Trainerpass und weitere Grafiken. Ein Test-Bot hat Intro, Wild- und Trainerkampf, Fang, Doppelkampf, Pokédex, Tasche, PC sowie Speichern und Laden im Emulator durchgespielt – ohne Hänger.

## Pre-Stable – Stand und Testphase

- **Bis zum Champ durchspielbar** – komplett getestet von **NevioCore** und **DMkiller**.
- **Testphase:** bis zu 4 Wochen. **Stable v1.0.0** kommt, sobald **14 Tage lang kein Pflichtfehler** gemeldet wurde.
  - **Pflichtfehler:** englische Reste, Text läuft aus dem Fenster, Grammatik/Umlaute, Grafikfehler, Absturz/Speicherproblem.
  - **Kein Blocker:** Stil- und Begriffswünsche – die sammeln wir trotzdem gern.

- Die Übersetzung ist **KI-gestützt** und automatisch geprüft, aber vieles hat noch kein Mensch gegengelesen.
- Manche Namen sind wegen fester Zeichenlimits gekürzt (z. B. einzelne Item-Namen) – Liste: `ABKUERZUNGEN.md` auf der Release-Seite.
- Basis ist Unbound **v1.0.1**, nicht die aktuelle Version 2.x. Spielstände von 2.x passen nicht.
- **Port auf Unbound 2.1.1.1:** startet nach dem Stable; Tester-Vorschau voraussichtlich Ende November 2026 (siehe [Roadmap](ROADMAP.md)).

Offene Fehler, die wir schon kennen:

<!-- BEKANNT:START (automatisch aus der Fehlerliste, Stand 29.10.2026) -->
- Credits & Ende: „Pokémon Unbound Deutsche Edition“; Nevio als Hauptlokalisator … *(folgt mit Stable v1.0.0)*
- Pokédex-Einträge nicht kanonisch („Dieses Meeres-Pokémon …“ bei Dragoran) *(eigener Track)*
- Kampf-Intro „Arenaleiter“ bei Frauen (+ Thronfolgerin, Ass-Trainerin) *(folgt mit dem Port 2.1.1.1)*
- Spieler-Pronomen dort, wo das Original nicht verzweigt (13 neutrale Texte) *(folgt mit dem Port 2.1.1.1)*
- Datum DE-Format, Doppelfragen Speichern/Attacke lernen *(folgt mit dem Port 2.1.1.1)*
- Stockwerke EN (B2F, 1F …) → „2. UG, 1. UG, EG, 1. OG, 2. OG …“ global … *(folgt mit dem Port 2.1.1.1)*
- EN-Rest „Autumn“ + uneinheitliche Ortsnamen (Fund aus Marias … *(folgt mit dem Port 2.1.1.1)*
- Feature Port: Link-Kampf reparieren (FR-Routine beschädigt, laut Leitplanke … *(folgt mit dem Port 2.1.1.1)*
- Port: ~68 Missionstexte in 2.1.1.1 noch EN (Leitplanke-Export „Missionen … *(folgt mit dem Port 2.1.1.1)*
- Deutsche Tastatur (QWERTZ/Umlaute) in Namenseingabe *(folgt mit dem Port 2.1.1.1)*
- … und 1 weitere – komplette Liste: angehefteter Beitrag **„📌 Bekannte Fehler“** in [`#beta-bugs`](https://discord.com/channels/1536411206691328088/1561133876318052444) auf [Discord](https://discord.gg/fSkhHppgcv).
<!-- BEKANNT:ENDE -->

Was sich mit jeder Version geändert hat, steht im [CHANGELOG](CHANGELOG.md). Bereits gemeldete Fehler: angehefteter Beitrag „📌 Bekannte Fehler“ in `#beta-bugs` auf Discord.

## Community & Wiki

- **Wiki:** [unboundwiki.de](https://unboundwiki.de) – das deutsche Pokémon-Unbound-Wiki. Es wird von **Fletcher Mops**
  und **Fabian (Vegetarox)** gepflegt – danke!
- **Namensverzeichnis** (Figuren, Orte, Trainerklassen, Begriffe – DE ↔ EN): [docs/NAMENSVERZEICHNIS.md](docs/NAMENSVERZEICHNIS.md)
- **Discord:** [beitreten](https://discord.gg/fSkhHppgcv) · **Reddit:** [r/PokemonUnboundDE](https://www.reddit.com/r/PokemonUnboundDE/)

## Hilf mit – Fehler melden

Du brauchst kein Vorwissen. Spiel einfach und sag uns, was dir auffällt: englischer Text, abgeschnittene Wörter, Text, der aus dem Kasten läuft, oder komische Formulierungen.

- **Discord:** Kanal `#beta-bugs` – [jetzt beitreten](https://discord.gg/fSkhHppgcv)
- **Reddit:** [r/PokemonUnboundDE](https://www.reddit.com/r/PokemonUnboundDE/) – Fragen, Funde, Screenshots
- **GitHub:** [Übersetzungsfehler melden](https://github.com/pokemon-unbound-de/pokemon-unbound-de/issues/new?template=01-uebersetzungsfehler.yml)

Am besten mit: Ort im Spiel + Screenshot + (gern) deinem Textvorschlag.

---

## English

**The German fan translation of Pokémon Unbound is in public beta!** Story, dialogue, battles, menus, items, moves and abilities are in German, using official Pokémon terminology.

**How to play:** open our [patch page](https://pokemon-unbound-de.github.io/pokemon-unbound-de/), select your own legal **Pokémon FireRed (USA) Rev 0** and create the German ROM right in your browser (latest beta, result is checksum-verified, your ROM is not uploaded). Alternatively, download **one** `.bps` patch from the [latest release](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/latest) – for **FireRed (USA) Rev 0** or **Pokémon Unbound (EN) v1.0.1** – and apply it with [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/) or Flips. MD5 checksums are in `MD5.txt` and the [patch guide](docs/PATCH_ANLEITUNG.md). **No ROMs are provided.**

**It's a beta:** the translation is AI-assisted and machine-checked (text width, names, control codes, plus an emulator test bot), but much of it hasn't been proofread by humans yet. Some names are shortened due to fixed character limits. The Pokédex shows height in meters since v0.1.6 (weight has been in kg since v0.1.4). Known open bugs are pinned in `#beta-bugs` on Discord. Based on Unbound **v1.0.1**, not 2.x; a port to 2.1.1.1 gets a preview in late October 2026 and a beta after the stable release. See the [CHANGELOG](CHANGELOG.md) for what changed.

**Help us:** report anything odd in [Discord](https://discord.gg/fSkhHppgcv) (`#beta-bugs`), on [Reddit](https://www.reddit.com/r/PokemonUnboundDE/) or via [GitHub Issues](https://github.com/pokemon-unbound-de/pokemon-unbound-de/issues/new?template=01-uebersetzungsfehler.yml). German speakers who proofread are especially welcome.

---

## Mehr Bilder

<p align="center">
  <img src="docs/screenshots/starter-selection-de.png" alt="Pokémon Unbound Deutsch – Starter-Auswahl (German starter selection)" width="320">
  <img src="docs/screenshots/double-battle-menu-de.png" alt="Pokémon Unbound Deutsch – Doppelkampf-Menü (German double battle menu)" width="320">
</p>
<p align="center">
  <img src="docs/screenshots/07_dialog_individuelle_staerken.png" alt="Pokémon Unbound Deutsch – NPC erklärt Individuelle Stärken (German NPC dialogue)" width="320">
  <img src="docs/screenshots/14_trainerpass.png" alt="Pokémon Unbound Deutsch – Trainerpass (German trainer card)" width="320">
</p>
<p align="center">
  <img src="docs/screenshots/beta-boot-fallhafen.png" alt="Pokémon Unbound Deutsch – Bootsfahrt nach Fallhafen (German dialogue choice)" width="320">
  <img src="docs/screenshots/beta-fund-pikachium-z.png" alt="Pokémon Unbound Deutsch – Item-Fund mit Beschreibung (German item found popup)" width="320">
</p>

Alle Screenshots stammen aus der deutschen Übersetzung. Hintergrund zur Arbeitsweise: [Release Notes v0.1](docs/RELEASE_NOTES_v0.1.md).

## Rechtliches / Legal

Pokémon Unbound © Skeli. Deutsche Fan-Übersetzung: NevioCore & Community.
Dank an **DMkiller** und **Leitplanke** für technische Hinweise (u. a. Liga-Grafikfehler, Pokédex-Code) sowie an alle Tester*innen.
Pokémon and Pokémon Unbound are owned by their respective rights holders. This is an unofficial, non-commercial fan translation, not affiliated with or endorsed by them. No ROMs, BIOS files, save states or commercial assets are distributed. Details: [docs/LICENSING.md](docs/LICENSING.md) · [docs/LEGAL_NOTICE.md](docs/LEGAL_NOTICE.md)

Mitmachen am Projekt: [CONTRIBUTING.md](CONTRIBUTING.md) · [Roadmap](ROADMAP.md)

<!-- FEHLERLISTE:START (automatisch, Stand 29.10.2026) -->
## Fehlerliste – für Interessierte & Mitentwickler

Alle offenen Punkte mit Nummer und Status: **[docs/BEKANNTE_FEHLER.md](docs/BEKANNTE_FEHLER.md)** (automatisch aus unserer Fehlerliste erzeugt).
<!-- FEHLERLISTE:ENDE -->

<!-- MEILENSTEINE:START (automatisch, Stand 29.10.2026) -->
## Meilensteine

| Schritt | Stand |
|---|---|
| v0.1.7.2 Pre-Stable (Hotfix) | ✔ veröffentlicht |
| Testphase | bis zu 4 Wochen ab v0.1.7 |
| Stable v1.0.0 | nach 14 Tagen ohne Pflichtfehler (EN-Reste, Text läuft aus dem Fenster, Grammatik/Umlaute, Grafik, Absturz/Speichern) – Stil-/Begriffswünsche blockieren nicht |
| Pokédex-Einträge offiziell (#117) | eigener Track, schrittweise |
| Port auf Unbound 2.1.1.1 | in Arbeit (Issue #37) · Tester-Vorschau voraussichtlich Ende November 2026 · Beta nach Stable |

## Mitmachen

Wir suchen weiter **Entwickler, Tester und Talente** (Grafik, Texte, ROM-Hacking). Komm auf unseren Discord: https://discord.gg/fSkhHppgcv
<!-- MEILENSTEINE:ENDE -->
