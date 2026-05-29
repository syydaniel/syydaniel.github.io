#!/usr/bin/env python3
"""NyaGlyph: a hand-built cat-glyph font. Every letter, digit and common
punctuation mark is drawn as a little cat (faces with eyes + whiskers, paws,
poses: stretching, rolling, paw-heart, plus fish / heart / star).

Run: python3 scripts/build-cat-font.py  ->  public/fonts/nyaglyph.woff
Filled silhouettes with nonzero winding; eyes/whiskers cut as reverse-wound
holes. Outer contours are clockwise (CW); holes are counter-clockwise (CCW).
"""
import math
import os
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen

UPM = 1000
ASCENT, DESCENT = 850, -150
ADV = 980          # letters/digits: big, roughly square cat stamps
ADV_PUNCT = 520
K = 0.5522847498

# ---------- primitives (font space, y up; outer=CW, hole=CCW) ----------
def ellipse(pen, cx, cy, rx, ry, hole=False):
    kx, ky = rx * K, ry * K
    pen.moveTo((cx, cy + ry))
    if not hole:  # CW: top -> right -> bottom -> left
        pen.curveTo((cx + kx, cy + ry), (cx + rx, cy + ky), (cx + rx, cy))
        pen.curveTo((cx + rx, cy - ky), (cx + kx, cy - ry), (cx, cy - ry))
        pen.curveTo((cx - kx, cy - ry), (cx - rx, cy - ky), (cx - rx, cy))
        pen.curveTo((cx - rx, cy + ky), (cx - kx, cy + ry), (cx, cy + ry))
    else:  # CCW
        pen.curveTo((cx - kx, cy + ry), (cx - rx, cy + ky), (cx - rx, cy))
        pen.curveTo((cx - rx, cy - ky), (cx - kx, cy - ry), (cx, cy - ry))
        pen.curveTo((cx + kx, cy - ry), (cx + rx, cy - ky), (cx + rx, cy))
        pen.curveTo((cx + rx, cy + ky), (cx + kx, cy + ry), (cx, cy + ry))
    pen.closePath()

def circle(pen, cx, cy, r, hole=False):
    ellipse(pen, cx, cy, r, r, hole)

def poly(pen, pts):
    pen.moveTo(pts[0])
    for p in pts[1:]:
        pen.lineTo(p)
    pen.closePath()

def quad(pen, p1, p2, p3, p4):
    poly(pen, [p1, p2, p3, p4])

# ---------- cat glyphs (drawn big + round) ----------
def catFace(pen):
    cx, cy, r = 480, 410, 300
    poly(pen, [(cx - 285, cy + 140), (cx - 60, cy + 130), (cx - 175, cy + 430)])  # ears
    poly(pen, [(cx + 285, cy + 140), (cx + 60, cy + 130), (cx + 175, cy + 430)])
    circle(pen, cx, cy, r)
    circle(pen, cx - 110, cy + 30, 46, hole=True)   # eyes (holes)
    circle(pen, cx + 110, cy + 30, 46, hole=True)
    ellipse(pen, cx, cy - 70, 34, 24, hole=True)    # nose (hole)
    for sgn in (-1, 1):                              # whiskers (filled strokes)
        quad(pen, (cx + sgn * 250, cy - 20), (cx + sgn * 95, cy - 30),
             (cx + sgn * 95, cy - 8), (cx + sgn * 250, cy + 18))
        quad(pen, (cx + sgn * 255, cy - 80), (cx + sgn * 95, cy - 70),
             (cx + sgn * 95, cy - 48), (cx + sgn * 255, cy - 44))

def paw(pen):
    cx = 480
    ellipse(pen, cx, 320, 235, 195)        # pad
    circle(pen, cx - 215, 560, 92)         # toe beans
    circle(pen, cx - 72, 640, 95)
    circle(pen, cx + 72, 640, 95)
    circle(pen, cx + 215, 560, 92)

def fish(pen):
    ellipse(pen, 520, 420, 270, 175)                          # body
    poly(pen, [(300, 420), (130, 560), (130, 280)])           # tail
    circle(pen, 640, 470, 34, hole=True)                      # eye (hole)

