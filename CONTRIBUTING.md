# Mitmachen – Helfer-Kit (Tester, Lektor, Übersetzer, Grafik, Entwickler)

> **In short (EN):** We welcome help with the German localization of Pokémon Unbound. Pick a role (tester, proofreader, translator, graphics, developer), use the ready-made prompt for your own AI assistant, run the local check script `helfer/pruefe_texte.py`, and send your result as a pull request (or a Discord DM for private text packs). Rules in one line: official names only from our canon list, dialog lines ≤ 208 px, keep every control code and placeholder untouched, never post ROMs, saves or game text publicly.

Du musst kein Programmierer sein und kein Vorwissen mitbringen. Wer eine eigene KI (ChatGPT, Claude, Gemini, …) benutzt, kann sie hier gezielt einspannen: Jede Rolle hat einen **fertigen Prompt**, die **Regeln des Projekts** und ein **Prüfskript**, das du lokal ausführst, bevor du etwas einschickst. Entscheiden tun am Ende Menschen.

## Grundregeln (gelten für alle)

- **Keine** ROMs, BIOS-Dateien, Spielstände/States, Patches mit ROM-Anteil, kommerziellen Assets, Zugangsdaten oder privaten Pfade einreichen oder in Issues anhängen.
- **Kein Spieltext in öffentlichen Issues oder PRs.** Screenshots einzelner Szenen zum Melden sind in Ordnung, ganze Textlisten nicht. Text-Pakete bleiben privat (siehe „Lektorat“).
- Änderungen klein halten, eine Sache pro PR. Im Zweifel erst ein Issue öffnen.
- Eine KI darf vorschlagen, aber **du** prüfst: Namen nie ungeprüft übernehmen, nichts erfinden, Unsicheres als `[KANON?]` markieren.

## Die Regeln des Projekts (das muss auch deine KI wissen)

