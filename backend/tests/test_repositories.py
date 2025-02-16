from investor_commitments_backend.models.investor import Commitment, Investor

def test_get_all_investors_empty(test_repository):
    investors = test_repository.get_all_investors()
    assert len(investors) == 0

def test_get_investor_by_id_not_found(test_repository):
    investor = test_repository.get_investor_by_id(1)
    assert investor is None

def test_create_and_get_investor(test_db, test_repository, sample_investor_data):
    investor = Investor(**sample_investor_data)
    test_db.add(investor)
    test_db.commit()
    
    retrieved = test_repository.get_investor_by_id(investor.id)
    assert retrieved is not None
    assert retrieved.name == sample_investor_data["name"]

def test_get_commitments_by_investor(test_db, test_repository, sample_investor_data, sample_commitment_data):
    investor = Investor(**sample_investor_data)
    test_db.add(investor)
    test_db.commit()
    
    commitment = Commitment(investor_id=investor.id, **sample_commitment_data)
    test_db.add(commitment)
    test_db.commit()
    
    commitments = test_repository.get_commitments_by_investor(investor.id)
    assert len(commitments) == 1
    assert commitments[0].asset_class == sample_commitment_data["asset_class"]