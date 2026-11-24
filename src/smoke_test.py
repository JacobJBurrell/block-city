"""Quick smoke test: loads src/build/test.html in headless Chromium, presses PLAY,
holds the joystick, fires, opens the map, and reports any JavaScript errors.

Setup once:  pip install playwright && python -m playwright install chromium
Run:         python src/build.py && python src/smoke_test.py
Needs internet (three.js loads from cdn.jsdelivr.net, models from GitHub Pages).
"""
import asyncio, os, pathlib
from playwright.async_api import async_playwright

PAGE = pathlib.Path(os.path.dirname(os.path.abspath(__file__)), 'build', 'test.html').as_uri()

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(args=['--enable-webgl', '--ignore-gpu-blocklist', '--allow-file-access-from-files'])
        pg = await b.new_page(viewport={'width': 844, 'height': 390})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ERROR: ' + str(e)))
        await pg.goto(PAGE)
        await pg.wait_for_timeout(6000)
        btn = await pg.query_selector('.ui-play2')
        assert btn, 'PLAY button not found'
        await btn.click()
        await pg.wait_for_timeout(9000)
        s0 = await pg.evaluate('__in()')
        await pg.mouse.move(91, 299); await pg.mouse.down(); await pg.mouse.move(91, 249, steps=4)
        await pg.wait_for_timeout(2500)
        s1 = await pg.evaluate('__in()')
        await pg.mouse.up(); await pg.wait_for_timeout(300)
        s2 = await pg.evaluate('__in()')
        await pg.keyboard.down('f'); await pg.wait_for_timeout(1500); await pg.keyboard.up('f')
        await pg.screenshot(path=os.path.join(os.path.dirname(PAGE.replace('file:///', '/')), 'smoke.png'))
        print('state after PLAY:', s0['state'])
        print('moved with joystick:', (s0['x'], s0['z']) != (s1['x'], s1['z']))
        print('joystick released:', s2['jid'] is None and s2['jx'] == 0)
        print('JS errors:', errs or 'none')
        await b.close()

asyncio.run(main())
