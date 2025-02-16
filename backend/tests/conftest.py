import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from investor_commitments_backend.database import get_db
from investor_commitments_backend.main import app
from investor_commitments_backend.models.investor import Base
from investor_commitments_backend.repositories.investor_repository import SQLAlchemyInvestorRepository
from investor_commitments_backend.services.investor_service import InvestorService

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

@pytest.fixture
def test_db():
    """Create a fresh database for each test."""
    engine = create_engine(
        SQLALCHEMY_TEST_DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        db = TestSessionLocal()
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    db = TestSessionLocal()
    yield db
    Base.metadata.drop_all(bind=engine)
    db.close()

@pytest.fixture
def test_client(test_db):
    """Create a test client using the test database."""
    return TestClient(app)

@pytest.fixture
def test_repository(test_db):
    """Create a repository instance with the test database."""
    return SQLAlchemyInvestorRepository(test_db)

@pytest.fixture
def test_service(test_repository):
    """Create a service instance with the test repository."""
    return InvestorService(test_repository)

@pytest.fixture
def sample_investor_data():
    """Sample investor data for tests."""
    return {
        "name": "Test Investor",
        "type": "Test Type",
        "country": "UK",
        "date_added": "2024-02-16",
        "last_updated": "2024-02-16",
        "total_commitment": 1000000.0
    }

@pytest.fixture
def sample_commitment_data():
    """Sample commitment data for tests."""
    return {
        "asset_class": "Private Equity",
        "amount": 500000.0,
        "currency": "GBP"
    }