# Pokémon Unbound auf Deutsch – Änderungsprotokoll

## v0.1.5 (2026-10-18)

**Build:** `581e6b39…` · **Patches:** `pokemon_unbound_de_v0.1.5_von_firered_usa.bps` (Hauptweg, FireRed USA Rev 0) oder `pokemon_unbound_de_v0.1.5.bps` (Unbound EN v1.0.1) · Prüfsummen: `MD5.txt`

Unbound-Basis: 1.0.1

Danke: Grafikfehler von **Nevio** gefunden, von **DMkiller** eingegrenzt.

### Hotfix: Entschuldigung, Grafikfehler Top Vier jetzt vollständig behoben
- **Kampfhintergründe Top Vier / Champ:** v0.1.4 hielt betroffene Grafikbereiche nur zum Teil frei – große
  Kampfgrafiken wurden dahinter trotzdem von Text überschrieben. Jetzt bleibt jeder Bereich, auf den das Spiel
  zeigt, komplett frei, auch Einträge in Grafiktabellen. Geprüft in Kämpfen gegen alle Top Vier, den Champ und drei
  weitere Kampfhintergründe (Arena, Wald, Höhle): Hintergründe wie im englischen Original.
- **TM-Box:** alle Beschreibungen von TM01–TM120 und VM01–08 passen in den Kasten; „HM01–08“ heißt jetzt
  „VM01–08“.
- **Statuswerte deutsch:** KP, Angr., Vert., Init., SpAng, SpVert – Level-up-Box, Statusseite, Vitamine.
- **Optionen:** Musiktitel laufen nicht mehr aus dem Feld (z. B. „Galar-Wildkampf“ statt „Kampf! Galar-Wild-P…“).
- **DexNav:** „Wasser“; Tastenzeile „Merken / Zurück“ passt in die Zeile.

### Kampftexte
- Gegnerische Pokémon heißen jetzt „Gegner Libelldra“ (wilde: „Wild-Pikachu“) – grammatisch überall richtig
  („Angriff von Gegner Libelldra sinkt“ statt „von Gegnerisches …“), und lange Sätze laufen nicht mehr aus der Box.
- Kampftexte **teilweise** in der Gegenwart wie in den offiziellen Spielen („Maulwurf schickt Stalobor in den
  Kampf!“, „setzt … ein“, „ruft … zurück“) – der Rest folgt in v0.1.6.
- „erhält spezielle … E.-Punkte“ (offizieller Wortlaut), „reagiert auf den Mega-Armreif von …“.

### Außerdem
- Trainerklassen vervollständigt (u. a. Team Aqua, Polizist, Lady, Spieler, Interviewer, Primapaar).
- Schattenbasis durchgehend „Sie“, Zeph-Szene korrigiert, „Fordere die Arena von … heraus!“.
- „Poké Markt“ einheitlich.

### Neue automatische Prüfungen
- Grafikbereiche bis zum Ende freigehalten, Kampfhintergrund-Tabellen, wiederverwendeter Speicher, TM/VM-Kasten,
  englische Statuskürzel, Optionswerte gegen Feldbreite.

