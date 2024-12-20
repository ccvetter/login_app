from datetime import datetime, timezone
from fastapi import Depends, HTTPException, APIRouter
from sqlmodel import Session, select
from utils import verify_password, create_access_token, create_refresh_token
from models.user import UserModel, UserUpdate, UserLogin, TokenSchema
from database import get_db

router = APIRouter(
    prefix="/api/v1"
)

# Endpoints
@router.post("/login", response_model=TokenSchema, status_code=202)
async def login_user(request: UserLogin, db: Session = Depends(get_db)):
    """
    Login a user
    """
    # Check if email already exists
    user_query = select(UserModel).where(UserModel.email == request.email)
    results = db.exec(user_query)
    user = results.first()
    
    if user is None:
        raise HTTPException(status_code=401, detail="Email not found")
    
    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    update_user = UserUpdate(
        access_token=access_token, 
        refresh_token=refresh_token,
        status=True,
        token_created_at=datetime.now(timezone.utc)
    )
    for field, value in update_user.model_dump(exclude_unset=True).items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }
    