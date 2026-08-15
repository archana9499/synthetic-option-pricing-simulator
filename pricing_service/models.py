from typing import List

from pydantic import BaseModel


class OptionPrice(BaseModel):
    strike: float
    call: float
    put: float
    delta: float
    gamma: float
    theta: float
    vega: float


class PricingData(BaseModel):
    spot: float
    timestamp: str
    options: List[OptionPrice]