def heart(pen):
    pen.moveTo((480, 170))
    pen.curveTo((230, 410), (240, 700), (390, 700))
    pen.curveTo((450, 700), (480, 625), (480, 580))
    pen.curveTo((480, 625), (510, 700), (570, 700))
    pen.curveTo((720, 700), (730, 410), (480, 170))
    pen.closePath()

def sitCat(pen):
    pen.moveTo((300, 120))                                    # body
    pen.curveTo((270, 360), (345, 500), (480, 520))
    pen.curveTo((615, 500), (690, 360), (660, 120))
    pen.closePath()
    circle(pen, 480, 600, 165)                                # head
    poly(pen, [(370, 650), (335, 810), (455, 690)])           # ears
    poly(pen, [(590, 650), (625, 810), (505, 690)])
    ellipse(pen, 740, 260, 62, 175)                           # tail
    circle(pen, 430, 620, 26, hole=True)                      # eyes
    circle(pen, 530, 620, 26, hole=True)

def star(pen):
    cx, cy, R, r = 480, 420, 290, 122
    pts = []
    for i in range(10):
        ang = math.pi / 2 + i * math.pi / 5
        rad = R if i % 2 == 0 else r
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    poly(pen, pts)

def stretchCat(pen):
    # long arched body (loaf doing a downward stretch), head low-left
    pen.moveTo((120, 240))
    pen.curveTo((300, 430), (560, 470), (760, 300))
    pen.curveTo((800, 360), (820, 470), (800, 540))
    pen.curveTo((560, 600), (300, 560), (150, 420))
    pen.curveTo((120, 360), (110, 290), (120, 240))
    pen.closePath()
    circle(pen, 180, 300, 120)                                # head (front, low-left)
    poly(pen, [(95, 360), (70, 470), (165, 395)])             # ears
    poly(pen, [(255, 380), (290, 480), (210, 400)])
    ellipse(pen, 790, 470, 60, 150)                           # raised tail
    circle(pen, 150, 320, 22, hole=True)                      # eye

def rollCat(pen):
    # cat on its back, four paws up
    ellipse(pen, 480, 360, 290, 210)                          # round belly body
    for x in (300, 430, 530, 660):                            # four paws up
        ellipse(pen, x, 640, 55, 95)
    circle(pen, 480, 360, 60, hole=True)                      # belly swirl (hole)

def pawHeart(pen):
    # two paws lifted forming a heart between them
    ellipse(pen, 250, 300, 150, 185)                          # left paw
    ellipse(pen, 710, 300, 150, 185)                          # right paw
    pen.moveTo((480, 360))                                    # heart between
    pen.curveTo((360, 470), (365, 640), (430, 640))
    pen.curveTo((465, 640), (480, 600), (480, 575))
    pen.curveTo((480, 600), (495, 640), (530, 640))
    pen.curveTo((595, 640), (600, 470), (480, 360))
    pen.closePath()

def sleepCat(pen):
    # curled-up sleeping crescent
    ellipse(pen, 480, 380, 320, 230)                          # outer curl
    ellipse(pen, 520, 380, 150, 120, hole=True)               # inner hole -> crescent
    circle(pen, 215, 360, 110)                                # head tucked left
    poly(pen, [(150, 430), (140, 540), (235, 460)])           # ear
    circle(pen, 180, 360, 18, hole=True)                      # closed-ish eye

CATS = [catFace, paw, fish, heart, sitCat, star, stretchCat, rollCat, pawHeart, sleepCat]

# ---------- small punctuation marks (cat-flavoured) ----------
def p_dot(pen):       # period: a tiny paw
    cx = 260
    ellipse(pen, cx, 130, 95, 78)
    circle(pen, cx - 80, 250, 38)
    circle(pen, cx, 290, 40)
    circle(pen, cx + 80, 250, 38)

def p_comma(pen):     # comma: a little curled tail
    pen.moveTo((300, 240))
    pen.curveTo((360, 180), (340, 40), (220, -20))
    pen.curveTo((320, 70), (300, 170), (230, 220))
    pen.curveTo((255, 245), (285, 250), (300, 240))
    pen.closePath()

