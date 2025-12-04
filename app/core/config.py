import os
import getpass
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        load_dotenv(override=True)
        self.GOOGLE_API_KEY = self._get_env_variable("GOOGLE_API_KEY", "Enter your Google AI API key: ")
        self.GROQ_API_KEY = self._get_env_variable("GROQ_API_KEY", "Enter your Groq API key: ")
        self.HOST = "127.0.0.1"
        self.PORT = 8001

    def _get_env_variable(self, key: str, prompt: str) -> str:
        value = os.getenv(key)
        if not value:
            # In a server environment, interactive input might not be ideal, 
            # but preserving original behavior for now.
            # Ideally, this should raise an error in production.
            try:
                value = getpass.getpass(prompt)
                os.environ[key] = value
            except Exception:
                print(f"❌ WARNING: {key} is not set and cannot prompt for input.")
        return value

settings = Settings()
