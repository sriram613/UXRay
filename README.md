# AI Audit Service

An intelligent web auditing tool that uses autonomous agents to analyze web pages for UI/UX flaws and accessibility issues. Built with **LangGraph**, **Google Gemini**, **Groq**, and **Playwright**.

## 🚀 Features

*   **Automated Browser Navigation**: Uses Playwright to autonomously visit and screenshot web pages.
*   **Visual Intelligence**: Leverages **Google Gemini 2.0 Flash** to visually analyze screenshots for design flaws, contrast issues, and UX improvements.
*   **Structured Reporting**: Uses **Groq (Llama 3)** to format unstructured analysis into strict, machine-readable JSON.
*   **Real-time WebSocket API**: Provides a streaming interface for client applications to request audits.
*   **Clean Architecture**: Refactored codebase following SOLID principles and modular design.

## 🛠️ Prerequisites

*   Python 3.10 or higher
*   [uv](https://github.com/astral-sh/uv) (An extremely fast Python package installer and resolver)

## 📦 Installation & Setup

### 1. Install `uv`

If you haven't installed `uv` yet, use one of the following commands:

**Windows (PowerShell):**
```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

**macOS / Linux:**
```bash
curl -lsSf https://astral.sh/uv/install.sh | sh
```

### 2. Create a Virtual Environment

Navigate to the project directory and create a new virtual environment:

```bash
uv venv
```

Activate the virtual environment:

*   **Windows:** `.venv\Scripts\activate`
*   **macOS/Linux:** `source .venv/bin/activate`

### 3. Install Dependencies (`uv sync`)

Sync the project dependencies ensuring your environment matches the lock file:

```bash
uv sync
```

### 4. Install Playwright Browsers

The browser agent requires Chromium to be installed:

```bash
uv run playwright install chromium
```

## ⚙️ Configuration

Create a `.env` file in the root directory with your API keys:

```env
GOOGLE_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
```

## 🏃‍♂️ Running the Application

Start the WebSocket server:

```bash
uv run -m app.main
```

The server will start on `http://127.0.0.1:8001`.

## 🔌 WebSocket API

**Endpoint:** `ws://127.0.0.1:8001/analyze-url`

### Message Structure

**Request (Client -> Server):**
Send a JSON string containing the target URL.

```json
{
  "url": "https://example.com"
}
```

**Response (Server -> Client):**
The server returns a JSON object containing the audit summary and a list of issues.

```json
{
  "audit_summary": "The website has good structure but suffers from low contrast text and inconsistent spacing.",
  "issues": [
    {
      "title": "Low Contrast Navigation Links",
      "description": "The grey text on the white background in the header fails WCAG AA standards.",
      "suggested_fix": "Darken the text color to #333333 or darker."
    },
    {
      "title": "Missing Alt Text",
      "description": "Several images in the hero section lack descriptive alt tags.",
      "suggested_fix": "Add descriptive alt attributes to all img tags."
    }
  ]
}
```
