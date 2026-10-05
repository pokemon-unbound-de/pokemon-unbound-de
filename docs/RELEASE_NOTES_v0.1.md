# Release Notes – Beta v0.1

**Veröffentlichung:** 08.10.2026 · **Download:** erscheint am 08.10. auf der Release-Seite
**Weg A (Hauptweg):** Pokémon FireRed (USA, Rev 0) → Unbound v1.0.1 Deutsch · MD5 der Basis `e26ee0d44e809351c8ce2d73c7400cdd` · Patch `pokemon_unbound_de_v0.1_von_firered_usa.bps`  
**Weg B (für Besitzer von Unbound EN v1.0.1):** MD5 der Basis `52192d7e7268245e2e30b7d1a802d33d` · Patch `pokemon_unbound_de_v0.1.bps`  
Beide Wege ergeben exakt dieselbe deutsche ROM.

**Credits:** Pokémon Unbound © Skeli. Deutsche Fan-Übersetzung: NevioCore & Community.

Hallo zusammen! 👋 Das ist die erste öffentliche Beta der deutschen Fan-Übersetzung von **Pokémon Unbound**. Sie ist zum Spielen, Testen und Mithelfen gedacht – **nicht** die fertige Übersetzung.

## Wo wir stehen

| | |
|---|---|
| Übersetzte Texteinträge | rund **17.000** (Story, NPCs, Kampf, Menüs, Beschreibungen) |
| Feste Namenstabellen (Pokémon, Attacken, Items, Fähigkeiten, Typen …) | rund **3.200** Einträge, automatisch auf Gültigkeit geprüft |
| Sichtbarer Text auf Deutsch (maschinelle Messung) | ca. **98 %** |
| Übersetzungswellen | 16 + Korrekturwellen |

„98 %“ heißt: Fast jeder Text, den das Spiel anzeigt, hat eine deutsche Fassung. Es heißt **nicht**, dass jede Formulierung schon gut klingt. Die meisten Texte sind KI-gestützt übersetzt und automatisch geprüft, aber noch nicht alle von Menschen gelesen.

## Was ihr erwarten könnt

- Story, NPC-Dialoge, Kämpfe, Menüs, Items, Attacken, Fähigkeiten und Missionsbuch auf Deutsch, mit offiziellen deutschen Pokémon-Begriffen.
- Deutscher Titelbildschirm.

## Bekannte Grenzen

- Einige **Grafiken** zeigen noch Englisch, z. B. „POWER/ACCURACY“ im Attacken-Bericht und einige Bericht-Labels.
- Im Pokédex werden **Größe und Gewicht** noch in englischen Einheiten (Fuß/Pfund) angezeigt.
- Einzelne Formulierungen sind holprig oder nicht ganz lore-treu – genau hier brauchen wir euch.
- Selten genutzte Funktionen aus dem FireRed-Unterbau (z. B. Link-/Drahtlos-Funktionen) sind weniger getestet.
- Die Beta basiert auf Unbound v1.0.1 (laut Titelbildschirm der Basis-ROM), nicht auf der aktuellen v2.1.1.1 (siehe README).

## Wie wir gearbeitet haben

Ehrlich gesagt: Ohne KI-Werkzeuge wäre dieser Umfang in dieser Zeit nicht möglich gewesen. Wir haben eine Pipeline gebaut, in der

1. Texte aus der ROM gezogen, in **Wellen** KI-gestützt übersetzt und mit einem Glossar offizieller Begriffe abgeglichen werden,
2. jede Welle durch **automatische Prüfungen** muss, bevor sie gebaut wird, unter anderem:
   - Steuercodes und Namens-Platzhalter vollständig (kein Spielername, kein Pokémon-Name darf verloren gehen),
   - **Textbreite** pro Zeile – am echten Bildschirm kalibriert (208 Pixel sichtbar),
   - **Terminologie** und Sperrliste (z. B. „Pokémon-Supermarkt“ statt „Pokémart“, „AP“ statt „PP“),
   - **Zeiger-Zuordnung**: jeder umgebogene Zeiger muss auf die deutsche Fassung *genau seines* englischen Originals zeigen,
   - Namenstabellen, Silbentrennung, Geld- und Zahlenformate,
