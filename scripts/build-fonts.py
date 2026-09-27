"""Build the site's web fonts from the @fontsource-variable packages.

Folio needs Source Serif's optical-size axis for display type, but the full optical-size files are
about 250 KB for roman and italic, well over the 180 KB first-view budget. This script cuts
fixed-optical-size families instead, plus a trimmed Inter:

  Source Serif Display  opsz 60, wght 200-600  serif set at about 30px and up
  Source Serif Text     opsz 20, wght 400-600  body copy and smaller serif text
  Inter                 wght 400-600           interface text
  JetBrains Mono        wght 400-600           code, the 404 path, Cyberdle tiles

All keep only the characters the site uses (UNICODES below; also the unicode-range in
src/styles/fonts.css) and drop hinting. Output goes to src/assets/fonts/ and is committed, so the
normal build does not run this script. Re-run it after upgrading a fontsource package, when a new
weight is needed, or when content needs a character outside UNICODES:

  python scripts/build-fonts.py

Requires fonttools and brotli (pip install fonttools brotli).
"""

import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
PACKAGES = ROOT / "node_modules/@fontsource-variable"
OUT = ROOT / "src/assets/fonts"
RSS_FONTS = ROOT / "public/rss/fonts"
RSS_FACES = {"source-serif-display-normal", "source-serif-text-normal", "source-serif-text-italic", "inter-normal"}

UNICODES = (
    "U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2013-2014,"
    "U+2018-201A,U+201C-201E,U+2022,U+2026,U+2032-2033,U+2039-203A,U+20AC,U+2122,"
    "U+2190-2193,U+2197,U+2212"
)
FEATURES = ["kern", "liga", "calt", "ccmp", "locl", "mark", "mkmk", "onum", "lnum", "pnum", "tnum", "cv11"]
SERIF = "source-serif-4/files/source-serif-4-latin-opsz-{style}.woff2"
# output name: (source file pattern, styles, axis limits)
CUTS = {
    "source-serif-display": (SERIF, ("normal", "italic"), {"wght": (200, 600), "opsz": 60}),
    "source-serif-text": (SERIF, ("normal", "italic"), {"wght": (400, 600), "opsz": 20}),
    "inter": ("inter/files/inter-latin-wght-{style}.woff2", ("normal",), {"wght": (400, 600)}),
    "jetbrains-mono": (
        "jetbrains-mono/files/jetbrains-mono-latin-wght-{style}.woff2",
        ("normal",),
        {"wght": (400, 600)},
    ),
}


def cut(source: str, style: str, name: str, axes: dict) -> Path:
    font = TTFont(PACKAGES / source.format(style=style))
    options = subset.Options()
    options.layout_features = FEATURES
    options.hinting = False
    options.desubroutinize = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    target = OUT / f"{name}-{style}.woff2"
    font.save(target)
    return target


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    RSS_FONTS.mkdir(parents=True, exist_ok=True)
    for name, (source, styles, axes) in CUTS.items():
        for style in styles:
            target = cut(source, style, name, axes)
            print(f"{target.relative_to(ROOT)}  {target.stat().st_size / 1024:.1f} KB")
            # The RSS stylesheet is a static XSL page outside Astro's asset pipeline, so it
            # loads fixed-name copies from public/.
            if f"{name}-{style}" in RSS_FACES:
                shutil.copyfile(target, RSS_FONTS / target.name)


if __name__ == "__main__":
    main()
