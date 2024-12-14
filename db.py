from databases import Database
from sqlalchemy import create_engine, MetaData
import os

DATABASE_URL = os.environ.get("DATABASE_URL")

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