3. ein **Test-Bot** im Emulator das Spiel automatisch durchläuft – bisher **368 Karten**, rund **290 NPCs mit Trainerkämpfen**, **200 Schilder** sowie Tasche, Pokédex, PC, Missionsbuch und Titelbildschirm – und dabei Bildschirmtexte und Screenshots auswertet (Englisch-Reste, abgeschnittener Text, leere Namen, Kontrast).

Jeder Fehler, den Bot oder Tester gefunden haben, wurde nicht nur einzeln repariert, sondern als **Fehlerklasse** verallgemeinert und als neue automatische Prüfung eingebaut. Beispiele:

- Ein Kampftext wurde im Spiel aus zwei Nachbar-Texten „berechnet“ – nach dem Verschieben landete das Spiel im falschen Text („warf Köder“ statt „schickte … in den Kampf“).
- Eine Datentabelle begann mit einem Spitznamen und wurde versehentlich wie Text behandelt – ein Tausch-NPC zeigte danach „ü“ statt eines Pokémon-Namens.
- Silbentrennungen wurden in einzeiligen Item-Popups sichtbar („gegne- rische“).
- Zeilen waren 5 Pixel zu breit für die Textbox.

## Wie GBA-Übersetzungen funktionieren (kurz)

Ein GBA-Spiel findet seine Texte über **Zeiger** – Speicheradressen, die auf den Text zeigen. Deutsche Texte sind meist länger als englische und passen nicht an die alte Stelle. Sie werden in freien Speicher geschrieben, und alle Zeiger darauf werden „umgebogen“. Schwierig wird es, wenn das Spiel Texte nicht per Zeiger, sondern über Rechnungen, Tabellen oder feste Positionen findet – genau dort entstehen die kniffligsten Fehler. Dazu kommen feste **Textbreiten** (jedes Zeichen hat eine eigene Pixelbreite) und Texte, die als **Grafik** gezeichnet sind und neu gemalt werden müssen.

## Wie es weitergeht: Menschen machen es menschlich

Die Beta ist die Grundlage – jetzt kommt der wichtigste Teil:

- **Community-Pakete:** Sätze in kleinen Paketen (10/20/100), Englisch und KI-Deutsch nebeneinander. Ihr verbessert, was holprig klingt.
- **Discord:** kleine Häppchen direkt im Chat verbessern.
- **Tester:** spielt, findet Fehler, meldet sie mit Ort und Screenshot.

Jede Verbesserung läuft durch dieselben automatischen Prüfungen und fließt in die nächste Version ein.

## Installation

Eigene, legal erworbene Basis-ROM + `.bps`-Patch + Patch-Tool. **Hauptweg:** Pokémon FireRed (USA) als Basis (Weg A) – der Patch enthält Unbound v1.0.1, das offiziell nicht mehr erhältlich ist. Wer die englische Unbound-ROM v1.0.1 hat, nimmt Weg B. Schritt für Schritt: [Patch-Anleitung](PATCH_ANLEITUNG.md). Wir verteilen **keine ROMs**.

## Feedback & Community

- Fehler melden: [Übersetzungsfehler melden](https://github.com/pokemon-unbound-de/pokemon-unbound-de/issues/new?template=01-uebersetzungsfehler.yml) – mit Ort im Spiel und Screenshot.
- **Discord:** https://discord.gg/fSkhHppgcv

## Danke

- **Skeli und das Unbound-Team** – für Pokémon Unbound selbst (Pokémon Unbound © Skeli).
- **NevioCore** – Projektleitung, Tests, Entscheidungen.
- **Die Community** – Tester, Reviewer und alle, die mithelfen, die Übersetzung menschlich zu machen.

---

Inoffizielle Fan-Übersetzung, nicht mit den Rechteinhabern verbunden oder von ihnen unterstützt. Pokémon und Pokémon Unbound gehören ihren jeweiligen Rechteinhabern.
