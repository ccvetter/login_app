from sqlalchemy import Column, DateTime, UUID
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declared_attr
from database import Base
from pydantic import BaseModel, RootModel
from typing import Optional
import uuid

class ID(RootModel):
    root: uuid.UUID

class SharedFieldsMixin:
    """
    A mixin class that adds created_at and updated_at timestamps to SQLAlchemy models
    """
    @declared_attr
    def id(cls):
        """
        Automatically add a UUID id column to models using this mixin
        """
        return Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4(), index=True)

    @declared_attr
    def created_at(cls):
        """
        Add a created_at timestamp column with server-side default
        """
        return Column(DateTime(timezone=True), server_default=func.now())

    @declared_attr
    def updated_at(cls):
        """
        Add an updated_at timestamp column that updates on each modification
        """
        return Column(DateTime(timezone=True), onupdate=func.now())

class SharedFieldsModel(Base, SharedFieldsMixin):
    """
    An abstract base model that can be used directly or inherited from
    Provides id, created_at, and updated_at fields
    """
    __abstract__ = True

# Pydantic mixin for timestamp fields
class SharedFieldsSchema(BaseModel):
    """
    Pydantic mixin for adding timestamp fields to response models
    """
    id: Optional[ID] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class ConfigDict:
        from_attributes = True
    