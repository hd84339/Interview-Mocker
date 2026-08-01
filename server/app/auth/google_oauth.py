import httpx
from typing import Optional, Dict, Any
from app.config.settings import settings


async def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify Google OAuth access_token or id_token using official Google API endpoints.
    Returns verified user claims (sub, email, name, picture) or None if invalid.
    """
    if not token or not token.strip():
        return None

    async with httpx.AsyncClient(timeout=10.0) as client:
        # 1. Try verifying as Google ID Token via OAuth2 tokeninfo API
        try:
            url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
            response = await client.get(url)
            if response.status_code == 200:
                data = response.json()
                if data.get("email") or data.get("sub"):
                    return data
        except Exception as e:
            print(f"[Google OAuth] ID token verification attempt failed: {e}")

        # 2. Try verifying as Google Access Token via OAuth2 userinfo API
        try:
            userinfo_url = "https://www.googleapis.com/oauth2/v3/userinfo"
            response = await client.get(userinfo_url, headers={"Authorization": f"Bearer {token}"})
            if response.status_code == 200:
                data = response.json()
                if data.get("email") or data.get("sub"):
                    return data
        except Exception as e:
            print(f"[Google OAuth] Access token verification attempt failed: {e}")

    return None

