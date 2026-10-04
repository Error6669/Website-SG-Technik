#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Erzeugt aus Abschnitt C der docs/datenschutz/PRIVACY-CHECKLIST.md eine druckfertige
Arbeitsvorlage als PDF.

Die Markdown-Datei bleibt die einzige Quelle. Dieses Skript extrahiert nur,
es pflegt keinen eigenen Textbestand — so koennen Datei und Ausdruck nicht
auseinanderlaufen. Aendert sich Abschnitt C, einfach neu erzeugen:

    python3 scripts/wiedervorlage-pdf.py

Gerendert wird mit Chrome im Headless-Modus (--print-to-pdf). Zusaetzliche
Werkzeuge sind nicht noetig; wkhtmltopdf, pandoc und weasyprint waren auf
diesem Rechner nicht vorhanden.
"""

import html
import os
import re
import subprocess
import sys
import tempfile
from datetime import date

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QUELLE = os.path.join(ROOT, 'docs/datenschutz/PRIVACY-CHECKLIST.md')
ZIEL = os.path.join(ROOT, 'docs/datenschutz/Datenschutz-Wiedervorlage.pdf')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

# Designsystem der Website (DESIGN.md), damit der Ausdruck zur Seite passt.
NAVY_900, NAVY_800, SLATE_600 = '#0d2436', '#183a59', '#526376'
COPPER_600, LINE = '#8f4523', 'rgba(24, 58, 89, 0.18)'


# --------------------------------------------------------------------------
# Markdown-Teilmenge, die Abschnitt C tatsaechlich verwendet.
# Kein vollstaendiger Parser — python-markdown ist hier nicht installiert,
# und fuer diese Teilmenge waere es ohnehin ueberdimensioniert.
# --------------------------------------------------------------------------

def inline(t):
    """Fett, kursiv, Code und Links innerhalb einer Zeile."""
    t = html.escape(t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', t)   # Linkziel entfaellt im Druck
    return t


def tabelle(zeilen):
    """Markdown-Tabelle -> HTML. Zweispaltige Tabellen sind Feld/Wert-Paare."""
    def zellen(z):
        return [c.strip() for c in z.strip().strip('|').split('|')]

    kopf = zellen(zeilen[0])
    koerper = [zellen(z) for z in zeilen[2:]]          # [1] ist die Trennzeile
    hat_kopf = any(k for k in kopf)

    out = ['<table>']
    if hat_kopf:
        out.append('<thead><tr>' + ''.join(
            '<th>%s</th>' % inline(k) for k in kopf) + '</tr></thead>')
    out.append('<tbody>')
    for z in koerper:
        out.append('<tr>' + ''.join(
            '<td>%s</td>' % inline(c) for c in z) + '</tr>')
    out.append('</tbody></table>')
    return '\n'.join(out)


def block_zu_html(md):
    """Blockelemente: Ueberschriften, Tabellen, Listen, Zitate, Absaetze."""
    zeilen = md.split('\n')
    out, i = [], 0

    while i < len(zeilen):
        z = zeilen[i]

        if not z.strip():
            i += 1
            continue

        # Horizontale Linie — im Druck ueberfluessig, die Abschnitte trennen sich selbst
        if re.match(r'^---+\s*$', z):
            i += 1
            continue

        # Ueberschrift "### C4 — Titel": Nummer wird zur Marke, Rest zur Zeile
        m = re.match(r'^###\s+(C\d+)\s*—\s*(.+)$', z)
        if m:
            out.append(
                '<section class="punkt">'
                '<h2><span class="nr">%s</span>%s</h2>' % (m.group(1), inline(m.group(2))))
            i += 1
            continue

        # Tabelle
        if z.lstrip().startswith('|'):
            t = []
            while i < len(zeilen) and zeilen[i].lstrip().startswith('|'):
                t.append(zeilen[i])
                i += 1
            if len(t) >= 2:
                out.append(tabelle(t))
            continue

        # Blockzitat (mehrzeilig)
        if z.lstrip().startswith('>'):
            q = []
            while i < len(zeilen) and zeilen[i].lstrip().startswith('>'):
                q.append(re.sub(r'^\s*>\s?', '', zeilen[i]))
                i += 1
            out.append('<blockquote>%s</blockquote>' % inline(' '.join(q).strip()))
            continue

        # Aufzaehlung, inkl. Checkboxen "- [x] ..."
        if re.match(r'^\s*[-*]\s+', z) or re.match(r'^\s*\d+\.\s+', z):
            geordnet = bool(re.match(r'^\s*\d+\.', z))
            punkte = []
            while i < len(zeilen) and (
                    re.match(r'^\s*[-*]\s+', zeilen[i]) or
                    re.match(r'^\s*\d+\.\s+', zeilen[i]) or
                    (zeilen[i].startswith('      ') and zeilen[i].strip())):
                if zeilen[i].startswith('      ') and punkte:
                    punkte[-1] += ' ' + zeilen[i].strip()        # Fortsetzungszeile
                else:
                    punkte.append(re.sub(r'^\s*(?:[-*]|\d+\.)\s+', '', zeilen[i]))
                i += 1
            tag = 'ol' if geordnet else 'ul'
            out.append('<%s>' % tag)
            for p in punkte:
                erledigt = p.startswith('[x] ')
                p = re.sub(r'^\[[ x]\]\s*', '', p)
                cls = ' class="erledigt"' if erledigt else ''
                out.append('<li%s>%s</li>' % (cls, inline(p)))
            out.append('</%s>' % tag)
            continue

        # Absatz
        abs_ = []
        while i < len(zeilen) and zeilen[i].strip() \
                and not zeilen[i].lstrip().startswith(('|', '>', '#')) \
                and not re.match(r'^\s*(?:[-*]|\d+\.)\s+', zeilen[i]) \
                and not re.match(r'^---+\s*$', zeilen[i]):
            abs_.append(zeilen[i].strip())
            i += 1
        if abs_:
            out.append('<p>%s</p>' % inline(' '.join(abs_)))

    return '\n'.join(out)


def abschnitt_c_lesen():
    md = open(QUELLE, encoding='utf-8').read()
    try:
        start = md.index('## C. Jährliche Wiedervorlage')
    except ValueError:
        sys.exit('Abschnitt C nicht gefunden — wurde die Überschrift geändert?')
    ende = md.index('## Wo die Aussagen im Code herkommen', start)
    roh = md[start:ende]

    # Kopfzeile und die Notiz zum bereits angelegten Kalendereintrag gehoeren
    # in die Einleitung des Ausdrucks, nicht in die Punkteliste.
    roh = roh.split('\n', 1)[1]
    roh = re.sub(r'- \[x\] Kalendereintrag angelegt.*?(?=\n\n)', '', roh, flags=re.S)
    return roh


def html_bauen(inhalt_html):
    heute = date.today().strftime('%d.%m.%Y')
    return """<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<title>Datenschutz — Jährliche Wiedervorlage</title>
