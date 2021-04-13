import asyncio
from playwright.async_api import async_playwright, Page, Browser
from playwright._impl._api_types import TimeoutError, Error
from aiorun import run
import yaml
import os
from dotenv import load_dotenv
import logging
import requests
from tenacity import retry, stop_after_attempt, retry_if_exception_type

load_dotenv()
SLACK_WEBHOOK_URL = os.environ.get('SLACK_WEBHOOK_URL')
VIBYT_WEBHOOK_URL = os.environ.get('VIBYT_WEBHOOK_URL')

async def login(page:Page,item, username:str, password:str):
    await page.fill('input[name=email]', username)
    await page.fill('input[type=password]', password)
    await page.keyboard.press('Enter')
    await page.wait_for_load_state('networkidle')
    await asyncio.sleep(10)
    await page.wait_for_selector("[data-list-id='chat-messages']")
    print('login success')

@retry(reraise=True, retry=retry_if_exception_type((TimeoutError,Error)), stop=stop_after_attempt(4))
async def page_init(browser: Browser):
    # * load config
    with open(os.environ.get('CONFIG_FILE'),'r') as f:
            config = yaml.load(f)
            print(config)
    # * process each profile
    try:
        for item in config['pages'].values():
            page = await browser.new_page()
            print(item)
            await page.goto(item['url'])
            # * check if page need login
            await page.wait_for_load_state('networkidle')
            url = page.url
            if "https://discord.com/login" in url:
                await login(page,item, os.environ.get('account'), os.environ.get('password'))
            await page.wait_for_selector("[data-list-id='chat-messages']")
            await page.screenshot(path=item['url'].split('/')[-1]+'.png')
            with open('dist/'+item['script'], 'r') as f:
                await page.evaluate(f.read())
    except Exception as e:
        await browser.close()
        raise e

async def make_browser() -> Browser:
     # * setup browser
    playwright = await async_playwright().start()
    is_headless = os.environ.get('USE_HEADLESS') != 'false'
    browser_args = []
    if is_headless:
        browser_args = [
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
            ]
    # *
    browser = await playwright.chromium.launch_persistent_context(user_data_dir='browser_data',headless=is_headless, args=browser_args,
    user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            proxy={'server': os.environ['PROXY'],
                   'username': os.environ['PROXY_USER'],
                   'password': os.environ['PROXY_PASS']} if os.environ.get('USE_PROXY', 'false') == 'true' else None)  
    return browser

async def main():
    logging.info('START')
    try:
        while True:
            browser = await make_browser()
            await page_init(browser=browser)
            await asyncio.sleep(int(os.environ.get('RELOAD_PAGE_AFTER_SECONDS',60*60*2)))
            await browser.close()
    except Exception as e:
        logging.error(str(e), exc_info=True)
        # * noti when got exception
        requests.post(SLACK_WEBHOOK_URL, json={'text': 'ERROR\n'+ str(e)})
        requests.get(VIBYT_WEBHOOK_URL)
        raise e
run(main())
