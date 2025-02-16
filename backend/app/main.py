from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
import csv
from typing import Dict
from app.api import investors
from app.models.investor import Base, Investor, Commitment
from app.database import engine, SessionLocal
from fastapi.middleware.cors import CORSMiddleware
from decimal import Decimal

def load_initial_data() -> None:
    """
    Load initial investor and commitment data from CSV file into the database.
    Only loads data if the database is empty.
    
    The function handles duplicate investors and accumulates commitments.
    """
    db = SessionLocal()
    try:
        if db.query(Investor).first():
            return
        
        investor_cache: Dict[str, Investor] = {}
        
        with open('./data/data.csv', 'r') as file:
            csv_reader = csv.DictReader(file)
            for row in csv_reader:
                investor_name = row['Investor Name']
                
                if investor_name in investor_cache:
                    investor = investor_cache[investor_name]
                else:
                    investor = Investor(
                        name=investor_name,
                        type=row['Investor Type'],
                        country=row['Investor Country'],
                        date_added=row['Investor Date Added'],
                        last_updated=row['Investor Last Updated'],
                        total_commitment=Decimal('0')  # Use Decimal for financial calculations
                    )
                    db.add(investor)
                    db.flush()
                    investor_cache[investor_name] = investor
                
                commitment_amount = Decimal(str(row['Commitment Amount']))
                commitment = Commitment(
                    investor_id=investor.id,
                    asset_class=row['Commitment Asset Class'],
                    amount=commitment_amount,
                    currency=row['Commitment Currency']
                )
                db.add(commitment)
                investor.total_commitment += commitment_amount
        
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to load initial data: {str(e)}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan event handler that initializes the database and loads initial data.
    
    Args:
        app: FastAPI application instance
    """
    Base.metadata.create_all(bind=engine)
    load_initial_data()
    yield

app = FastAPI(
    lifespan=lifespan,
    title="Investor Commitments API",
    description="API for managing and tracking investor commitments",
    version="1.0.0"
)

app.include_router(investors.router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check() -> Dict[str, str]:
    """
    Health check endpoint to verify service status.
    
    Returns:
        dict: Service health status information
    """
    return {
        "status": "healthy",
        "service": "investor-commitments-service"
    }
