# Pokémon Unbound auf Deutsch – Änderungsprotokoll

## v0.1.7 (2026-10-24)

**Build:** `e96d7af7…` · **Patches:** `pokemon_unbound_de_v0.1.7_von_firered_usa.bps` (Hauptweg, FireRed USA Rev 0) oder `pokemon_unbound_de_v0.1.7.bps` (Unbound EN v1.0.1) · Prüfsummen: `MD5.txt`

Unbound-Basis: 1.0.1

Danke: **DMkiller**, **Leitplanke** (Quiz-Methode, Grafiken KP/ERF), **Fabian (Vegetarox)**, **Maria**, **luxaxy**, **fletchermops**, alle Tester –
**scalyoh**, **amirez** und viele mehr – und die ganze Community.

### Behoben
- **Kampftexte brechen nicht mehr direkt nach Namen um** („Fuegro / erhält …“, „Angriff von / Krawell“). Ursache:
  v0.1.6 hat für jeden Platzhalter im Kampftext die Breite des längsten Fähigkeitsnamens angenommen und 101 Texte
  daraufhin neu umbrochen. Jetzt wird mit den echten Breiten gerechnet, die Zeilen sind wieder voll wie in v0.1.5.
- **Volltreffer** im Einzel- und Doppelkampf deutsch.
- **Dynamax:** Kampfmeldung „Dyna-…“ / „Gigadyna-…“ statt „Max …“, „Dyna-Brand“ statt „Max Team Flare“ (Testpunkt: Attackenmenü im Dynamax-Zustand bitte prüfen).
- **Items sortieren:** „Typ“, „Anzahl“, Frage „Wie sortieren?“ passt in das Fenster.
- **Pokédex-Werte** überlappen nicht mehr (KP / Ang / Ver / Ini / SAn / SVe).
- **Werte-Menü** „KP“ / „ERF“ statt „HP“ / „EXP“, PC-Box „TEAM-POKÉMON“.
- **Fähigkeits-Einblendung** ohne englisches Apostroph („Garados“ statt „Garados'“).
- **Starterauswahl** mit deutschen Namen (Bauz, Flamiau, Robball …), Trainer „Schläger“ statt „Goon“.
- **Quiz-Haus übersetzt**, Antworten auf Deutsch (ohne Umlaute, z. B. „gruen“) – bitte meldet, ob die Eingabe klappt.
- **Missionsbuch:** Status passt in die Spalte (Fertig / Offen / Neu), Beschreibungen passen in zwei Zeilen.
- **Safari-Leiste** passt („Ende / Weiter / Skippen“); Ruhmeshalle „ZEIT“.
- **Dialoge:** Gedankenstriche durch Punkt, Komma oder Doppelpunkt ersetzt, wo das Deutsche keinen braucht.

### Testphase
- Bis zu **4 Wochen**. **Stable v1.0.0** kommt, sobald **14 Tage lang kein Pflichtfehler** gemeldet wurde.
- **Pflichtfehler:** englische Reste, Text läuft aus dem Fenster, Grammatik/Umlaute, Grafikfehler, Absturz/Speicherproblem.
- **Erlaubt (kein Blocker):** Stil- und Begriffswünsche – die sammeln wir weiter.

### Neue automatische Prüfungen
- **Laufzeit-Textlog:** Der Test-Bot schreibt jeden tatsächlich angezeigten Text mit – englische Wörter und Texte,
  die aus dem Fenster laufen, werden gemeldet.
- Umbruch an Namen, englische Artnamen in Auswahllisten, leere Textstellen.

### Noch offen (eigener Track)
- **Pokédex-Einträge** im offiziellen Wortlaut der jeweiligen Edition (#117) – läuft als eigener Track, kein Fehler im Spielablauf.

## v0.1.6 (2026-10-19)

**Build:** `554cadea…` · **Patches:** `pokemon_unbound_de_v0.1.6_von_firered_usa.bps` (Hauptweg, FireRed USA Rev 0) oder `pokemon_unbound_de_v0.1.6.bps` (Unbound EN v1.0.1) · Prüfsummen: `MD5.txt`

Unbound-Basis: 1.0.1

Danke: **DMkiller** (Lesefluss, Eingrenzung), **Leitplanke** (Statuskürzel, Größe in m), **Fabian (Vegetarox)**,
alle Tester – **luxaxy**, **fletchermops**, **scalyoh**, **amirez** und viele mehr – und die ganze Community.

### Highlights
- **Liga-Grafikfehler endgültig behoben (Ursache gefunden):** Beim Einbau der deutschen Texte wurden in den
  komprimierten Kampfhintergründen einzelne Bytes verändert, die zufällig wie Textverweise aussahen – daher das
  Pixeln beim Einblenden der Top Vier. Grafikdaten werden jetzt nie mehr angefasst; Bild für Bild geprüft gegen
  das englische Original.
- **Kampftexte in der Gegenwart** wie in den offiziellen Spielen („setzt … ein“, „ist besiegt“).
- **Pokédex:** Größe in Metern („0,7 m“), Liste A–Z nach deutschen Namen.
- **Statusprobleme deutsch:** Symbole SLF / GIF / BRT / GFR / PAR.
- **Keine englischen Texte mehr** in Menüs und Dialogen (inkl. Quiz, Pension, Link-Raum).

### Lesbarkeit
- Lange Fähigkeits-, Item- und Attackennamen sprengen keine Kampftexte mehr (z. B. Fähigkeitstausch).
- Neuer Satz = neue Textbox; keine Satzanfänge mehr mitten im Scrollen.
- Missionsbuch: Status „Erfüllt / Offen / Inaktiv / Gefasst“ passt in die Spalte; Münzrahmen „Münzen:“; Karte „+Gehen“.
- Attacken-Beschreibungen passen in den Kasten; Attackeninfo „K.O.“ / „---“.

### Begriffe
- Typ „Unlicht“ ausgeschrieben, Trainerklasse „Aqua-Vorstand“, Fähigkeit „Kloakensoße“, „Maulwurf“ statt „Maulwurfmann“.
- Steuerleisten „Wahl“ statt „Pick“, VM-Symbol in der TM-Box, DexNav-Beschriftungen deutsch.
- Attacke „Giftblick“ (statt abgeschnittenem „Schlangblick“), Münzkorb „Ein Korb für …“.
- „zwei- bis“ wieder mit Trennstrich.
- **Optionen:** neue Einstellung heißt „Städtemusik“; alle Musiktitel passen ins Feld.

### Neue automatische Prüfungen
- Grafikdaten unverändert (gegen Englisch), Worst-Case-Namen in allen Kampftexten, Menü-Spaltenbreiten,
  englische Reste auch in Skript-Texten, Satzende/Textbox, Fähigkeitsnamen offiziell, Gegenwart in Kampftexten.

### Bekannt / noch offen
- Stockwerk-Anzeigen (B2F, 1F …), Abspann-Schild „DAS ENDE“, Markt-Schild – Grafik, folgt mit dem Port.
- „Arenaleiterin“ im Kampf-Intro, Datum im deutschen Format – braucht Code, folgt mit dem Port.

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
