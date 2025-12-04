import base64
from playwright.async_api import async_playwright
from app.core.state import AgentState

async def browser_node(state: AgentState) -> dict:
    """
    Captures a screenshot of the given URL using Playwright.
    """
    url = state.get("url")
    if not url:
        print("❌ Error: No URL provided in state.")
        return {"screenshot_b64": ""}

    print(f"🌐 Visiting: {url}")
    encoded_string = ""
    browser = None

    async with async_playwright() as p:
        try:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.set_viewport_size({"width": 1280, "height": 720})

            await page.goto(url, wait_until="networkidle")
            
            # Get screenshot as raw bytes
            screenshot_bytes = await page.screenshot(full_page=False)
            
            # Encode to base64 for the LLM
            encoded_string = base64.b64encode(screenshot_bytes).decode("utf-8")
            print("✅ Screenshot captured.")
            
        except Exception as e:
            print(f"❌ Browser Error: {e}")
        finally:
            if browser:
                await browser.close()

    return {"screenshot_b64": encoded_string}
