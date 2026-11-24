"""Block City build script.

Combines src/base.js with every module in ORDER and writes:
  ../index.html            the playable game (what GitHub Pages serves)
  ../Block City.js         the same game as a Scriptable script
  build/test.html          the game plus each module's hook.js test helpers

Usage (from the repo root):  python src/build.py
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
MODS = os.path.join(HERE, 'mods')
ROOT = os.path.dirname(HERE)

# Order matters: later modules wrap functions defined by earlier ones.
ORDER = ['real', 'missions', 'audio', 'vehicles', 'world', 'airport', 'land', 'isles',
         'crime', 'story', 'life', 'jets', 'fixes', 'input', 'map', 'ui', 'gfx']

s = open(os.path.join(HERE, 'base.js'), encoding='utf-8').read()

def rep(a, b):
    """Replace exactly one occurrence of a with b in the game source (used by mod.py files)."""
    global s
    n = s.count(a)
    assert n == 1, ('rep target must occur exactly once', n, a[:80])
    s = s.replace(a, b)

MARK = '// ---------- main loop ----------'
for name in ORDER:
    d = os.path.join(MODS, name)
    js = open(os.path.join(d, 'mod.js'), encoding='utf-8').read()
    assert '`' not in js and '${' not in js, name + ': no backticks or ${ in mod.js (it lives inside a template string)'
    assert '</script>' not in js, name + ': no </script> in mod.js'
    s = s.replace(MARK, js + '\n' + MARK)
    p = os.path.join(d, 'mod.py')
    if os.path.exists(p):
        exec(open(p, encoding='utf-8').read())

html = s[s.index('`') + 1:s.rindex('`')].replace('<\\/script>', '</script>')
open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8').write(html)
open(os.path.join(ROOT, 'Block City.js'), 'w', encoding='utf-8').write(s)

hooks = ''.join(open(os.path.join(MODS, n, 'hook.js'), encoding='utf-8').read() + '\n'
                for n in ORDER if os.path.exists(os.path.join(MODS, n, 'hook.js')))
os.makedirs(os.path.join(HERE, 'build'), exist_ok=True)
open(os.path.join(HERE, 'build', 'test.html'), 'w', encoding='utf-8').write(html.replace(MARK, hooks + MARK))
print('built index.html (%d bytes), Block City.js, src/build/test.html' % len(html))
