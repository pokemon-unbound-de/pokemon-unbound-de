# Praxisbericht: Was wir beim Übersetzen und Portieren von Pokémon Unbound gelernt haben

*GBA ROM translation – lessons learned* (Flaschenhälse und Lösungen beim Übersetzen und Portieren eines GBA-ROM-Hacks)

> **In short (EN):** Lessons from translating a large CFRU/FireRed-based ROM hack (Pokémon Unbound) into German as a binary patch. A German text is ~12 % longer than the English one, the ROM has no free space to spare, and pointers into the middle of strings lurk everywhere. This page lists the bottlenecks we hit, what fixed them and the numbers, so other ROM hackers can skip the detours. No ROM data, no game text. Entwurf, Stand 08.11.2026.

Alle Zahlen stammen aus unseren eigenen Läufen (Port auf Unbound 2.1.1.1, Hauptlinie 1.0.1). Wo eine Zahl eine Messung ist, steht die Messart dabei.

## 1. Freispeicher: Platz ist der eigentliche Gegner
- **Problem:** Deutsche Texte sind im Schnitt etwa 12 % länger als englische (Längenbudget 1,15 als Obergrenze beim Übersetzen). Ein 32-MB-ROM hat aber nur begrenzt echte Leerstellen (0xFF-Läufe).
- **Lösung 1, in place zuerst:** Ein Text bleibt am Originalplatz, wenn er in den Slot passt (zulässig sind kleine Überläufe bis 10 % nach der Kürzungsregel). Erst danach wird umgezogen. Das spart rund 430 KB gegenüber „alles umziehen“. Stand Port-Testbuild: **8.978 Texte in place** (vorher 6.311), **46 KB frei** (vorher 36 KB).
- **Lösung 2, Pool-Politik:** Nur zusammenhängende freie Blöcke ab 4.096 B in den Pool, kleinere (2.048–4.095 B) nur, wenn sie geprüft grün sind. So bleibt der Pool klein, aber sicher.
- **Reserve:** Mindestens 25 KB frei halten (Regel im Release-Gate), sonst fehlt der Platz für Hotfixes.

## 2. FF_LEBEND: „Leer“ ist nicht leer
- **Problem:** Ein 0xFF-Lauf sieht leer aus, kann aber lebende Daten enthalten, zum Beispiel ein Zeigerziel oder eine Strukturreferenz mitten im Lauf. Wer dort schreibt, bricht das Spiel erst Stunden später.
- **Lösung:** Gate `pool_pointer_targets`: Kein lebendes Zeigerziel in einem FF-Lauf darf im Build verändert sein. Messwert: 656 geschützte Ziele auf der Hauptlinie, 87 auf dem Port. Beim Port fanden wir zusätzlich **56 rote Strukturreferenzen** in einem Bereich, der als „frei“ galt. Seitdem gilt: Freigabe nur nach Zeigerscan, nicht nach Aussehen.

## 3. Zufallszeiger: Treffer im Datenmüll
- **Problem:** Ein Scan nach „irgendwo zeigt etwas auf diesen Text“ findet in Kompressionsdaten und Tabellen **Zufallswörter**, die zufällig wie ein Zeiger aussehen. Unsere Sperre hielt dadurch **rund 2.600 Texte** vom Originalplatz fern, 7 große Texte fanden gar keinen Platz.
- **Lösung:** Nur Innen-Zeiger sperren, die hinter einem Umbruchcode (`\n`, `\l`, `\p`) liegen, also dort, wo ein echter Text weiterlaufen kann. Ergebnis: in place von 6.311 auf 8.978 Texte, 0 Texte ohne Platz.
- **Lehre:** Statische Zählungen dreimal gegen die Wirklichkeit prüfen (siehe 8).

## 4. Innen-Zeiger (Suffix-Zeiger)
- **Problem:** Manche Zeiger zeigen nicht auf den Textanfang, sondern in die Mitte („Rest“ eines Satzes). Wird der Text verschoben, zeigt der Innen-Zeiger ins Leere oder weiter auf Englisch. In unserem Port: **922** Innen-Zeiger gefunden, **48** umgebogen, **37** echte Fälle, die eigene Teilstücke brauchen (801 B), nur 1 davon übersetzbar, der Rest sind reine Codes.
- **Lösung:** Zeiger umbiegen statt Text kopieren. Wo das nicht reicht, das Teilstück als eigener kleiner Text ablegen.

## 5. Pixelbreiten statt Zeichenzahlen
- **Problem:** Die Textbox hat eine feste Pixelbreite, die Schrift ist proportional. Zeichenzählen sagt nichts.
- **Lösung:** Gate mit den echten Schriftbreiten: **Dialog 208 px, Missionsbuch 200 px** je Zeile (Gate G2), dazu G2c (höchstens ein `\n` je `\p`-Segment) und eine Prüfung auf Satzende im Scroll-Block. Jede Tabelle, die in eine Box oder Attackenseite fließt, muss vom Gate abgedeckt sein; eine nicht abgedeckte Tabelle ließ eine ganze Fehlerklasse durch.

