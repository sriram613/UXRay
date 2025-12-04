from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from app.core.state import AgentState
from app.core.config import settings

async def vision_node(state: AgentState) -> dict:
    """
    Analyzes the screenshot using Google Gemini.
    """
    screenshot_b64 = state.get("screenshot_b64")
    if not screenshot_b64:
        print("⚠️ Warning: No screenshot available for analysis.")
        return {"raw_analysis": "No screenshot captured."}

    print("👁️  Gemini is analyzing the UI...")

    try:
        # Initialize Gemini
        # Using the key from settings implicitly via environment variable or passing it explicitly if needed.
        # LangChain usually picks up GOOGLE_API_KEY from env.
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=settings.GOOGLE_API_KEY)

        # Create the multimodal message
        message = HumanMessage(
            content=[
                {
                    "type": "text",
                    "text": "Analyze this web UI. List 3 distinct UX/UI design flaws or Accessibility (contrast/font) issues. Be descriptive.",
                },
                {
                    "type": "image_url",
                    "image_url": f"data:image/png;base64,{screenshot_b64}",
                },
            ]
        )

        response = await llm.ainvoke([message])
        return {"raw_analysis": response.content}
        
    except Exception as e:
        print(f"❌ Vision Analysis Error: {e}")
        return {"raw_analysis": f"Error during analysis: {e}"}
