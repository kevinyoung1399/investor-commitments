from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.repositories.investor_repository import DatabaseError, SQLAlchemyInvestorRepository
from app.services.investor_service import InvestorService
from app.database import get_db
from app.schemas.investor import InvestorSummary, InvestorCommitments

router = APIRouter(tags=["investors"])

def get_service(db: Session = Depends(get_db)) -> InvestorService:
    """
    Dependency injection for the InvestorService.
    
    Args:
        db: Database session from dependency
        
    Returns:
        InvestorService: Configured service instance
    """
    repository = SQLAlchemyInvestorRepository(db)
    return InvestorService(repository)

@router.get("/investors/", response_model=List[InvestorSummary])
async def get_investors(
    service: InvestorService = Depends(get_service)
) -> List[InvestorSummary]:
    """
    Retrieve a list of all investors with their summary information.
    
    Args:
        service: InvestorService instance from dependency
        
    Returns:
        List[InvestorSummary]: List of investor summaries
    
    Raises:
        HTTPException: If there's a database error during retrieval (500)
    """
    try:
        return service.get_all_investors()
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/investors/{investor_id}/commitments/", response_model=InvestorCommitments)
async def get_investor_commitments(
    investor_id: int,
    service: InvestorService = Depends(get_service)
) -> InvestorCommitments:
    """
    Retrieve detailed commitment information for a specific investor.
    
    Args:
        investor_id: ID of the investor to retrieve
        service: InvestorService instance from dependency
        
    Returns:
        InvestorCommitments: Detailed investor commitment information
        
    Raises:
        HTTPException: If investor is not found (404)
    """
    try:
        result = service.get_investor_commitments(investor_id)
        if not result:
            raise HTTPException(status_code=404, detail="Investor not found")
        return result
    except DatabaseError as e:
        raise HTTPException(status_code=500, detail=str(e))
