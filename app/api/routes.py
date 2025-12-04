import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.workflows.audit_graph import audit_graph

router = APIRouter()

@router.websocket("/analyze-url")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("🔌 Client connected")
    try:
        while True:
            # Expecting a JSON string with at least {"url": "..."}
            data = await websocket.receive_text()
            print(f"📩 Received: {data}")
            
            try:
                input_data = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))
                continue

            # Start the graph with initial state
            inputs = {
                "url": input_data.get("url", ""),
                "screenshot_b64": "",
                "raw_analysis": "",
                "final_json": "",
            }

            # Invoke the graph
            try:
                result = await audit_graph.ainvoke(inputs)
                # Send back the final result
                await websocket.send_text(result["final_json"])
            except Exception as e:
                print(f"❌ Graph Execution Error: {e}")
                await websocket.send_text(json.dumps({"error": str(e)}))
            
    except WebSocketDisconnect:
        print("🔌 Client disconnected")
    except Exception as e:
        print(f"❌ WebSocket Error: {e}")
