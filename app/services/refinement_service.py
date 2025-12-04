from langchain_groq import ChatGroq
from app.core.state import AgentState
from app.core.config import settings

async def refinement_node(state: AgentState) -> dict:
    """
    Structures the raw analysis into JSON using Groq.
    """
    raw_analysis = state.get("raw_analysis")
    if not raw_analysis:
        return {"final_json": "{}"}

    print("⚡ Groq is structuring the report...")

    try:
        # Initialize Groq
        llm = ChatGroq(
            model_name="openai/gpt-oss-20b", 
            temperature=0,
            groq_api_key=settings.GROQ_API_KEY
        )

        prompt = f"""
        You are a JSON formatter. Take the following UX analysis and format it into a strictly valid JSON object.
        
        Analysis:
        {raw_analysis}
        
        Output format requirement:
        {{
            "audit_summary": "One sentence summary",
            "issues": [
                {{ "title": "...", "description": "...", "suggested_fix": "..." }}
            ]
        }}
        
        Return ONLY the JSON. No preamble.
        """

        response = await llm.ainvoke(prompt)
        print(f"📝 Groq Response:\n{response.content}")
        return {"final_json": response.content}
        
    except Exception as e:
        print(f"❌ Refinement Error: {e}")
        return {"final_json": f'{{"error": "{str(e)}"}}'}
