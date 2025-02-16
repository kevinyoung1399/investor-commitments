from investor_commitments_backend.models.investor import Investor, Commitment

def test_investor_model_creation():
    investor = Investor(
        name="Test Investor",
        type="Test Type",
        country="UK",
        date_added="2024-02-16",
        last_updated="2024-02-16",
        total_commitment=1000000.0
    )
    
    assert investor.name == "Test Investor"
    assert investor.type == "Test Type"
    assert investor.country == "UK"
    assert float(investor.total_commitment) == 1000000.0

def test_commitment_model_creation():
    commitment = Commitment(
        investor_id=1,
        asset_class="Private Equity",
        amount=500000.0,
        currency="GBP"
    )
    
    assert commitment.investor_id == 1
    assert commitment.asset_class == "Private Equity"
    assert float(commitment.amount) == 500000.0
    assert commitment.currency == "GBP"