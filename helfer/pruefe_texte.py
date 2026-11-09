#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Lokales Prüfskript für Textvorschläge (Pokémon Unbound DE) – nur Python-Standardbibliothek, ohne Netzwerk, ohne ROM.
Prüft CSV-Dateien (UTF-8, Trennzeichen ;) mit den Spalten  id;en;de  und optional  de_neu;limit_px. Geprüft wird de_neu, wenn gefüllt,
sonst de. So prüfst du dein Lektorat-Paket oder deinen Übersetzungsvorschlag, bevor du den Pull Request öffnest.

Aufruf:   python helfer/pruefe_texte.py paket.csv [--kanon kanon_namen.csv]
          (kanon_namen.csv: https://github.com/pokemon-unbound-de/kanon-namensliste, Spalten typ;en;de;quelle)
Exit 0 = keine Fehler (Warnungen möglich), Exit 1 = mindestens ein Fehler.

Prüfungen (Näherung; die verbindliche Prüfung mit echten Schriftbreiten läuft bei uns, wenn dein PR ankommt):
  FEHLER  Steuercodes und Platzhalter ([player], [buffer1], [#FD..], [#FC..]) fehlen, sind zusätzlich oder anders als im Englischen
  FEHLER  Textende anders als im Englischen (z. B. \\p fehlt)
  FEHLER  Zeichen, die das Spiel nicht darstellen kann
  FEHLER  Zeile deutlich zu lang (Näherung: mehr als 40 Zeichen; das Fenster fasst je nach Buchstaben ca. 34–38)
  WARNUNG Zeile vermutlich zu lang (mehr als 36 Zeichen) · genusgebundener Artikel direkt vor einem Platzhalter ([#FD..]) ·
          offizieller Name aus der Kanonliste fehlt im deutschen Text (nur mit --kanon) · Text gleich dem Englischen (unübersetzt?)
Steuercodes: \\n neue Zeile · \\l neue Zeile mit Scroll · \\p neue Textbox · \\. kurze Pause. Siehe CONTRIBUTING.md."""
import csv
import re
import sys
from pathlib import Path

TOKEN = re.compile(r"\[[^\]\s][^\]]*\]")                      # [player] [buffer1] [#FD01] [#FC0106]
STEUER = re.compile(r"\\[nlp.]")
ERLAUBT = set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZäöüÄÖÜßéÉèêàâçëïîôûñ0123456789 .,:;!?'’‘“”„‚\"-–—…·•()/&+*%=<>$#@_~♂♀|[]\\")
ARTIKEL = re.compile(r"\b(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines)\s+\[#FD", re.I)


def sichtbar(zeile):
    """Zeichenlänge einer Zeile ohne Steuercodes; jeder Platzhalter zählt 7 (typische Namenslänge)."""
    z = TOKEN.sub("W" * 7, zeile)
    return len(STEUER.sub("", z))


def zeilen(text):
    return [z for z in re.split(r"\\[nlp]", text)]


def lade_kanon(pfad):
    """nur Pokémon-Namen (eindeutig, kaum Verwechslung mit normalen englischen Wörtern); Attacken/Items würden zu viele falsche Treffer liefern"""
    out = []
    for r in csv.DictReader(open(pfad, encoding="utf-8", newline=""), delimiter=";"):
        if r.get("typ", "").startswith("pok") and len(r.get("en", "")) >= 5 and r.get("de"):
            out.append((r["en"], r["de"]))
    return out


def pruefe(zeile_id, en, de, kanon):
    fehler, warn = [], []
    if sorted(TOKEN.findall(en)) != sorted(TOKEN.findall(de)):
        fehler.append("Platzhalter/Codes in [..] weichen vom Englischen ab: EN %s · DE %s" % (sorted(TOKEN.findall(en)), sorted(TOKEN.findall(de))))
    ende_en = re.search(r"(\\[p.])\s*$", en)
    ende_de = re.search(r"(\\[p.])\s*$", de)
    if (ende_en.group(1) if ende_en else "") != (ende_de.group(1) if ende_de else ""):
        fehler.append("Textende anders als im Englischen (EN endet auf %r, DE auf %r)" % (ende_en.group(1) if ende_en else "-", ende_de.group(1) if ende_de else "-"))
    schlecht = sorted({c for c in de if c not in ERLAUBT})
    if schlecht:
        fehler.append("nicht darstellbare Zeichen: %s" % " ".join(repr(c) for c in schlecht))
    for n, z in enumerate(zeilen(de), 1):
        w = sichtbar(z)
        if w > 40:
            fehler.append("Zeile %d zu lang (%d Zeichen): %s" % (n, w, z[:50]))
        elif w > 36:
            warn.append("Zeile %d vermutlich zu lang (%d Zeichen): %s" % (n, w, z[:50]))
    if ARTIKEL.search(de):
        warn.append("genusgebundener Artikel direkt vor Platzhalter [#FD..] (Geschlecht/Fall unbekannt)")
    if de.strip() == en.strip() and len(en) > 3:
        warn.append("Text gleich dem Englischen")
    for e, d in kanon:
        if e in en and d not in de:
            warn.append("Kanonname fehlt: „%s“ sollte „%s“ heißen" % (e, d))
            break
    return fehler, warn


def main():
    rest = sys.argv[1:]
    kanon_pfad = None
    if "--kanon" in rest:
        i = rest.index("--kanon")
        kanon_pfad = rest[i + 1]
        del rest[i:i + 2]
    args = [a for a in rest if not a.startswith("--")]
    if not args:
        raise SystemExit(__doc__)
    kanon = lade_kanon(kanon_pfad) if kanon_pfad else []
    n = nf = nw = 0
    for pfad in args:
        for r in csv.DictReader(open(pfad, encoding="utf-8", newline=""), delimiter=";"):
            de = (r.get("de_neu") or "").strip() or (r.get("de") or "")
            en = r.get("en") or ""
            n += 1
            f, w = pruefe(r.get("id", "?"), en, de, kanon)
            nf += bool(f)
            nw += bool(w)
            for x in f:
                print("FEHLER  %s: %s" % (r.get("id", "?"), x))
            for x in w:
                print("WARNUNG %s: %s" % (r.get("id", "?"), x))
    print("Geprüft: %d Zeilen | mit Fehlern %d | mit Warnungen %d" % (n, nf, nw))
    return 1 if nf else 0


if __name__ == "__main__":
    sys.exit(main())
