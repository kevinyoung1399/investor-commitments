from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker
from typing import Generator
import os

db_path = os.getenv("DB_PATH", "sqlite:///./investor_data.db")
engine = create_engine(db_path, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator:
    """
    Create and yield a database session.
    
    Yields:
        Session: SQLAlchemy database session that will be automatically closed after use.
    
    Raises:
        SQLAlchemyError: If there's an error connecting to the database.
    """
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError:
        db.rollback()
        raise
    finally:
        db.close()