#!/usr/bin/env python3
"""Erzeugt die Assets der Winterdienst-Scroll-Demo.

Fahrbahn, Reif und Schneedecke sind Fototexturen (Poly Haven, CC0), die hier
geladen und farblich angepasst werden. Schneewall, Rauschmasken und das
Fahrzeug sind gerechnet bzw. gezeichnet — das Fahrzeug ist ein PLATZHALTER
(siehe README.md, Abschnitt "Fehlende Assets").

Aufruf (aus dem Demo-Ordner):  python3 tools/generate-assets.py
Benötigt: numpy, Pillow (mit WebP).
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent / "assets"
N = 1024  # Kantenlänge der Kacheltexturen


# --------------------------------------------------------------------------
# Rausch-Bausteine. Alles über FFT gefiltert und damit nahtlos kachelbar.
# --------------------------------------------------------------------------
def _freq(n):
    f = np.fft.fftfreq(n) * n
    fx, fy = np.meshgrid(f, f)
    return fx, fy


def fbm(n, beta, seed, lo=0.0, hi=None, stretch=(1.0, 1.0)):
    """1/f^beta-Rauschen, normalisiert auf Mittel 0 / Streuung 1."""
    rng = np.random.default_rng(seed)
    spec = np.fft.fft2(rng.standard_normal((n, n)))
    fx, fy = _freq(n)
    r = np.hypot(fx * stretch[0], fy * stretch[1])
    r[0, 0] = 1.0
    amp = r ** (-beta / 2.0)
    amp[0, 0] = 0.0
    if lo:
        amp *= r >= lo
    if hi:
        amp *= np.exp(-((r / hi) ** 2))
    out = np.real(np.fft.ifft2(spec * amp))
    return (out - out.mean()) / (out.std() + 1e-9)


def blur(a, sigma):
    """Gauß-Weichzeichner im Frequenzraum (kachelbar)."""
    fx, fy = _freq(a.shape[0])
    k = np.exp(-2 * (np.pi * sigma / a.shape[0]) ** 2 * (fx**2 + fy**2))
    return np.real(np.fft.ifft2(np.fft.fft2(a) * k))


def hillshade(h, strength, light=(-0.75, -0.66)):
    """Relief-Schattierung eines Höhenfelds. Licht von links oben."""
    gx = (np.roll(h, -1, 1) - np.roll(h, 1, 1)) * 0.5
    gy = (np.roll(h, -1, 0) - np.roll(h, 1, 0)) * 0.5
    return -(gx * light[0] + gy * light[1]) * strength


def equalize(a):
    """Rangtransformation auf 0..1 — danach entspricht ein Schwellwert direkt
    einem Flächenanteil. Davon leben SNOW_AMOUNT / ICE_AMOUNT im Browser."""
    flat = a.ravel()
    ranks = np.empty_like(flat)
    ranks[np.argsort(flat)] = np.linspace(0, 1, flat.size)
    return ranks.reshape(a.shape)


def colorize(lum, dark, light):
    """lum 0..1 zwischen zwei RGB-Farben mischen."""
    lum = np.clip(lum, 0, 1)[..., None]
    return np.array(dark)[None, None, :] * (1 - lum) + np.array(light)[None, None, :] * lum


def save(arr, rel, quality=84, lossless=False):
    path = ROOT / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    img.save(path, "WEBP", quality=quality, method=6, lossless=lossless)
    print(f"{rel:46s} {path.stat().st_size / 1024:7.1f} kB")


# --------------------------------------------------------------------------
# Texturen
# --------------------------------------------------------------------------
PHOTO_SOURCES = {
    # Fotogescannte, nahtlos kachelbare Texturen von Poly Haven (polyhaven.com),
    # Lizenz CC0 — frei verwendbar, auch kommerziell, ohne Namensnennung.
    "asphalt_02": "road/asphalt.webp",        # Asphalt mit Rissen, 3 m Kantenlänge
    "asphalt_snow": "ice/frost.webp",         # überfrorener, angeschneiter Asphalt, 2 m
    "snow_02": "snow/snow.webp",              # geschlossene Schneedecke, 2 m
}


def photo_textures():
    import io
    import subprocess

    cache = Path(__file__).resolve().parent / ".cache"
    cache.mkdir(exist_ok=True)
    for ident, rel in PHOTO_SOURCES.items():
        src = cache / f"{ident}.jpg"
        if not src.exists():
            url = f"https://dl.polyhaven.org/file/ph-assets/Textures/jpg/1k/{ident}/{ident}_diff_1k.jpg"
            # curl statt urllib: dem Python von python.org fehlen auf macOS oft die
            # Stammzertifikate, curl nutzt die des Systems.
            subprocess.run(["curl", "-fsSL", "-A", "Mozilla/5.0", "-o", str(src), url], check=True)
        a = np.asarray(Image.open(io.BytesIO(src.read_bytes())).convert("RGB")).astype(np.float32)
        if ident == "snow_02":
            # Die Vorlage ist eine neutrale Albedo-Karte (grau). Für die Draufsicht
            # auf Tageslicht-Schnee aufhellen und Schatten leicht ins Blaue ziehen.
            lum = a.mean(axis=2, keepdims=True)
            lum = (lum - lum.mean()) * 1.25 + 236
            a = np.concatenate([lum - 7, lum - 2, lum + 4], axis=2)
        elif ident == "asphalt_02":
            a = (a - a.mean()) * 1.05 + a.mean() * 0.74   # nasser, dunkler Belag
            a[..., 2] += 3
        elif ident == "asphalt_snow":
            a = (a - a.mean()) * 1.1 + a.mean() * 1.12
            a[..., 2] += 6
        save(a, rel, quality=82)


def snow_rough():
    """Geräumter, klumpiger Schnee für Randwälle und den Pflugwall."""
    h = fbm(N, 1.7, 31, lo=4, hi=120) * 5.0 + fbm(N, 0.8, 32, lo=40, hi=220) * 1.0
    shade = hillshade(h, 0.34)
    dirt = np.clip(fbm(N, 1.8, 33, hi=50), 0, None) * 0.035   # Splitt im Wall
    lum = 0.80 + shade - dirt
    rgb = colorize(lum, (128, 150, 180), (255, 255, 255))
    save(rgb, "snow/snow-rough.webp", quality=88)


def noise_masks():
    """Graustufen-Rauschen für die Schnee-/Eis-Fleckigkeit. Wird im Browser
    per Schwellwert zu Alphamasken verarbeitet."""
    m = 512
    save(np.repeat(equalize(fbm(m, 2.0, 61))[..., None] * 255, 3, 2), "noise/cloud.webp", lossless=True)
    streaks = fbm(m, 1.7, 62, stretch=(1.0, 0.22))
    save(np.repeat(equalize(streaks)[..., None] * 255, 3, 2), "noise/streaks.webp", lossless=True)


# --------------------------------------------------------------------------
# Fahrzeug-Platzhalter: Geräteträger nach Vorbild des Referenzfotos
# (Multihog, orange, Schneeschild vorne, Edelstahl-Soletank + Sprühbalken hinten).
# Draufsicht, Front zeigt nach OBEN. Gezeichnet, nicht fotografiert.
# --------------------------------------------------------------------------
def vehicle():
    ppm = 400            # Zeichenauflösung Pixel pro Meter (2x Supersampling)
    wm, hm = 2.3, 4.9    # Leinwand in Metern
    W, H = int(wm * ppm), int(hm * ppm)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    cx = W / 2

    def X(m):
        return cx + m * ppm

    def Y(m):
        return m * ppm

    def box(x0, y0, x1, y1, fill, r=0.04, outline=None, width=0):
        d.rounded_rectangle([X(x0), Y(y0), X(x1), Y(y1)], radius=r * ppm, fill=fill,
                            outline=outline, width=int(width * ppm))

    def bevel(x0, y0, x1, y1, base, r=0.05, k=0.03):
        """Kasten mit heller Kante links/oben und dunkler rechts/unten."""
        hi = tuple(min(255, int(c * 1.22 + 14)) for c in base)
        lo = tuple(int(c * 0.66) for c in base)
        box(x0, y0, x1, y1, lo, r)
        box(x0, y0, x1 - k, y1 - k, hi, r)
        box(x0 + k, y0 + k, x1 - k, y1 - k, base, r)

    ORANGE = (232, 112, 24)
    ORANGE_D = (196, 88, 16)
    STEEL = (186, 192, 198)
    DARK = (34, 36, 40)
    TYRE = (22, 22, 24)

    # Räder (ragen seitlich unter der Karosserie hervor)
    for wy in (1.62, 3.34):
        for sx in (-1, 1):
            box(sx * 0.80 - 0.14, wy - 0.33, sx * 0.80 + 0.14, wy + 0.33, TYRE, 0.07)
            box(sx * 0.80 - 0.09, wy - 0.27, sx * 0.80 + 0.09, wy + 0.27, (40, 40, 43), 0.05)

    # Anbaurahmen des Schilds
    d.polygon([(X(-0.30), Y(1.16)), (X(0.30), Y(1.16)), (X(0.16), Y(0.56)), (X(-0.16), Y(0.56))], fill=DARK)
    box(-0.07, 0.50, 0.07, 1.14, (62, 64, 68), 0.02)

    # Fahrgestell / Kotflügel
    bevel(-0.70, 1.10, 0.70, 4.20, ORANGE_D, 0.10)
    for wy in (1.62, 3.34):
        for sx in (-1, 1):
            bevel(sx * 0.74 - 0.16, wy - 0.40, sx * 0.74 + 0.16, wy + 0.40, ORANGE, 0.08)
            box(sx * 0.80 - 0.10, wy - 0.24, sx * 0.80 + 0.10, wy + 0.24, TYRE, 0.05)

    # Kabine: Frontscheibe (schräg, von oben als dunkler Streifen sichtbar) + Dach
    box(-0.62, 1.12, 0.62, 1.52, (30, 44, 56), 0.10)
    box(-0.56, 1.16, 0.20, 1.34, (64, 88, 104), 0.06)          # Spiegelung im Glas
    bevel(-0.64, 1.42, 0.64, 2.42, ORANGE, 0.10, 0.035)
    box(-0.50, 1.56, 0.50, 2.30, (240, 124, 34), 0.06)
    box(-0.42, 1.70, 0.42, 2.16, (40, 54, 66), 0.05)           # Glasdach-Einsatz
    box(-0.36, 1.74, 0.10, 1.90, (74, 96, 112), 0.04)
    # Rundumleuchte
    d.ellipse([X(0.36) - 0.07 * ppm, Y(1.52) - 0.07 * ppm, X(0.36) + 0.07 * ppm, Y(1.52) + 0.07 * ppm], fill=(255, 178, 40))
    d.ellipse([X(0.345) - 0.03 * ppm, Y(1.505) - 0.03 * ppm, X(0.345) + 0.03 * ppm, Y(1.505) + 0.03 * ppm], fill=(255, 232, 150))
    # Außenspiegel
    for sx in (-1, 1):
        box(sx * 0.80 - 0.07, 1.36, sx * 0.80 + 0.07, 1.46, DARK, 0.02)

    # Motorabdeckung hinter der Kabine
    bevel(-0.60, 2.44, 0.60, 2.82, ORANGE_D, 0.04)
    for i in range(6):
        box(-0.44 + i * 0.16, 2.52, -0.36 + i * 0.16, 2.74, (70, 44, 24), 0.01)
    box(0.44, 2.46, 0.54, 2.60, (58, 58, 60), 0.04)             # Auspuff

    # Soletank aus Edelstahl
    bevel(-0.64, 2.84, 0.64, 3.96, STEEL, 0.05, 0.035)
    for i in range(9):                                          # gebürstete Bahnen
        a = 206 if i % 2 else 176
        box(-0.58 + i * 0.13, 2.90, -0.50 + i * 0.13, 3.90, (a, a + 5, a + 10), 0.01)
    box(-0.60, 3.38, 0.60, 3.42, (132, 138, 144), 0.0)           # Spanngurt
    for lx in (-0.30, 0.30):                                     # Domdeckel
        d.ellipse([X(lx) - 0.15 * ppm, Y(3.14) - 0.15 * ppm, X(lx) + 0.15 * ppm, Y(3.14) + 0.15 * ppm], fill=(120, 126, 132))
        d.ellipse([X(lx) - 0.12 * ppm, Y(3.13) - 0.12 * ppm, X(lx) + 0.11 * ppm, Y(3.13) + 0.11 * ppm], fill=(214, 220, 226))

    # Heckrahmen mit Pumpe, Schlauchhaspel und Sprühbalken
    bevel(-0.66, 3.98, 0.66, 4.34, ORANGE, 0.04)
    d.ellipse([X(-0.40) - 0.15 * ppm, Y(4.16) - 0.15 * ppm, X(-0.40) + 0.15 * ppm, Y(4.16) + 0.15 * ppm], fill=DARK)
    d.ellipse([X(-0.40) - 0.07 * ppm, Y(4.16) - 0.07 * ppm, X(-0.40) + 0.07 * ppm, Y(4.16) + 0.07 * ppm], fill=(96, 98, 102))
    box(0.06, 4.06, 0.50, 4.28, (72, 74, 78), 0.03)
    box(0.12, 4.10, 0.30, 4.24, (150, 156, 162), 0.02)
    box(-0.86, 4.40, 0.86, 4.48, (52, 54, 58), 0.02)             # Sprühbalken
    for i in range(9):
        box(-0.80 + i * 0.20 - 0.02, 4.47, -0.80 + i * 0.20 + 0.02, 4.53, (120, 124, 128), 0.01)
    for sx in (-1, 1):                                           # Rückleuchten
        box(sx * 0.58 - 0.07, 4.30, sx * 0.58 + 0.07, 4.36, (170, 30, 26), 0.01)

    # Schneeschild
    plow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    p = ImageDraw.Draw(plow)

    def pbox(x0, y0, x1, y1, fill, r=0.03):
        p.rounded_rectangle([X(x0), Y(y0), X(x1), Y(y1)], radius=r * ppm, fill=fill)

    pbox(-1.02, 0.36, 1.02, 0.62, (168, 74, 12), 0.05)
    pbox(-1.02, 0.36, 1.00, 0.56, ORANGE, 0.05)
    pbox(-1.00, 0.37, 1.00, 0.44, (252, 150, 60), 0.03)          # Oberkante im Licht
    pbox(-1.03, 0.60, 1.03, 0.66, (44, 46, 50), 0.01)            # Schürfleiste
    for sx in (-1, 1):                                           # Warnmarkierung
        for i in range(4):
            col = (238, 204, 30) if i % 2 == 0 else (200, 36, 30)
            pbox(sx * 0.90 - 0.10 + i * 0.05, 0.37, sx * 0.90 - 0.05 + i * 0.05, 0.56, col, 0.0)
        pbox(sx * 1.00 - 0.02, 0.22, sx * 1.00 + 0.02, 0.40, (240, 210, 40), 0.01)  # Randmarkierer
    # Das Schild bleibt ein eigenes Bild (ungedreht, Drehpunkt = Bildmitte): die
    # Animation stellt seinen Winkel je nach Kurve selbst ein.
    plow = plow.crop((0, int(Y(0.20)), W, int(Y(0.80))))

    def finish(layer, name, seed):
        """Auf Zielgröße verkleinern, dann Körnung/Schmutz gegen den Vektor-Look."""
        layer = layer.resize((layer.width // 2, layer.height // 2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.45))
        a = np.asarray(layer).astype(np.float32)
        rng = np.random.default_rng(seed)
        h, w = a.shape[:2]
        grain = rng.standard_normal((h, w, 1)) * 5.0
        yy, xx = np.mgrid[0:h, 0:w]
        light = 1.06 - 0.14 * (xx / w) - 0.05 * (yy / h)         # Licht von links oben
        grime = np.asarray(
            Image.fromarray((rng.random((h // 24 + 1, w // 24 + 1)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
        ).astype(np.float32) / 255.0
        a[..., :3] = a[..., :3] * light[..., None] * (0.90 + 0.16 * grime[..., None]) + grain
        dust = (rng.random((h, w)) > 0.9965) & (a[..., 3] > 200)  # Schneestaub
        a[dust, :3] = a[dust, :3] * 0.4 + 150
        out = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), "RGBA")
        path = ROOT / "vehicle" / name
        path.parent.mkdir(parents=True, exist_ok=True)
        out.save(path, "WEBP", quality=92, method=6)
        print(f"{'vehicle/' + name:46s} {path.stat().st_size / 1024:7.1f} kB  ({w}x{h})")

    finish(img, "multihog-fahrzeug-PLATZHALTER.webp", 7)
    finish(plow, "multihog-schild-PLATZHALTER.webp", 8)

if __name__ == "__main__":
    photo_textures()
    snow_rough()
    noise_masks()
    vehicle()
