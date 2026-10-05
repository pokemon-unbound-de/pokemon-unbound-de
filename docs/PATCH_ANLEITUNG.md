# Patch-Anleitung – Pokémon Unbound auf Deutsch (Beta v0.1)

**Credits:** Pokémon Unbound © Skeli. Deutsche Fan-Übersetzung: NevioCore & Community.

Hier erfährst du, wie du den deutschen `.bps`-Patch auf deine eigene ROM anwendest. Dauert etwa fünf Minuten.

> **Wichtig:** Wir verteilen **keine ROMs**. Du brauchst deine **eigene, legal erworbene Basis-ROM**. Bitte frag weder hier noch im Discord nach ROMs oder Download-Links dafür – solche Anfragen und Links werden gelöscht.

## 1. Was du brauchst

| Was | Woher |
| --- | --- |
| Deutscher Patch (`.bps`) | Release-Seite (ab 08.10.) – **einen** der beiden Patches, passend zu deiner Basis-ROM (Tabelle unten) |
| Basis-ROM | deine eigene: **Weg A (Hauptweg)** Pokémon FireRed (USA), Rev 0 – oder **Weg B** Pokémon Unbound (englisch) v1.0.1 |
| Patch-Programm | eins der Tools unten |

| Weg | Basis-ROM | Patch-Datei |
| --- | --- | --- |
| **A – Hauptweg** | Pokémon FireRed (USA), Rev 0 | `pokemon_unbound_de_v0.1_von_firered_usa.bps` (enthält Unbound v1.0.1, das offiziell nicht mehr erhältlich ist) |
| B | Pokémon Unbound (englisch) v1.0.1 | `pokemon_unbound_de_v0.1.bps` |

Beide Wege ergeben exakt dieselbe deutsche ROM. Neuere Unbound-Versionen (z. B. v2.1.1.1) passen **nicht**.

## 2. Basis-ROM prüfen (MD5)

Der Patch funktioniert nur mit **genau der richtigen** Basis-ROM. Prüfe deshalb vorher die MD5-Prüfsumme:

```
Weg A – Pokémon FireRed (USA), Rev 0:   e26ee0d44e809351c8ce2d73c7400cdd
Weg B – Pokémon Unbound (EN) v1.0.1:    52192d7e7268245e2e30b7d1a802d33d
```

FireRed **Rev 1**, die europäische/deutsche „Feuerrote Edition“ oder eine bereits gepatchte ROM passen nicht.

So bekommst du die MD5 deiner Datei:

- **Rom Patcher JS:** zeigt die MD5 direkt an, sobald du die ROM lädst.
- **Windows** (PowerShell oder Eingabeaufforderung): `certutil -hashfile "DeineROM.gba" MD5`
- **macOS** (Terminal): `md5 "DeineROM.gba"`
- **Linux** (Terminal): `md5sum "DeineROM.gba"`

Stimmt der Wert nicht überein? Dann passt deine ROM nicht – der Patch wird sehr wahrscheinlich fehlschlagen oder ein kaputtes Spiel erzeugen. Bitte keine „ähnliche“ ROM verwenden.

## 3. Patch anwenden

Such dir eine Variante aus. Am Ende hast du eine **neue** Datei – deine Original-ROM bleibt unverändert. Behalte sie trotzdem als Sicherung.

### Variante A: Rom Patcher JS (Browser – PC, Handy, Tablet)

Funktioniert ohne Installation, auch auf iPhone/iPad und Android. Die Dateien werden lokal in deinem Browser verarbeitet.

1. Öffne <https://www.marcrobledo.com/RomPatcher.js/>.
2. Bei **ROM file** deine Basis-ROM auswählen. Vergleiche die angezeigte **MD5** mit dem Wert oben.
3. Bei **Patch file** die deutsche `.bps`-Datei auswählen.
4. Auf **Apply patch** tippen – die gepatchte ROM wird heruntergeladen.

### Variante B: Floating IPS (Windows-PC)

1. Floating IPS (Flips) herunterladen: <https://github.com/Alcaro/Flips/releases> und entpacken.
2. `flips.exe` starten und **Apply Patch** klicken.
3. Zuerst die `.bps`-Datei, dann deine Basis-ROM auswählen.
4. Speicherort und Namen für die neue ROM wählen, z. B. `Pokemon_Unbound_DE_v0.1.gba`.

Meldet Flips einen Prüfsummenfehler („checksum mismatch“ o. ä.), ist es die falsche Basis-ROM – siehe Schritt 2.

### Variante C: UniPatcher (Android)

1. UniPatcher aus dem Google Play Store installieren.
2. Bei **Patch file** die `.bps`-Datei auswählen.
3. Bei **ROM file** deine Basis-ROM auswählen.
4. Unten auf den Button zum Anwenden tippen. Die gepatchte ROM landet standardmäßig im selben Ordner wie die Basis-ROM.

## 4. Spielen

Öffne die gepatchte ROM in einem GBA-Emulator deiner Wahl.

**Spielstände:** Spielstände aus anderen Versionen (z. B. der englischen) sind nicht offiziell unterstützt. Für die Beta empfehlen wir ein neues Spiel. Mach vor jedem Update eine Sicherungskopie deiner `.sav`-Datei.

## 5. Probleme?

- **Patch schlägt fehl / Prüfsummenfehler:** falsche Basis-ROM → MD5 prüfen (Schritt 2).
- **Weißer/schwarzer Bildschirm:** meist ebenfalls falsche Basis-ROM oder eine bereits gepatchte Datei als Basis verwendet.
- **Übersetzungsfehler gefunden?** Melde ihn gerne über das Formular [Übersetzungsfehler melden](https://github.com/pokemon-unbound-de/pokemon-unbound-de/issues/new?template=01-uebersetzungsfehler.yml).

Bitte lade **niemals** ROMs, gepatchte ROMs, Spielstände oder Savestates in Issues oder im Discord hoch. Screenshots sind super!
