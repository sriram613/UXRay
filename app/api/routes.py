import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import ValidationError
from app.workflows.audit_graph import audit_graph
from app.core.schemas import AuditRequest, AuditReport

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
                # Validate input using Pydantic
                request_model = AuditRequest(**input_data)
                url = str(request_model.url)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))
                continue
            except ValidationError as e:
                await websocket.send_text(json.dumps({"error": "Validation Error", "details": e.errors()}))
                continue

            # Start the graph with initial state
            inputs = {
                "url": url,
                "screenshot_b64": "",
                "raw_analysis": "",
                "final_json": "",
            }

            # Invoke the graph
            try:
                result = await audit_graph.ainvoke(inputs)
                final_json_str = result["final_json"]
                
                # Validate output using Pydantic
                try:
                    # Parse the JSON string first
                    # Clean the string if it contains markdown code blocks
                    cleaned_json_str = final_json_str.strip()
                    if cleaned_json_str.startswith("```"):
                        cleaned_json_str = cleaned_json_str.strip("`")
                        if cleaned_json_str.startswith("json"):
                            cleaned_json_str = cleaned_json_str[4:]
                        cleaned_json_str = cleaned_json_str.strip()
                    
                    final_data = json.loads(cleaned_json_str)
                    # Validate against schema
                    report = AuditReport(**final_data)
                    # Send back the validated (and potentially re-serialized) JSON
                    await websocket.send_text(report.model_dump_json())
                except (json.JSONDecodeError, ValidationError) as e:
                    print(f"❌ Output Validation Error: {e}")
                    # If validation fails, we might still want to send the raw output or an error
                    # For now, let's send an error indicating the LLM output was malformed
                    await websocket.send_text(json.dumps({
                        "error": "LLM Output Validation Failed", 
                        "raw_output": final_json_str,
                        "details": str(e)
                    }))

            except Exception as e:
                print(f"❌ Graph Execution Error: {e}")
                await websocket.send_text(json.dumps({"error": str(e)}))
            
    except WebSocketDisconnect:
        print("🔌 Client disconnected")
    except Exception as e:
        print(f"❌ WebSocket Error: {e}")
