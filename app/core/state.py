from typing import TypedDict

class AgentState(TypedDict):
    """
    Represents the state of the audit workflow.
    """
    url: str
    screenshot_b64: str
    raw_analysis: str
    final_json: str
