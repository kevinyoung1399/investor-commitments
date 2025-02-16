from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Investor(Base):
    __tablename__ = "investors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    type = Column(String)
    country = Column(String)
    date_added = Column(String)
    last_updated = Column(String)
    total_commitment = Column(Float, default=0.0)
    
    commitments = relationship("Commitment", back_populates="investor")

class Commitment(Base):
    __tablename__ = "commitments"
    
    id = Column(Integer, primary_key=True, index=True)
    investor_id = Column(Integer, ForeignKey("investors.id"))
    asset_class = Column(String)
    amount = Column(Float)
    currency = Column(String)
    
    investor = relationship("Investor", back_populates="commitments")