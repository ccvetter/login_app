from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlmodel import Session as SQLModelSession
from typing import Generator
from dotenv import load_dotenv
import os

load_dotenv()

Base = declarative_base()

# Database Configuration
DATABASE_URL = os.environ.get("DATABASE_URL")

# SQLAlchemy Setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(class_=SQLModelSession, autoflush=False, bind=engine)

# Database Session Dependency
def get_db() -> Generator[SQLModelSession, None, None]:
    """
    Dependency function to manage database sessions
    
    Yields a database session and ensures it's closed after use
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialization function
def init_database():
    """
    Create all database tables
    """
    from models.user import UserModel
    # from python_backend.models.token import TokenModel
    
    Base.metadata.create_all(bind=engine)
    