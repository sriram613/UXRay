from langgraph.graph import StateGraph, END
from backend.core.state import AgentState
from backend.services.browser_service import browser_node
from backend.services.vision_service import vision_node
from backend.services.refinement_service import refinement_node

def create_audit_graph():
    """
    Constructs and compiles the audit workflow graph.
    """
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("browser", browser_node)
    workflow.add_node("vision_auditor", vision_node)
    workflow.add_node("data_structurer", refinement_node)

    # Add edges
    workflow.set_entry_point("browser")
    workflow.add_edge("browser", "vision_auditor")
    
    def should_continue(state: AgentState):
        # Check if vision analysis returned an error or empty result
        raw = state.get("raw_analysis", "")
        if not raw or raw.startswith("Error"):
            return END
        return "data_structurer"

    workflow.add_conditional_edges(
        "vision_auditor",
        should_continue,
        {
            "data_structurer": "data_structurer",
            END: END
        }
    )
    
    workflow.add_edge("data_structurer", END)

    # Compile
    return workflow.compile()

# Singleton instance of the graph
audit_graph = create_audit_graph()
