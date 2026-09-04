#!/usr/bin/env python3
"""Assemble a prototype from its parts.

Every prototype is a single self-contained HTML file. The parts live in src/
and are stitched together here, in this order, because txjs.txt itself
contains a /*DATA*/ marker and has to be inserted before that marker is filled.

    python3 build.py src/app-body.html docs/index.html
    python3 build.py src/app-body.html app.html --embed-fonts

By default the build links the open-licence typeface used for the public
build. --embed-fonts substitutes src/fonts.txt instead, which is where a
licensed copy of the studio typeface goes; see the README.
"""
import sys, re, os, pathlib

WEB_FONT = (
    "@import url('https://fonts.googleapis.com/css2?"
    "family=Figtree:wght@300;400;600;700&display=swap');"
)

def read(name):
    p = pathlib.Path(__file__).parent / 'src' / name
    return p.read_text() if p.exists() else ''

def main():
    body_path, out_path = sys.argv[1], sys.argv[2]
    embed = '--embed-fonts' in sys.argv

    s = pathlib.Path(body_path).read_text()

    if embed and (pathlib.Path(__file__).parent / 'src' / 'fonts.txt').exists():
        s = s.replace('/*FONTS*/', read('fonts.txt').strip(), 1)
    else:
        s = s.replace('/*FONTS*/', WEB_FONT, 1)

    s = s.replace('/*CSS*/', read('gpn.css'), 1)
    for marker, part in (('/*PDATA*/', 'pdata.txt'),
                         ('/*PVIEWS*/', 'pviews.txt'),
                         ('/*TXVIEWS*/', 'txviews.txt'),
                         ('/*TXJS*/', 'txjs.txt'),
                         ('/*SPINE*/', 'spine.txt'),
                         ('/*PJS*/', 'pjs.txt'),
                         ('/*DEVCSS*/', 'devcss.txt'),
                         ('/*DEVJS*/', 'devjs.txt'),
                         ('/*CONFJS*/', 'confjs.txt'),
                         ('/*TXENV*/', 'txenv.txt'),
                         ('/*IAJS*/', 'iajs.txt'),
                        ('/*FIRSTJS*/', 'first.txt'),
                         ('/*DATA*/', 't1data.txt')):
        if marker in s:
            s = s.replace(marker, read(part), 1)

    if not embed:
        # the studio typeface is licensed and is not redistributed here
        s = s.replace("'Proxima Nova'", "'Figtree'")

    title = re.search(r'<title>(.*?)</title>', s)
    title = title.group(1) if title else 'Global Payment Network'
    s = re.sub(r'<title>.*?</title>\s*', '', s, count=1)

    doc = (
        '<!doctype html>\n<html lang="en">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<meta name="robots" content="noindex,nofollow">\n'
        f'<title>{title} · prototype</title>\n'
        '<style>:root{color-scheme:light}body{margin:0;padding:0}'
        'img{max-width:100%}[hidden]{display:none!important}</style>\n'
        '</head>\n<body>\n' + s + '\n</body>\n</html>\n'
    )

    os.makedirs(os.path.dirname(out_path) or '.', exist_ok=True)
    pathlib.Path(out_path).write_text(doc)

    for i, m in enumerate(re.findall(r'<script>(.*?)</script>', doc, re.S)):
        pathlib.Path(f'/tmp/chk{i}.js').write_text(m)
    print(f'{out_path}  {len(doc):,} bytes')

if __name__ == '__main__':
    main()
