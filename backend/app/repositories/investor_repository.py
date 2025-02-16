from fastapi import HTTPException
from sqlalchemy.orm import Session
from abc import ABC, abstractmethod
from app.models.investor import Investor, Commitment
from typing import List, Optional
from sqlalchemy.exc import SQLAlchemyError

class DatabaseError(Exception):
    """Base exception for database operations"""
    pass

class InvestorRepository(ABC):
    """Abstract base class defining the interface for investor data access."""
    
    @abstractmethod
    def get_all_investors(self) -> List[Investor]:
        """Retrieve all investors."""
        pass

    @abstractmethod
    def get_investor_by_id(self, investor_id: int) -> Optional[Investor]:
        """Retrieve an investor by their ID."""
        pass

    @abstractmethod
    def get_commitments_by_investor(self, investor_id: int) -> List[Commitment]:
        """Retrieve all commitments for a specific investor."""
        pass

class SQLAlchemyInvestorRepository(InvestorRepository):
    """SQLAlchemy implementation of the InvestorRepository interface."""
    
    def __init__(self, db: Session):
        """
        Initialize the repository with a database session.
        
        Args:
            db: SQLAlchemy database session
        """
        self.db = db

    def get_all_investors(self) -> List[Investor]:
            """Get all investors from the database."""
            try:
                return self.db.query(Investor).all()
            except SQLAlchemyError as e:
                self.db.rollback()
                raise DatabaseError("Failed to fetch investors") from e

    def get_investor_by_id(self, investor_id: int) -> Optional[Investor]:
        """Get a specific investor by ID."""
        try:
            return self.db.query(Investor).filter(Investor.id == investor_id).first()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseError(f"Failed to fetch investor {investor_id}") from e

    def get_commitments_by_investor(self, investor_id: int) -> List[Commitment]:
        """Get all commitments for a specific investor."""
        try:
            return self.db.query(Commitment).filter(Commitment.investor_id == investor_id).all()
        except SQLAlchemyError as e:
            self.db.rollback()
            raise DatabaseError(f"Failed to fetch commitments for investor {investor_id}") from e
