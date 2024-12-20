from sqlalchemy import Column, DateTime, String, Boolean
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from .model_base import SharedFieldsModel, SharedFieldsSchema
    
# SQLAlchemy Database Model
class UserModel(SharedFieldsModel):
    """
    SQLAlchemy ORM model for users in the database
    """
    __tablename__ = "users"

    username = Column(String, nullable=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=True)
    birthdate = Column(DateTime(timezone=True), nullable=True)
    access_token = Column(String(450), nullable=True)
    refresh_token = Column(String(450), nullable=True)
    active = Column(Boolean, nullable=False, default=True)
    is_staff = Column(Boolean, nullable=False)
    is_admin = Column(Boolean, nullable=False)
    token_created_at = Column(DateTime(timezone=True), nullable=True)

# Pydantic Models for Request/Response Validation
class UserCreate(BaseModel):
    """
    Pydantic model for creating a new user
    """
    username: str
    email: EmailStr
    password: str
    first_name: str
    last_name: Optional[str] = None
    birthdate: Optional[str] = None
    is_staff: Optional[bool] = False
    is_admin: Optional[bool] = False

class UserResponse(SharedFieldsSchema):
    """
    Pydantic model for user response
    """
    username: str
    email: str
    first_name: str
    last_name: str
    birthdate: Optional[datetime] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    active: bool
    is_staff: bool
    is_admin: bool
    token_created_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class ConfigDict:
        from_attributes = True
        arbitrary_types_allowed = True
        
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    birthdate: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    active: Optional[bool] = None
    is_staff: Optional[bool] = None
    is_admin: Optional[bool] = None
    token_created_at: Optional[datetime] = None
    
class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: bool
    
class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    
class TokenCreate(BaseModel):
    access_token: str
    refresh_token: str
    status: bool
    token_created_at: datetime
    