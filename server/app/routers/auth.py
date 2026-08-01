from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.schemas.user import UserCreate, UserResponse, Token, TokenWithUser, GoogleAuthRequest
from app.models.user import User
from app.auth.jwt_handler import hash_password, verify_password, create_access_token
from app.auth.google_oauth import verify_google_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_in.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password) if user_in.password else None
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not user_in.password or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/google", response_model=TokenWithUser)
async def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    google_data = await verify_google_token(req.id_token)
    if not google_data or not google_data.get("email"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or unverified Google token"
        )

    email = google_data.get("email")
    google_id = google_data.get("sub")
    full_name = google_data.get("name")
    avatar_url = google_data.get("picture")

    user = db.query(User).filter((User.email == email) | (User.google_id == google_id)).first()
    if not user:
        user = User(
            email=email,
            full_name=full_name or email.split("@")[0].capitalize(),
            google_id=google_id,
            avatar_url=avatar_url or f"https://ui-avatars.com/api/?name={encode_name(full_name or email)}"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update user details if updated from Google
        if full_name and user.full_name != full_name:
            user.full_name = full_name
        if avatar_url and user.avatar_url != avatar_url:
            user.avatar_url = avatar_url
        if google_id and not user.google_id:
            user.google_id = google_id
        db.commit()
        db.refresh(user)

    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


def encode_name(name: str) -> str:
    from urllib.parse import quote
    return quote(name or "User")

