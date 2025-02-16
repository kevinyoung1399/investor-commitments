from typing import List, Dict, Optional
from investor_commitments_backend.repositories.investor_repository import InvestorRepository

class InvestorService:
    """
    Service layer for handling business logic related to investors and their commitments.
    """
    
    def __init__(self, repository: InvestorRepository):
        """
        Initialize the investor service with a repository.
        
        Args:
            repository: An implementation of InvestorRepository
        """
        self.repository = repository

    def get_all_investors(self) -> List[Dict]:
        """
        Retrieve all investors with their basic information.
        
        Returns:
            List[Dict]: List of investors with their ID, name, and total commitment
        """
        investors = self.repository.get_all_investors()
        return [
            {
                "id": inv.id,
                "name": inv.name,
                "total_commitment": float(inv.total_commitment)
            } 
            for inv in investors
        ]

    def get_investor_commitments(self, investor_id: int) -> Optional[Dict]:
        """
        Get detailed commitment information for a specific investor.
        
        Args:
            investor_id: The ID of the investor
            
        Returns:
            Optional[Dict]: Investor's details and commitments, or None if not found
        """
        investor = self.repository.get_investor_by_id(investor_id)
        if not investor:
            return None
        
        commitments = self.repository.get_commitments_by_investor(investor_id)
        return {
            "investor": investor.name,
            "total_commitment": float(investor.total_commitment),
            "commitments": [
                {
                    "asset_class": c.asset_class,
                    "amount": float(c.amount),
                    "currency": c.currency
                } 
                for c in commitments
            ]
        }
