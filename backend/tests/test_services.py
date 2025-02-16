from app.models.investor import Commitment, Investor


def test_get_all_investors_service(test_db, test_service, sample_investor_data):
    investor = Investor(**sample_investor_data)
    test_db.add(investor)
    test_db.commit()
    
    investors = test_service.get_all_investors()
    assert len(investors) == 1
    assert investors[0]["name"] == sample_investor_data["name"]
    assert investors[0]["total_commitment"] == sample_investor_data["total_commitment"]

def test_get_investor_commitments_service(test_db, test_service, sample_investor_data, sample_commitment_data):
    investor = Investor(**sample_investor_data)
    test_db.add(investor)
    test_db.commit()
    
    commitment = Commitment(investor_id=investor.id, **sample_commitment_data)
    test_db.add(commitment)
    test_db.commit()
    
    result = test_service.get_investor_commitments(investor.id)
    assert result is not None
    assert result["investor"] == sample_investor_data["name"]
    assert len(result["commitments"]) == 1
    assert result["commitments"][0]["asset_class"] == sample_commitment_data["asset_class"]