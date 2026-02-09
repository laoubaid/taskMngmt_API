from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

# create engine this is sqlalchmy under the hood
engine = create_engine(
    DATABASE_URL,
    echo=True,  # logs (disable in production)
    pool_pre_ping=True,  # Verify connections before using
)

def create_db_and_tables():
    """Create all tables on startup"""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency for database sessions"""
    # basicly this code init a session yield it , when out of scop session gets closed
    # combo of genertor and with keyword wierd but efficient lol
    with Session(engine) as session:
        yield session
