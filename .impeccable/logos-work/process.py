# Rend chaque logo source en grand (Chrome headless), puis détoure :
# alpha = densité d'encre normalisée, couleur unique (encre du site), recadrage serré.
import subprocess, os
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', '..', 'src', 'assets', 'img', 'editeurs')
CHROME = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
INK = (30, 30, 28)

SRC = {
    'elitis': 'elitis-inline1.svg',
    'pierre-frey': 'pierre-frey.svg',
    'nobilis': 'nobilis-inline1.svg',
    'designers-guild': 'wvl-designers-guild.svg',
    'casamance': 'casamance.svg',
    'morris': 'morris.svg',
    'christian-lacroix': 'christian-lacroix.png',
    'manuel-canovas': 'canovas-M.svg',
    'osborne-little': 'osborne-little.svg',
    'cole-son': 'cole-son.png',
    'jane-churchill': 'churchill-J.svg',
    'les-dominotiers': 'dominotiers.jpg',
    'zimmer-rohde': 'zimmer-rohde.svg',
    'sahco': 'sahco-inline1.svg',
    'kvadrat': 'kvadrat.jpg',
}
WHITE_ON_DARK = {'christian-lacroix'}

for name, src in SRC.items():
    bg = '#000' if name in WHITE_ON_DARK else '#fff'
    page = os.path.join(HERE, f'_r-{name}.html')
    with open(page, 'w', encoding='utf-8') as f:
        f.write(f'<!doctype html><body style="margin:0;background:{bg}"><img src="{src}" style="display:block;width:1800px;height:auto;margin:60px"></body>')
    shot = os.path.join(HERE, f'_r-{name}.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=4000',
                    '--user-data-dir=' + os.environ['TEMP'] + r'\ma-logo', '--window-size=1920,1900',
                    '--screenshot=' + shot, f'http://127.0.0.1:8731/.impeccable/logos-work/_r-{name}.html'],
                   capture_output=True)
    im = Image.open(shot).convert('L')
    if name not in WHITE_ON_DARK:
        im = ImageOps.invert(im)            # encre -> valeur haute
    lo, hi = im.getextrema()
    if hi - lo < 10:
        print('EMPTY', name); continue
    a = im.point(lambda v: 0 if v < 12 else min(255, int((v - 12) * 255 / max(1, hi - 12) * 1.08)))
    box = a.getbbox()
    a = a.crop(box)
    w, h = a.size
    if w > 1000:
        a = a.resize((1000, max(1, round(h * 1000 / w))), Image.LANCZOS)
    out = Image.new('RGBA', a.size, INK + (0,))
    out.putalpha(a)
    dest = os.path.join(OUT, name + '.png')
    out.save(dest, optimize=True)
    os.remove(page)
    print(f'{name:18} {out.size} <- {src}')
