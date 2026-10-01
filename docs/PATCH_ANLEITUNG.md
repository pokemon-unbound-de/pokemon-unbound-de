# Patch-Anleitung – Pokémon Unbound auf Deutsch (Beta v0.1)

Hier erfährst du, wie du den deutschen `.bps`-Patch auf deine eigene ROM anwendest. Dauert etwa fünf Minuten.

> **Wichtig:** Wir verteilen **keine ROMs**. Du brauchst deine **eigene, legal erworbene Basis-ROM**. Bitte frag weder hier noch im Discord nach ROMs oder Download-Links dafür – solche Anfragen und Links werden gelöscht.

## 1. Was du brauchst

| Was | Woher |
| --- | --- |
| Deutscher Patch (`.bps`) | Release-Seite: _[PLATZHALTER – Link folgt am 06.10.]_ |
| Basis-ROM | deine eigene: _[PLATZHALTER – genaue Basis-ROM/Version, z. B. „Pokémon Unbound vX.Y.Z (englisch)“]_ |
| Patch-Programm | eins der Tools unten |

## 2. Basis-ROM prüfen (MD5)

Der Patch funktioniert nur mit **genau der richtigen** Basis-ROM. Prüfe deshalb vorher die MD5-Prüfsumme:

```
Erwartete MD5 der Basis-ROM: [PLATZHALTER – MD5 folgt]
```

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