1. **Kanon:** Namen von Pokémon, Attacken, Items und Fähigkeiten nur aus der [Kanon-Namensliste](https://github.com/pokemon-unbound-de/kanon-namensliste) (offizielle deutsche Namen mit Quelle) oder dem [Namensverzeichnis](docs/NAMENSVERZEICHNIS.md). **Nie aus dem Gedächtnis.** Spezialbegriffe aus Unbound (Orte, Figuren, Organisationen) stehen im Namensverzeichnis; steht ein Begriff dort nicht, markiere ihn mit `[KANON?]`.
2. **Platz:** Dialogzeilen dürfen höchstens **208 Pixel** breit sein (Missionsbuch **200 px**), das sind je nach Buchstaben etwa 34–38 Zeichen. Namen haben feste Plätze: **Pokémon-Namen 10 Zeichen, Attacken- und Item-Namen 12 Zeichen**. Zu lange Texte kürzen wir lieber im Wortlaut als im Sinn.
3. **Steuercodes und Platzhalter bleiben 1:1 erhalten**, in gleicher Anzahl und an sinnvoller Stelle: `\n` neue Zeile · `\l` neue Zeile mit Scrollen · `\p` neue Textbox · `\.` kurze Pause · `[player]`, `[buffer1]`, `[#FD01]`, `[#FC0106]` usw. Der Text endet so wie der englische (z. B. mit `\p`). Nichts löschen, nichts erfinden.
4. **Neben Platzhaltern keine genusgebundenen Artikel** (`der/die/das`, `ein/eine`) direkt vor `[#FD..]`, weil das Spiel dort Name oder Wort einsetzt; umformulieren („Der Gegner [#FD01]…“ ist nur ok, wenn der Platzhalter immer denselben Genus hat).
5. **Ton:** Du-Form, Spielton wie im Original, keine Umgangssprache in Systemmeldungen („erhält“ statt „kriegt“), Geschlecht von Figuren aus der Figurenliste, nie raten.
6. **Zeichen:** Umlaute und ß sind erlaubt, Emojis und exotische Sonderzeichen nicht. Anführungszeichen so wie in den bestehenden Texten.
7. **Einheitlichkeit:** Gleicher englischer Begriff → gleicher deutscher Begriff im ganzen Spiel. Neue Begriffe vor dem Einbau im Namensverzeichnis/Issue klären.

## Das Prüfskript (lokal, ohne ROM, ohne Internet)

`helfer/pruefe_texte.py` nutzt nur die Python-Standardbibliothek (Python 3.9+).

```bash
python helfer/pruefe_texte.py mein_paket.csv
python helfer/pruefe_texte.py mein_paket.csv --kanon kanon_namen.csv   # zusätzlich Pokémon-Namen gegen die Kanonliste
```

Eingabe: CSV (UTF-8, Trennzeichen `;`) mit den Spalten `id;en;de` und optional `de_neu;limit_px`. Geprüft wird `de_neu`, falls gefüllt, sonst `de`. Es meldet **Fehler** (Platzhalter/Steuercodes weichen vom Englischen ab, Textende anders, nicht darstellbare Zeichen, Zeile deutlich zu lang) und **Warnungen** (Zeile vermutlich zu lang, Artikel vor Platzhalter, Kanonname fehlt, Text gleich dem Englischen). Es ist eine Näherung: die verbindliche Prüfung mit den echten Schriftbreiten läuft bei uns, sobald dein Vorschlag ankommt.

## Rollen

### 1. Tester (kein Vorwissen nötig)
**Aufgabe:** Die Vorschau bzw. die aktuelle Version spielen und Fehler melden: englische Reste, Text läuft aus dem Kasten, falsche Artikel/Geschlecht, Tippfehler, Grafikfehler, Abstürze.
**So geht’s:** Patch dir die Version im Browser ([Patch-Seite](https://patch.pokemonunboundde.studio/)), spiel, und melde im Discord (`#beta-bugs`; Port-Vorschau: `#port-feedback`) oder per [Issue-Vorlage „Fehler melden“](https://github.com/pokemon-unbound-de/pokemon-unbound-de/issues/new/choose). Immer mit **Screenshot oder kurzem Video**, **Ort** (Stadt/Route/Etage, mit wem gesprochen), **was ist falsch**, **wie oft**, **Version**. Bekannte Fehler stehen in der angepinnten Liste im Discord.
**Prompt für deine KI** (zum Aufräumen deiner Notizen, ohne Spieltext zu erfinden):
```text
Du hilfst mir, einen Fehler in einer deutschen Pokémon-Unbound-Übersetzung zu melden. Ich gebe dir meine Stichpunkte und eine
Bildbeschreibung. Schreibe daraus eine kurze Meldung mit diesen Feldern: Ort (Stadt/Route/Etage, mit wem gesprochen, welches Menü),
Was ist falsch (englischer Rest / Text läuft aus dem Kasten / falscher Artikel oder Geschlecht / Tippfehler / Grafik / Absturz),
Wie oft (einmalig/jedes Mal), Version. Erfinde nichts dazu. Wenn eine Angabe fehlt, schreibe „fehlt“ und frage mich danach.
Gib keinen längeren Spieltext wieder als nötig (höchstens die betroffene Zeile).
```

### 2. Lektor (Texte gegenlesen)
**Aufgabe:** Die ca. 1.550 KI-übersetzten Neutexte (Welle 36) werden nach Szene in **Paketen zu je 100 Zeilen** an Menschen gegeben, die sie gegenlesen. Die Pakete sind **privat** (sie enthalten Spieltext): schreib Nevio eine DM auf Discord, dann bekommst du Zugang und ein Paket.
**So geht’s:** Paket-CSV öffnen (Spalten `id;ort;limit_px;en;de;de_neu;kommentar`), Zeile für Zeile lesen. Wenn alles passt, bleibt `de_neu` leer. Wenn etwas besser geht, schreibst du die verbesserte Zeile in `de_neu` und optional einen kurzen Grund in `kommentar`. Danach `python helfer/pruefe_texte.py paket.csv`, Fehler beheben, die CSV zurückschicken (privater Weg: Pull Request in dem privaten Lektorat-Repo, auf das du Zugang bekommst, oder per DM).
**Prompt für deine KI:**
```text
Du bist Lektor für eine deutsche Fan-Übersetzung von Pokémon Unbound (Spielton: Du-Form, locker, aber ohne Umgangssprache in
Systemmeldungen). Ich gebe dir CSV-Zeilen mit id;ort;limit_px;en;de. Prüfe nur die Spalte de gegen en: Sinn getreu? Grammatik,
Rechtschreibung, Kasus, Geschlecht der Figur? Wörtlich übersetzte Redewendungen? Gleiche Begriffe überall gleich?
Regeln, die du nie verletzen darfst: (1) Alle Steuercodes und Platzhalter (\n \l \p \. [player] [buffer1] [#FD01] [#FC0106] …) bleiben
unverändert in Zahl und Reihenfolge, der Text endet wie der englische. (2) Keine Zeile über ca. 36 Zeichen. (3) Namen von Pokémon,
Attacken, Items nur aus meiner Kanonliste, nichts aus dem Gedächtnis; Unsicheres markierst du mit [KANON?]. (4) Kein Artikel (der/die/das,
ein/eine) direkt vor [#FD..]. (5) Erfinde keinen Inhalt, der nicht im Englischen steht.
Ausgabe: Für jede Zeile, die du ändern würdest, eine CSV-Zeile id;de_neu;kommentar (Kommentar: ein kurzer Satz, warum). Zeilen ohne
Änderung lässt du weg. Gib die Zeilen in genau dieser Form aus, ohne Erklärtext drumherum.
```

### 3. Übersetzer
**Aufgabe:** Fehlende oder englische Reste übersetzen (Listen mit offenen Texten stehen als Issues bzw. im Discord `#begriffe`).
**So geht’s:** Text + englische Vorlage + Kontext (Ort, wer spricht) von uns bekommen, übersetzen, mit dem Prüfskript testen, als CSV (`id;en;de`) zurückschicken. Neue Begriffe vorher klären (Regel 1 und 7).
**Prompt für deine KI:**
```text
Übersetze die folgenden englischen Spielzeilen aus Pokémon Unbound ins Deutsche (Du-Form, Spielton wie die offiziellen Pokémon-Spiele).
Behalte alle Steuercodes und Platzhalter (\n \l \p \. [player] [buffer1] [#FD01] [#FC0106] …) exakt bei, in gleicher Zahl; der Text endet wie
der englische. Zeilen höchstens ca. 36 Zeichen, bei Bedarf mit \n umbrechen. Offizielle Namen nur aus der Liste, die ich dir gebe; ist
ein Name nicht in der Liste, schreibe ihn englisch und setze [KANON?] dahinter. Kein Artikel direkt vor [#FD..]. Gib nur CSV-Zeilen
id;en;de aus.
```

### 4. Grafik
**Aufgabe:** Deutsche Ersatzgrafiken (Titelbild, Schilder, Menüs, Statuskürzel), wo Text in Grafiken steckt.
**So geht’s:** Technische Eckdaten: GBA-Grafik, 8×8-Kacheln, 4 Bit pro Pixel (16 Farben je Palette, Farbe 0 ist transparent), Originalgröße und -Palette beibehalten. Eigene Zeichnungen und eigene Pixelarbeit sind willkommen; **keine** Rips fremder Assets und keine KI-Bilder ohne klare Lizenz. Schick das PNG (1:1, ohne Skalierung) mit Angabe von Ort/Zweck als PR in `docs/` oder per DM an Nevio; wir bauen es ein und prüfen es im Emulator.
**Prompt für deine KI** (als Pixel-Hilfe, nicht als Bildgenerator):
```text
Ich bearbeite eine GBA-Grafik (8×8-Kacheln, 4 bpp, 16 Farben, Farbe 0 transparent) für eine deutsche Fan-Übersetzung. Hilf mir, Text in
einer 240×160-Grafik ins Deutsche zu übertragen: Schlage vor, wie ich die deutschen Wörter mit höchstens 15 Farben und in
dieselben Pixelflächen bekomme (gleiche Breite, kein Anti-Aliasing, gleiche Schriftstärke). Gib Wortvorschläge mit Zeichenzahl an, bitte
keine fertigen Bilder.
```

### 5. Entwickler
**Aufgabe:** Werkzeuge, Prüfungen, Doku und die Patch-Seite verbessern.
**So geht’s:** Repo forken → Branch → kleine Änderung → `python helfer/pruefe_texte.py` bzw. die Tests des betroffenen Werkzeugs laufen lassen → Pull Request mit Zweck, geänderten Dateien, Prüfung. Hintergrund und Zahlen: [Praxisbericht](docs/PRAXISBERICHT.md). Unsere Übersetzungs-Pipeline **Glyphwerk** ist noch privat und wird nach der Beta öffentlich; die Prüf-Werkzeuge unserer Mitwirkenden stehen schon öffentlich in der [Organisation](https://github.com/pokemon-unbound-de) (`kanon-namensliste`, `pre-stable-checks`, `review-prefilter`, `konsistenz-filter`, `namens-analyse`).
**Prompt für deine KI:**
```text
Du hilfst bei einem öffentlichen Python-Werkzeug (nur Standardbibliothek, kein Netzwerk) für eine Pokémon-Fan-Übersetzung. Regeln: keine
ROM-Daten und kein Spieltext im Code oder in Tests (nur erfundene Beispielzeilen), kleine Änderungen, deterministische Ausgabe, deutsche
Meldungen. Schreibe zu jeder Änderung einen kurzen Test. Ändere keine Gates oder Grenzwerte (208/200 px, 10/12 Zeichen) ohne Begründung.
```

## Weg per Pull Request

1. Repository **forken**, Branch anlegen (`texte/mein-paket`, `docs/…`, `tool/…`).
2. Nur die betroffenen Dateien per Pfad hinzufügen (`git add <pfad>`, nicht `git add .`).
3. Prüfskript laufen lassen, Ergebnis in die PR-Beschreibung (Fehler 0, ggf. begründete Warnungen).
4. PR öffnen: **Was** (Datei/IDs), **Warum**, **Prüfung**, **Risiken** (Begriffe, Breite), **keine verbotenen Dateien**.
5. Wir prüfen mit unseren Gates (Pixelbreite, Platzhalter, Kanon, Zeiger). Bei Fehlern bekommst du eine konkrete Rückmeldung; nach grünen Gates und einem menschlichen Blick wird gemergt.

Hinweis: Textpakete mit Spieltext (Lektorat) laufen nicht über dieses öffentliche Repo, sondern über den privaten Weg (DM an Nevio auf Discord).

## Review-Erwartungen

- Sprachlich: Ton, Begriffe, Lore. Technisch: Steuercodes, Platzhalter, Breite, Zeigersicherheit.
- Prüfung auf verbotene Dateien und Zugangsdaten vor jedem Merge.
