from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
from pathlib import Path
import os
from dotenv import load_dotenv

# .env is in the project root (one level up from app/)
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(env_path)

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
