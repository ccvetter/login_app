from typing import List, Optional
from fastapi import Depends, HTTPException, Path, Query, APIRouter, status
from sqlmodel import Session, select
from datetime import datetime
from models.user import UserModel, UserCreate, UserResponse, UserUpdate
from utils import hash_password, JWTBearer
from database import get_db

import uuid

router = APIRouter(
    prefix="/api/v1/users"
)

jwt_bearer = JWTBearer()

# Helper functions
def get_user_by_id(user_id: uuid.UUID, db: Session) -> Optional[UserModel]:
    """
    Retrieve a user by ID from the database.
    """
    user_query = select(UserModel).where(UserModel.id == user_id)
    return db.exec(user_query).first()


def get_user_by_email(email: str, db: Session) -> Optional[UserModel]:
    """
    Retrieve a user by email from the database.
    """
    email_query = select(UserModel).where(UserModel.email == email)
    return db.exec(email_query).first()

# Endpoints
@router.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """
    Simple health check endpoint
    """
    return {"status": "healthy"}

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user in the database
    """
    # Check if email already exists
    if get_user_by_email(user.email, db):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    birthdate = datetime.strptime(user.birthdate, "%Y-%m-%d").strftime("%m/%d/%Y") if user.birthdate else None

    # Create new user
    db_user = UserModel(
        username=user.username, 
        email=user.email,
        password=hash_password(user.password),
        first_name=user.first_name,
        last_name=user.last_name,
        birthdate=birthdate,
        is_staff=user.is_staff,
        is_admin=user.is_admin
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.get("/", dependencies=[Depends(jwt_bearer)], response_model=List[UserResponse])
async def list_users(
    skip: int = Query(0, ge=0), 
    limit: int = Query(100, ge=1, le=500), 
    db: Session = Depends(get_db)
):
    """
    Retrieve list of users with pagination
    """
    users_query = select(UserModel).offset(skip).limit(limit)
    users = db.exec(users_query).all()
    return users

@router.get("/{user_id}", dependencies=[Depends(jwt_bearer)], response_model=UserResponse)
async def get_user(
    user_id: uuid.UUID = Path(...), 
    db: Session = Depends(get_db)
):
    """
    Retrieve a specific user by ID
    """
    user = get_user_by_id(user_id, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return user

@router.put("/{user_id}", dependencies=[Depends(jwt_bearer)], response_model=UserResponse)
async def update_user(
    user_id: uuid.UUID = Path(...), 
    user_update: UserUpdate = None, 
    db: Session = Depends(get_db)
):
    """
    Update an existing user
    """
    db_user = get_user_by_id(user_id, db)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if new email is already in use
    if user_update.email:
        existing_user = get_user_by_email(user_update.email, db)
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")

    # Hash password if it's being updated
    if user_update.password:
        user_update.password = hash_password(user_update.password)

    # Update user fields
    for field, value in user_update.model_dump(exclude_unset=True).items():
        setattr(db_user, field, value)

    db.commit()
    db.refresh(db_user)
    
    return db_user

@router.delete("/{user_id}", dependencies=[Depends(jwt_bearer)], status_code=204)
async def delete_user(
    user_id: uuid.UUID = Path(...), 
    db: Session = Depends(get_db)
):
    """
    Delete a user by their ID
    """
    # Find the user
    db_user = get_user_by_id(user_id, db)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # Delete the user
    db.delete(db_user)
    db.commit()

@router.get("/search", dependencies=[Depends(jwt_bearer)], response_model=List[UserResponse], status_code=200)
async def search_users(
    username: Optional[str] = Query(None, min_length=2, max_length=50),
    email: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    Search users with optional filters
    """
    query = select(UserModel)
    
    if username:
        query = query.where(UserModel.username.ilike(f"%{username}%"))
    
    if email is not None:
        query = query.where(UserModel.email == email)
        
    results = db.exec(query).all()
    
    return results
