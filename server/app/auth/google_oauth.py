import httpx
from typing import Optional, Dict, Any
from app.config.settings import settings


async def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Google OAuth access_token or id_token using Google API endpoints.
    """
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        if response.status_code == 200:
            return response.json()
    return None
