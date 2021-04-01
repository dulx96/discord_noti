import asyncio
from playwright.async_api import async_playwright, Page
from aiorun import run
import yaml
import os

async def login(page:Page, username:str, password:str):
    await page.fill('input[name=email]', username)
    await page.fill('input[type=password]', password)
    await page.keyboard.press('Enter')
    await page.wait_for_load_state('networkidle')
    await asyncio.sleep(10)



async def main():
    # * load config
    with open('config.yaml','r') as f:
        config = yaml.load(f)
        print(config)
    # * setup browser
    playwright = await async_playwright().start()
    browser_context = await playwright.chromium.launch(headless=False, args=[
                '--disable-web-security'
            ],
            proxy={'server': os.environ['PROXY'],
                   'username': os.environ['PROXY_USER'],
                   'password': os.environ['PROXY_PASS']} if os.environ.get('USE_PROXY', 'false') == 'true' else None)

    # * process each profile
    for item in config['pages'].values():
        page = await browser_context.new_page()
        print(item)
        await page.goto(item['url'])
        # * check if page need login
        await page.wait_for_load_state('networkidle')
        url = page.url
        if "https://discord.com/login" in url:
            await login(page, os.environ.get('account'), os.environ.get('password'))
        with open('scripts/'+item['script'], 'r') as f:
            await page.evaluate(f.read())
            print('injected script')
        
run(main())
