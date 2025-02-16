from pydantic import BaseModel, ConfigDict

def to_camel(string: str) -> str:
    """Convert a snake_case string to camelCase."""
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

class CamelCaseModel(BaseModel):
    """Base model that converts all snake_case fields to camelCase in the API response."""
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True
    )

class CommitmentBase(CamelCaseModel):
    asset_class: str
    amount: float
    currency: str

class InvestorSummary(CamelCaseModel):
    id: int
    name: str
    total_commitment: float

class InvestorCommitments(CamelCaseModel):
    investor: str
    total_commitment: float
    commitments: list[CommitmentBase]