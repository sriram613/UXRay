from langgraph.graph import StateGraph, END
from app.core.state import AgentState
from app.services.browser_service import browser_node
from app.services.vision_service import vision_node
from app.services.refinement_service import refinement_node

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
    workflow.add_edge("vision_auditor", "data_structurer")
    workflow.add_edge("data_structurer", END)

    # Compile
    return workflow.compile()

# Singleton instance of the graph
audit_graph = create_audit_graph()