<style>
  @page { size: A4; margin: 18mm 16mm 16mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0; color: %(navy900)s; background: #fff;
    font: 10pt/1.5 -apple-system, "Helvetica Neue", Arial, sans-serif;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  h1 { font-size: 17pt; margin: 0 0 2mm; color: %(navy800)s; letter-spacing: -0.01em; }
  .unter { color: %(slate)s; font-size: 9pt; margin: 0 0 1mm; }
  .kopf { border-bottom: 1.5pt solid %(navy800)s; padding-bottom: 3mm; margin-bottom: 5mm; }
  .einleitung { font-size: 9.5pt; color: %(slate)s; margin-bottom: 6mm; }
  .einleitung strong { color: %(navy900)s; }

  /* Kopfzeile zum Eintragen, wer wann geprüft hat */
  .protokoll {
    display: flex; gap: 6mm; margin: 0 0 7mm;
    border: 0.75pt solid %(line)s; padding: 3mm 4mm;
  }
  .protokoll div { flex: 1; font-size: 8pt; color: %(slate)s;
    text-transform: uppercase; letter-spacing: 0.08em; }
  .protokoll span { display: block; border-bottom: 0.75pt solid %(line)s;
    margin-top: 6mm; }

  section.punkt {
    border-top: 0.75pt solid %(line)s; padding-top: 4mm; margin-top: 5mm;
    break-inside: avoid; page-break-inside: avoid;
  }
  section.punkt:first-of-type { border-top: none; margin-top: 0; }
  h2 { font-size: 11.5pt; margin: 0 0 2.5mm; color: %(navy800)s;
       display: flex; align-items: baseline; gap: 3mm; }
  .nr { font: 700 8.5pt/1 ui-monospace, "SF Mono", Menlo, monospace;
        color: %(copper)s; letter-spacing: 0.08em; }

  /* Ankreuzfeld pro Punkt — der eigentliche Zweck der Papierform */
  h2::after {
    content: ""; margin-left: auto; flex: none;
    width: 4.5mm; height: 4.5mm; border: 1pt solid %(navy800)s;
  }

  table { width: 100%%; border-collapse: collapse; margin: 2mm 0 3mm; font-size: 9pt; }
  th, td { text-align: left; vertical-align: top; padding: 1.6mm 2mm;
           border-bottom: 0.5pt solid %(line)s; }
  th { font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.07em;
       color: %(slate)s; font-weight: 600; border-bottom-width: 0.75pt; }
  /* Zweispaltige Feld/Wert-Tabellen: erste Spalte schmal halten */
  td:first-child { width: 26%%; color: %(slate)s; }
  table thead + tbody td:first-child { width: auto; color: inherit; }

  p { margin: 0 0 2.5mm; }
  ul, ol { margin: 0 0 3mm; padding-left: 5mm; }
  li { margin-bottom: 1.2mm; }
  li.erledigt { color: %(slate)s; }
  code { font: 8.8pt/1.4 ui-monospace, "SF Mono", Menlo, monospace;
         background: #eef1f3; padding: 0.3mm 1mm; border-radius: 1px; }
  blockquote { margin: 2mm 0 3mm; padding: 2mm 0 2mm 3mm;
               border-left: 2pt solid %(copper)s; font-size: 9pt; }
  strong { color: %(navy900)s; }

  .notiz { margin-top: 3mm; }
  .notiz-label { font-size: 7.5pt; text-transform: uppercase;
                 letter-spacing: 0.07em; color: %(slate)s; }
  .notiz-linie { border-bottom: 0.5pt solid %(line)s; height: 5mm; }

  footer { margin-top: 8mm; padding-top: 3mm;
           border-top: 0.75pt solid %(line)s;
           font-size: 7.5pt; color: %(slate)s; }
</style></head><body>

<div class="kopf">
  <h1>Datenschutz — Jährliche Wiedervorlage</h1>
  <p class="unter">SG Technik GmbH · Website · Abschnitt C der Freigabe-Checkliste</p>
</div>

<p class="einleitung">
  Diese Vorlage wird aus <strong>docs/datenschutz/PRIVACY-CHECKLIST.md</strong> erzeugt; dort steht
  der verbindliche Stand. Jeder Punkt nennt, <strong>wo</strong> nachzusehen ist,
  welcher <strong>Soll-Stand</strong> gilt und was bei einer <strong>Abweichung</strong>
  konkret zu ändern ist. Aufwand erfahrungsgemäß 30–45 Minuten.
  Nach Änderungen an Dateien im Projekt: <code>npm run build</code> und
  <code>/datenschutz</code> kurz ansehen.
</p>

<div class="protokoll">
  <div>Geprüft am<span></span></div>
  <div>Durch<span></span></div>
  <div>Nächster Termin<span></span></div>
</div>

%(inhalt)s

<footer>
  Erzeugt am %(heute)s aus docs/datenschutz/PRIVACY-CHECKLIST.md ·
  Neu erzeugen mit <code>python3 scripts/wiedervorlage-pdf.py</code> ·
  Weicht dieser Ausdruck von der Datei ab, gilt die Datei.
</footer>
</body></html>""" % dict(
        navy900=NAVY_900, navy800=NAVY_800, slate=SLATE_600,
        copper=COPPER_600, line=LINE, inhalt=inhalt_html, heute=heute)


def main():
    if not os.path.exists(CHROME):
        sys.exit('Chrome nicht gefunden unter:\n  %s' % CHROME)

    md = abschnitt_c_lesen()

    # Vorspann (alles vor C1) vom Punkteteil trennen. Sonst bekaeme auch der
    # einleitende Text ein Befund-Feld, obwohl dort nichts zu pruefen ist.
    schnitt = md.index('### C1')
    vorspann = block_zu_html(md[:schnitt]).strip()
    punkte = block_zu_html(md[schnitt:])

    # Jeden Punkt schliessen und ihm eine Notizzeile geben — Platz fuer das,
    # was auffaellt. block_zu_html oeffnet die <section>, schliesst sie aber
    # nicht, weil es die Grenze zum naechsten Punkt nicht kennt.
    NOTIZ = ('<div class="notiz"><div class="notiz-label">Befund</div>'
             '<div class="notiz-linie"></div></div></section>')
    punkte = punkte.replace('<section class="punkt">', NOTIZ + '<section class="punkt">')
    punkte = punkte.replace(NOTIZ, '', 1)      # vor dem ersten Punkt steht nichts
    punkte += NOTIZ

    inhalt = (vorspann + '\n' + punkte) if vorspann else punkte

    with tempfile.NamedTemporaryFile('w', suffix='.html', delete=False,
                                     encoding='utf-8') as f:
        f.write(html_bauen(inhalt))
        tmp = f.name

    try:
        subprocess.run([
            CHROME, '--headless', '--disable-gpu', '--no-pdf-header-footer',
            '--print-to-pdf=%s' % ZIEL, '--virtual-time-budget=4000',
            'file://%s' % tmp,
        ], check=True, capture_output=True, timeout=120)
    except subprocess.CalledProcessError as e:
        sys.exit('Chrome-Fehler:\n%s' % e.stderr.decode('utf-8', 'ignore')[:800])
    finally:
        os.unlink(tmp)

    print('%s (%.0f kB)' % (os.path.relpath(ZIEL, ROOT),
                            os.path.getsize(ZIEL) / 1024))


if __name__ == '__main__':
    main()
