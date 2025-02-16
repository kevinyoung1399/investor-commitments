from app.models.investor import Commitment, Investor


def test_get_investors_endpoint(test_client, test_db, sample_investor_data):
    investor = Investor(**sample_investor_data)
    test_db.add(investor)
    test_db.commit()
    
    response = test_client.get("/api/investors/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == sample_investor_data["name"]

def test_get_investor_commitments_endpoint(test_client, test_db, sample_investor_data, sample_commitment_data):
    investor = Investor(**sample_investor_data)
    test_db.add(investor)
    test_db.commit()
    
    commitment = Commitment(investor_id=investor.id, **sample_commitment_data)
    test_db.add(commitment)
    test_db.commit()
    
    response = test_client.get(f"/api/investors/{investor.id}/commitments/")
    assert response.status_code == 200
    data = response.json()
    assert data["investor"] == sample_investor_data["name"]
    assert len(data["commitments"]) == 1

def test_get_investor_commitments_not_found(test_client):
    response = test_client.get("/api/investors/999/commitments/")
    assert response.status_code == 404

def test_health_check_endpoint(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"