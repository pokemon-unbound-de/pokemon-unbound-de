# Wie wir den Port auf Unbound 2.1.1.1 gebaut haben

*How we built the German port for Pokémon Unbound 2.1.1.1: in short (EN): we patch in place instead of shortening texts, protect every pointer with a map and block lists, measure text widths in pixels, render the result in an emulator and write every fixed bug down as a class with a test.* Keine ROM-Daten, kein Spieltext. Allgemeine Lehren aus der 1.0.1-Linie stehen im [Praxisbericht](PRAXISBERICHT.md).

**Stand:** offene Beta [v2.0.0-beta.2](https://github.com/pokemon-unbound-de/pokemon-unbound-de/releases/tag/<<TAG I1>>). Die Zahlen unten stammen aus der Messung zur ersten Beta, die neue Messung trägt I5 ein.

## 1. In place statt radikaler Kürzung
Deutsche Texte sind etwa ein Achtel länger als englische. Der Port kürzt deshalb nicht pauschal, sondern geht in dieser Reihenfolge vor: Ein Text bleibt an seinem Originalplatz, wenn er hineinpasst. Passt er nicht, wird er in verifizierten freien Speicher verschoben und alle Zeiger werden umgebogen. Gekürzt wird nur, wenn nichts anderes bleibt, und dann nach festen, belegten Abkürzungen. Das hält Namen und Menüs so nah am Deutschen wie möglich und spart Platz, den die Hotfixes später brauchen.

## 2. Zeigerkarte und Sperrlisten gegen umgebogene Nicht-Zeiger
Ein Wort in der ROM, das wie ein Zeiger aussieht, ist nicht immer einer. Verbiegen wir einen „Scheinzeiger“ in Kompressions- oder Tabellendaten, stürzt das Spiel an einer ganz anderen Stelle ab. Darum gilt:
- Vor jedem Build entsteht eine **Zeigerkarte** der englischen Basis: Welche Wörter zeigen wirklich auf Text?
- **Sperrlisten** schließen bekannte Scheinzeiger und Zeiger mitten in Texten aus. Jede Ausnahme ist einzeln belegt.
- Ein Gate vergleicht jeden fertigen Bau gegen die Basis: Jede geänderte Stelle muss erlaubt und erklärt sein, alles andere bricht den Build ab.

## 3. Schutz des Spielstands
Wir haben den Speicher- und Ladevorgang gegen halb geschriebene Daten abgesichert und prüfen das bei jedem Bau mit einem eigenen Test. Mehr dazu veröffentlichen wir, sobald die Abstimmung mit den Entwicklern der Basis abgeschlossen ist. Bis dahin gilt wie immer: **Sichere deinen Spielstand vor dem ersten Start einer Beta.**

## 4. Pixelbreiten und Render-Prüfung im Spiel
Die Textboxen haben feste Pixelbreiten, die Schrift ist proportional. Zeichen zu zählen reicht nicht.
- Gates messen die echten Schriftbreiten je Zeile für jedes Fenster (Dialog, Missionsbuch, Pokédex, Menüs).
- Zusätzlich stellt unser Testlabor die Texte **im Emulator in den echten Textfenstern** dar und misst pixelgenau nach. Das fängt Fehler, die eine reine Datenprüfung nie sieht (zum Beispiel Zeilenumbrüche, die ein bestimmtes Fenster anders behandelt, oder Beschriftungen, die in einer Grafik statt im Text stehen).
- Fenster und Seiten, die nur durch Spielen erreichbar sind, prüfen Tester.

## 5. Bot-Infrastruktur
Ein Test-Bot spielt das Spiel im Emulator: Intro, Wild- und Trainerkampf, Fangen, Menüs, Speichern und Laden, von einem neuen Spiel bisher bis zum dritten Orden, ohne Cheats und ohne Spielstände zu manipulieren. Er erkundet die Spielwelt planvoll (Go-Explore, ohne KI) und lernt aus gescheiterten Läufen neue Regeln. Er protokolliert alle gedruckten Texte und meldet englische Reste. Mehrere automatische Wächter prüfen, dass kein Lauf unbemerkt hängt oder unverändert wiederholt wird. Was der Bot nicht erreicht (Nebenaufgaben, späte Story, Menüs mit Absicht), bekommen Tester als feste Aufgaben.

## 6. Fehlerklassen statt Einzelfixes
Jede Meldung gilt als **global**, bis klar ist, dass sie lokal ist. Wir suchen die Klasse mit einem Skript über das ganze Spiel, bauen den Fix und ein Gate dazu und belegen vorher/nachher mit Zahlen. Beispiele aus dem Port:
- **Doppelter englischer Wortlaut:** Derselbe Text steht an zwei Stellen, nur eine soll anders heißen („Pokémon-Liste“ im Pokédex, „Pokémon-Team“ im Startmenü).
- **Verschobene Platzhalter:** Die Version 2.1.1.1 nummeriert Platzhalter in einigen Kampftexten anders als 1.0.1, die alte Übersetzung greift dann nicht.
- **Umbruch im Pokédex:** Die Seite zentriert jede Zeile und kennt nur einen Umbruchtyp, alte Einträge mit anderen Umbrüchen liefen nach links aus dem Bild.
- **Gekürzte Grafiken:** Beschriftungen, die als Bild vorliegen, wurden nicht mit dem Text übertragen und brauchen eigene Kacheln.

## Was die Zahlen bedeuten
- **93 % der Texte übersetzt:** Von rund 20.000 Texten mit Wörtern, auf die das Spiel zeigt, haben 18.637 eine deutsche Fassung. Der Rest sind vor allem Namen, Abkürzungen und Laute, die gleich bleiben, dazu einige englische Reste, an denen wir arbeiten.
- **6.610 verschiedene Texte im Spielfenster geprüft:** Das ist eine Laborauswahl, **kein Prozentanteil des Spiels** und keine vollständige Abnahme. Sie ersetzt nicht das Spielen.
- „Übersetzt“ heißt „weicht vom englischen Original ab“, nicht „fehlerfrei“. Ob ein Text gut klingt, prüfen Lektorat und Tester.
- **Stand der Messung:** 16.11.2026, an einem Bau kurz vor der Beta. Mit jeder neuen Beta messen wir neu, die Zahlen ändern sich dann.

## Mitmachen
Fehler melden: Discord [`#port-feedback`](https://discord.gg/fSkhHppgcv) (Ort, Screenshot, was da stand, was richtig wäre). Technische Fragen und Gegenlesen: siehe [CONTRIBUTING](../CONTRIBUTING.md).
