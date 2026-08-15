import math

from scipy.stats import norm


def calculate_option_prices(
    spot: float,
    strike: float,
    volatility: float,
    risk_free_rate: float,
    time_to_expiry: float,
):
    d1 = (
        math.log(spot / strike)
        + (
            risk_free_rate
            + (volatility ** 2) / 2
        )
        * time_to_expiry
    ) / (
        volatility
        * math.sqrt(time_to_expiry)
    )

    d2 = (
        d1
        - volatility
        * math.sqrt(time_to_expiry)
    )

    discount_factor = math.exp(
        -risk_free_rate * time_to_expiry
    )

    call_price = (
        spot * norm.cdf(d1)
        - strike
        * discount_factor
        * norm.cdf(d2)
    )

    put_price = (
        strike
        * discount_factor
        * norm.cdf(-d2)
        - spot * norm.cdf(-d1)
    )

    delta = norm.cdf(d1)

    gamma = (
        norm.pdf(d1)
        / (
            spot
            * volatility
            * math.sqrt(time_to_expiry)
        )
    )

    theta = (
        -(
            spot
            * norm.pdf(d1)
            * volatility
        )
        / (
            2
            * math.sqrt(time_to_expiry)
        )
        - risk_free_rate
        * strike
        * discount_factor
        * norm.cdf(d2)
    )

    vega = (
        spot
        * norm.pdf(d1)
        * math.sqrt(time_to_expiry)
    )

    return {
        "call": call_price,
        "put": put_price,
        "delta": delta,
        "gamma": gamma,
        "theta": theta,
        "vega": vega,
    }