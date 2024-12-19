from databases import Database
from sqlalchemy import create_engine, MetaData
from dotenv import main
import os

main.load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

database = Database(DATABASE_URL)
engine = create_engine(DATABASE_URL)
metadata = MetaData()