### Bekannt / noch offen
- Top Vier: kurzes Pixeln beim Einblenden zu Kampfbeginn (#71d); Namensbox „Maulwurfmann“ statt „Maulwurf“ (#105).
- Weitere Kampftexte noch in der Vergangenheit (v0.1.6).
- TM-Box: das kleine „HM“-Symbol vor den VMs ist Grafik und folgt.
- DexNav-Überschriften (SEARCH, SPECIES, …) sind Grafik und folgen.
- Pokédex A–Z nach deutschen Namen folgt in v0.1.6.
- „Oberwelt-Musik“ bleibt, bis die Abstimmung entschieden ist.
- Pokédex-Größe in Metern folgt.

## v0.1.4 (17.10.2026)
Danke an **DMkiller** (Hinweis zu den Liga-Grafikfehlern) und **Leitplanke** (Pokédex-Code für Kilogramm)!
- **Grafikfehler im Kampf bei Siegesstraße / Top Vier behoben** – als Fehlerklasse: 36 Speicherstellen, die das Spiel
  für Kampfhintergründe liest, werden freigehalten; neue automatische Prüfung.
- **Pokédex-Gewicht in Kilogramm** („11,0 kg“).
- **Namen:** Moloch (statt „Big Mo“), Arabella, Wissenschafts-Syndikat, Mühlensippe – überall einheitlich.
- **Wetter offiziell** (Regen, Sandsturm); Attackenseite und TM-Kasten mit demselben Text; „Moment …“ statt „Warte …“.
- **Lesefluss:** neuer Satz nach Satzende beginnt eine neue Textbox (60 Texte).
Details: [Release v0.1.4](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/v0.1.4).

## v0.1.3 (12.10.2026)
- **Lesefluss:** neue Textbox nur noch dort, wo das Original eine beginnt – kein Neustart mitten im Satz mehr
  (rund 270 Texte, vor allem späte Story).
- **Shops/Preislisten deutsch** (fast 100 Zeilen: Spielhalle, BP-Tausch, Attacken-Lehrer, TM-Listen, Café), **Münzen**
  statt „Coins“; Level-up-Fenster **Max. KP**.
- **Wissenschaftsverein** statt „Science Society“; Regen ohne „Wolkenbruch“; Fundmeldung „… verstaut Trank im Würfel“;
  Donnerkappe-Rüpel deutsch; offizieller Fluchtseil-Text.
- **Storyfiguren:** Maulwurf, Stachel, Lilli, Timo.
Details: [Release v0.1.3](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/v0.1.3).

## v0.1.2 – Hotfix (11.10.2026)
- **PC-Menü** wieder komplett deutsch (Regression aus v0.1.1): Pokémon nehmen / ablegen / bewegen, Items bewegen, Tschüss!
- **Mengen:** kein englisches Plural-„s“ mehr („2× Traumnebel erhalten!“); Fundmeldungen für mehrere Items deutsch
  („Lila hat 2× Äther gefunden!“).
- **Ivoria** statt „Herrin Alba“; „Du hast dich auf die Bank gesetzt.“
- Neue Prüfungen: Mengen-Vorlagen, alte Namensvarianten, Regressions-Prüfung gegen das letzte Release.
Details: [Release v0.1.2](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/v0.1.2).

## v0.1.1 – Fix-Update (11.10.2026)
Behebt die gemeldeten Fehler als **Fehlerklassen** (überall im Spiel, mit neuer automatischer Prüfung je Klasse):
- **Namen:** Wermut, Wega, Alice, Frida einheitlich; Artnamen gegen PokéWiki geprüft (z. B. Krawell, Krarmor,
  Lauchzelot, Porenta); Trainer auf Routen tragen deutsche und internationale Namen.
- **Geschlecht:** Trainerinnen tragen die weibliche Klassenform (z. B. Expertin, Skifahrerin, Forscherin);
  „er/sie“ statt „es“ für dich; Geschlechtswörter im Spiel deutsch.
- **Englische Reste:** Nachkampftexte, Kampfmeldungen, Mehrfachauswahl, Kartenlabel, Fee-Typ, drei Attacken.
- **Textkästen:** Item- und TM-Beschreibungen passen in den Kasten; Dialoge brechen früher um;
  fehlendes Leerzeichen nach der A-Knopf-Glyphe.
- **Repariert:** Pension-Menü und weitere Texte, deren Speicherort das Spiel direkt prüft.
- **Offizielle Begriffe:** Kampfmeldungen und Trainerklassen nach dem offiziellen deutschen Wortlaut; „3× Trank“.
Details: [Release v0.1.1](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/v0.1.1).

## v0.1 – Public Beta (08.10.2026)
Erste öffentliche Beta: Story, Dialoge, Kämpfe, Menüs, Items, Attacken, Fähigkeiten und Missionsbuch auf Deutsch,
deutscher Titelbildschirm und Menügrafiken. Basis Unbound v1.0.1. Details: [Release v0.1-beta](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/v0.1-beta).

## v0.1-alpha-de (August 2026)
Erste öffentliche Dokumentation und Screenshots – kein Patch, keine ROM.
