from groq import AsyncGroq
from app.core.state import AgentState
from app.core.config import settings

async def vision_node(state: AgentState) -> dict:
    """
    Analyzes the screenshot using Groq Vision (Native Client).
    """
    screenshot_b64 = state.get("screenshot_b64")
    if not screenshot_b64:
        print("⚠️ Warning: No screenshot available for analysis.")
        return {"raw_analysis": "Error: No screenshot captured."}

    print(f"👁️  Groq ({settings.VISION_MODEL}) is analyzing the UI...")

    try:
        # Initialize Groq Client
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)

        completion = await client.chat.completions.create(
            model=settings.VISION_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": "Analyze this web UI. List 3 distinct UX/UI design flaws or Accessibility (contrast/font) issues. Be descriptive."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{screenshot_b64}"
                            }
                        }
                    ]
                }
            ],
            temperature=0,
            max_tokens=1024,
        )

        response_content = completion.choices[0].message.content
        return {"raw_analysis": response_content}
        
    except Exception as e:
        print(f"❌ Vision Analysis Error: {e}")
        return {"raw_analysis": f"Error: {str(e)}"}
