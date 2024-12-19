from sqlalchemy import Table, Column, String, MetaData
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("email", String, primary_key=True),
    Column("hashed_password", String),
    Column("first_name", String),
    Column("last_name", String),
)