## 6. Plural- und Geschlechtscodes (Buffer-Codes)
- **Problem:** Das Spiel hängt Endungen per Steuercode an (z. B. FD07, FD08, FD04). Im Deutschen ändert sich das Wort selbst („Ei“ → „Eier“), nicht nur die Endung.
- **Lösung:** Alle Textfolgen scannen, in denen ein Wort vor einem Endungscode steht (EN 55, DE 39 Treffer). Falsch waren nur 2 Stellen (ein Code hätte „Eis“ statt „Eier“ erzeugt). Regel: **Neben Buffer-Codes keine genusgebundenen Artikel**, außer der Puffer ist belegt konstant.

## 7. Gates: Fehlerklassen statt Einzelfixes
- Jede Meldung gilt als **global**, bis klar ist, dass sie lokal ist. Wir suchen die Klasse mit einem Skript über das ganze ROM, bauen einen Fixer und ein Gate, und belegen vorher/nachher mit Zahlen.
- Gates laufen vor dem Build; der Build gilt nur mit sichtbarem Rückgabewert (rc).
- **Messart zählt:** Eine Zahl ohne Aufrufparameter ist wertlos. Beispiel aus dem Projekt: Unser Pool-Gate lief mit Standardparametern und prüfte stillschweigend die Hauptlinie statt des Ports; die Prüfliste nannte den Aufruf ohne `--basis` (am 08.11. gefunden und korrigiert).

## 8. Messfehler: statische Zahlen und Laufzeit-Gegenprobe
- Unser Zähler „englisch noch sichtbar“ sank von **1.654 auf 129 und dann auf 9** (von 466 B), nachdem wir drei Messfehler fanden: Tabellentexte mit umgebogenem Zeiger wurden doppelt gezählt, Texte mit DE = EN („YEAH“) zählten als offen, und die Zufallswort-Sperre (Abschnitt 3).
- **Lehre:** Jede statische Zahl braucht eine Laufzeit-Gegenprobe. Unser Bot protokolliert die gedruckten Texte im Emulator (Textprotokoll) und meldet jeden englischen Rest.

## 9. Titelbild und Grafiken in place
- Komprimierte Kacheln (7.176 B) und Karte (1.160 B) passen in die Original-Slots (7.358 B / 1.160 B), ohne einen Zeiger zu ändern. Eine Korrektur senkte die Randpixel-Abweichung von **109 auf 10** bei gleicher Größe. Prüfweg: Zurücklesen der komprimierten Daten, Zeiger- und Palettenvergleich, Bildvergleich im Emulator.

## 10. Organisation der KI-Instanzen
- **Rollen mit Schreibrechten:** Builder (Wellen, Gates, ROM), Leitung (Entscheide, Pläne, Marketing), Zulieferer (Übersetzungsblöcke, Review, Prüfstand) und Labor-Instanzen mit eigenem Sandkasten. Nie zwei Schreibende auf denselben Dateien.
- **Austausch über Dateien:** Aufträge `PROMPT_*.md`, Berichte `BERICHT_*.md` (höchstens 8 Zeilen: Zahl, Datei, Prüfweg, FERTIG/OFFEN), im Chat nur „Bericht liegt“.
- **Modellwahl nach Aufgabe:** mechanische Arbeit (Scans, Diffs, Fix-Skripte) auf kleinem Modell, Sprachgefühl auf mittlerem, große Entscheide auf dem größten. Keine Allzweck-Schwärme: ein Nutzungsbericht zeigte, dass 100 % des Verbrauchs aus Subagenten kamen.
- **Menschliche Prüfung bleibt:** Die KI schlägt vor, Menschen entscheiden (Kanon-Namen nur aus belegter Quelle, nie aus dem Gedächtnis).

## 11. Kleine Regeln, die uns Zeit gespart haben
- Skripte nur als Datei, nie als Shell-Heredoc (Escape-Fehler kosteten mehrere Wiederholungen).
- JSON-Edits formaterhaltend (gleiches `indent`, gleiche Zeilenenden), damit der Diff nur den Inhalt zeigt.
- Nichts löschen, nur verschieben; Write nur für neue Dateien.
- Secret-Scan und ROM-Byte-Scan vor jedem Push; ROMs und Patches mit ROM-Anteil bleiben aus dem Repo.

## Zahlen im Überblick (Port-Testbuild 08.11.2026)
| Messgröße | Wert |
|---|---|
| Texte in place | 8.978 (vorher 6.311) |
| Freispeicher nach Build | 46.023 B (vorher 36.080 B) |
| Englisch sichtbar (statisch) | 9 Texte / 466 B (vorher 129, davor 1.654) |
| Geschützte Zeigerziele (Pool-Gate) | 87 Port / 656 Hauptlinie, 0 verändert |
| Innen-Zeiger | 922 gefunden, 48 umgebogen, 37 brauchen Teilstücke (801 B) |
| Titelbild | 7.176 B + 1.160 B in place, 10 Randpixel Abweichung |
