"""Prépare les captures pour la maquette iPhone : masque le prix, découpe la plage
défilée et réduit (Lanczos) à la largeur d'affichage exacte -> jamais d'agrandissement."""
import json
from PIL import Image, ImageDraw
Image.MAX_IMAGE_PIXELS = None
SITE = 'assets/site/'
def prep(name, css_h, width, out):
    im = Image.open(SITE + name + '.png').convert('RGB')
    if name == 'prestations':  # aucun prix à l'écran (écart 890 € / 790 €)
        for p in json.load(open(SITE + 'prestations.price.json')):
            if '€' in p['t'] and p['w'] and len(p['t']) < 40:
                d = ImageDraw.Draw(im)
                d.rectangle([int((p['x'] - 2) * 3), int((p['y'] - 2) * 3), int((p['x'] + p['w'] + 2) * 3), int((p['y'] + p['h'] + 2) * 3)], fill=(255, 255, 255))
    im = im.crop((0, 0, im.width, min(im.height, css_h * 3)))
    s = width / im.width
    im = im.resize((width, round(im.height * s)), Image.LANCZOS)
    im.save('assets/site/' + out, quality=95) if out.endswith('.jpg') else im.save('assets/site/' + out)
    print(out, im.size, 'échelle', round(s, 3))
prep('accueil', 2600, 560, 'screen-accueil.png')
prep('chalet-vue-lac', 3400, 500, 'screen-chalet.png')
prep('prestations', 1700, 560, 'screen-prestations.png')
nav = Image.open(SITE + 'bottom-nav.png'); s = 560 / 1179
nav.resize((round(nav.width * s), round(nav.height * s)), Image.LANCZOS).save(SITE + 'screen-nav-560.png')
s = 500 / 1179
nav.resize((round(nav.width * s), round(nav.height * s)), Image.LANCZOS).save(SITE + 'screen-nav-500.png')
