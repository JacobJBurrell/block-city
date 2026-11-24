"""Quick smoke test: loads src/build/test.html in headless Chromium with touch, presses PLAY,
drags the joystick with a finger, releases it, fires, walks with the W key, and reports any
JavaScript errors.

Setup once:  pip install playwright && python -m playwright install chromium
Run:         python src/build.py && python src/smoke_test.py
Needs internet (three.js loads from cdn.jsdelivr.net, models from GitHub Pages).
"""
import asyncio, os, pathlib
from playwright.async_api import async_playwright

BUILD = pathlib.Path(os.path.dirname(os.path.abspath(__file__)), 'build')
PAGE = (BUILD / 'test.html').as_uri()
W, H = 844, 390

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files'])
        ctx = await b.new_context(viewport={'width': W, 'height': H}, has_touch=True)
        pg = await ctx.new_page()
        cdp = await ctx.new_cdp_session(pg)
        async def touch(kind, pts):
            await cdp.send('Input.dispatchTouchEvent', {'type': kind, 'touchPoints': [{'x': x, 'y': y, 'id': 0} for x, y in pts]})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ERROR: ' + str(e)))
        await pg.goto(PAGE)
        await pg.wait_for_timeout(6000)
        btn = await pg.query_selector('.ui-play2')
        assert btn, 'PLAY button not found'
        await btn.tap()
        await pg.wait_for_timeout(9000)
        s0 = await pg.evaluate('__in()')
        await touch('touchStart', [(91, H - 91)])
        for i in range(1, 5):
            await touch('touchMove', [(91, H - 91 - 12 * i)])
        await pg.wait_for_timeout(2500)
        s1 = await pg.evaluate('__in()')
        await touch('touchEnd', [])
        await pg.wait_for_timeout(300)
        s2 = await pg.evaluate('__in()')
        await pg.keyboard.down('f'); await pg.wait_for_timeout(1500); await pg.keyboard.up('f')
        await pg.keyboard.down('w'); await pg.wait_for_timeout(1500); await pg.keyboard.up('w')
        s3 = await pg.evaluate('__in()')
        await pg.screenshot(path=str(BUILD / 'smoke.png'))
        print('state after PLAY:', s0['state'])
        print('moved with joystick:', (s0['x'], s0['z']) != (s1['x'], s1['z']))
        print('joystick released:', s2['jid'] is None and s2['jx'] == 0)
        print('moved with W key:', (s2['x'], s2['z']) != (s3['x'], s3['z']))
        print('JS errors:', errs or 'none')
        await b.close()

asyncio.run(main())
