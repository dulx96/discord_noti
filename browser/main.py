import asyncio
from playwright.async_api import async_playwright, Page
from aiorun import run
import yaml
import os
from dotenv import load_dotenv
import logging

async def login(page:Page, username:str, password:str):
    await page.fill('input[name=email]', username)
    await page.fill('input[type=password]', password)
    await page.keyboard.press('Enter')
    await page.wait_for_load_state('networkidle')
    await asyncio.sleep(10)
    page.wait_for_selector("[data-list-id='chat-messages']")
    print('login success')


async def main():
    # * load config
    load_dotenv()
    logging.info('start')
    with open(os.environ.get('CONFIG_FILE'),'r') as f:
        config = yaml.load(f)
        print(config)
    # * setup browser
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(headless=True, args=[
                '--autoplay-policy=user-gesture-required',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-component-update',
    '--disable-default-apps',
    '--disable-dev-shm-usage',
    '--disable-domain-reliability',
    '--disable-extensions',
    '--disable-features=AudioServiceOutOfProcess',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-notifications',
    '--disable-offer-store-unmasked-wallet-cards',
    '--disable-popup-blocking',
    '--disable-print-preview',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-setuid-sandbox',
    '--disable-speech-api',
    '--disable-sync',
    '--disk-cache-size=33554432',
    '--hide-scrollbars',
    '--ignore-gpu-blacklist',
    '--metrics-recording-only',
    '--mute-audio',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-pings',
    '--no-sandbox',
    '--no-zygote',
    '--password-store=basic',
    '--use-gl=swiftshader',
    '--use-mock-keychain',
                '--disable-blink-features=AutomationControlled'
            ],
            proxy={'server': os.environ['PROXY'],
                   'username': os.environ['PROXY_USER'],
                   'password': os.environ['PROXY_PASS']} if os.environ.get('USE_PROXY', 'false') == 'true' else None)
    browser_context = await browser.new_context(user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36')
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
        with open('dist/'+item['script'], 'r') as f:
            await page.evaluate(f.read())
            print('injected script')
        
run(main())