def p_colon(pen):     # colon: two paw beans
    circle(pen, 260, 480, 70)
    circle(pen, 260, 200, 70)

def p_excl(pen):      # exclamation: upright fish
    ellipse(pen, 260, 430, 110, 230)
    poly(pen, [(260, 230), (160, 110), (360, 110)])
    circle(pen, 260, 540, 26, hole=True)

def p_quest(pen):     # question: curled tail + dot
    pen.moveTo((120, 560))
    pen.curveTo((180, 720), (430, 720), (430, 540))
    pen.curveTo((430, 420), (300, 410), (300, 300))
    pen.curveTo((240, 300), (235, 360), (245, 410))
    pen.curveTo((300, 360), (340, 430), (300, 480))
    pen.curveTo((250, 520), (180, 520), (170, 560))
    pen.closePath()
    circle(pen, 270, 170, 58)

def p_hyphen(pen):    # hyphen: a whisker
    quad(pen, (90, 360), (430, 330), (430, 380), (90, 410))

def p_paren_l(pen):
    pen.moveTo((360, 720)); pen.curveTo((120, 520), (120, 200), (360, 0))
    pen.curveTo((220, 240), (220, 480), (360, 720)); pen.closePath()

def p_paren_r(pen):
    pen.moveTo((160, 720)); pen.curveTo((400, 520), (400, 200), (160, 0))
    pen.curveTo((300, 240), (300, 480), (160, 720)); pen.closePath()

PUNCT = {
    '.': p_dot, ',': p_comma, ':': p_colon, ';': p_comma, '!': p_excl,
    '?': p_quest, '-': p_hyphen, '(': p_paren_l, ')': p_paren_r,
    '/': p_hyphen, '·': p_colon, '&': p_quest
}

# ---------- assemble ----------
def cs(draw, width):
    pen = T2CharStringPen(width, None)
    draw(pen)
    return pen.getCharString()

charstrings = {'.notdef': cs(lambda p: None, 360), 'space': cs(lambda p: None, 360)}
metrics = {'.notdef': (360, 0), 'space': (360, 0)}
glyph_order = ['.notdef', 'space']
cmap = {0x20: 'space'}

# letters + digits -> cat poses (cycled)
catnames = []
for i, fn in enumerate(CATS):
    name = 'cat%02d' % i
    charstrings[name] = cs(fn, ADV)
    metrics[name] = (ADV, 0)
    glyph_order.append(name)
    catnames.append(name)

for i in range(26):
    name = catnames[i % len(catnames)]
    cmap[ord('a') + i] = name
    cmap[ord('A') + i] = name
for i in range(10):
    cmap[ord('0') + i] = catnames[(i + 3) % len(catnames)]

# punctuation -> cat marks
for ch, fn in PUNCT.items():
    name = 'pun_%04x' % ord(ch)
    if name not in charstrings:
        charstrings[name] = cs(fn, ADV_PUNCT)
        metrics[name] = (ADV_PUNCT, 0)
        glyph_order.append(name)
    cmap[ord(ch)] = name

fb = FontBuilder(UPM, isTTF=False)
fb.setupGlyphOrder(glyph_order)
fb.setupCharacterMap(cmap)
fb.setupCFF('NyaGlyph-Regular', {'FullName': 'NyaGlyph Regular', 'Weight': 'Regular'}, charstrings, {})
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=ASCENT, descent=DESCENT)
fb.setupNameTable({'familyName': 'NyaGlyph', 'styleName': 'Regular'})
fb.setupOS2(sTypoAscender=ASCENT, sTypoDescender=DESCENT, usWinAscent=ASCENT, usWinDescent=-DESCENT)
fb.setupPost()

out_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'fonts')
os.makedirs(out_dir, exist_ok=True)
fb.font.flavor = 'woff'
out = os.path.join(out_dir, 'nyaglyph.woff')
fb.save(out)
print('wrote', os.path.relpath(out), os.path.getsize(out), 'bytes;', len(catnames), 'cats +', len(PUNCT), 'marks')
