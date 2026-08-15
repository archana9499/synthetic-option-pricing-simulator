import random
from datetime import datetime

from pricing import calculate_option_prices


class Simulator:
    def __init__(
        self,
        starting_price: float = 20_000.00,
        strike_step: float = 100,
        num_strikes: int = 2,
        volatility: float = 0.20,
        risk_free_rate: float = 0.05,
        time_to_expiry: float = 30 / 365,
    ):
        self.default_starting_price = (
            starting_price
        )

        self.starting_price = starting_price
        self.current_price = starting_price

        self.strike_step = strike_step
        self.num_strikes = num_strikes

        self.volatility = volatility
        self.risk_free_rate = risk_free_rate
        self.time_to_expiry = time_to_expiry

    def generate_strikes(self):
        return [
            self.starting_price
            + (i * self.strike_step)
            for i in range(
                -self.num_strikes,
                self.num_strikes + 1,
            )
        ]

    def reset(self):
        self.current_price = (
            self.starting_price
        )

    def set_starting_price(
        self,
        price: float,
    ):
        if price <= 0:
            raise ValueError(
                "Starting price must be positive."
            )

        self.starting_price = price

    def set_volatility(
        self,
        volatility: float,
    ):
        if not 0.01 <= volatility <= 2.0:
            raise ValueError(
                "Volatility must be between "
                "0.01 and 2.0."
            )

        self.volatility = volatility

    def generate_pricing_data(self):
        movement = random.uniform(-5, 5)

        self.current_price += movement

        timestamp = (
            datetime.now().isoformat()
        )

        options = []

        for strike in self.generate_strikes():

            prices = calculate_option_prices(
                spot=self.current_price,
                strike=strike,
                volatility=self.volatility,
                risk_free_rate=self.risk_free_rate,
                time_to_expiry=self.time_to_expiry,
            )

            options.append({
                "strike": round(
                    strike,
                    2,
                ),
                "call": round(
                    prices["call"],
                    2,
                ),
                "put": round(
                    prices["put"],
                    2,
                ),
                "delta": round(
                    prices["delta"],
                    4,
                ),
                "gamma": round(
                    prices["gamma"],
                    6,
                ),
                "theta": round(
                    prices["theta"],
                    4,
                ),
                "vega": round(
                    prices["vega"],
                    4,
                ),
            })

        return {
            "spot": round(
                self.current_price,
                2,
            ),
            "timestamp": timestamp,
            "options": options,
        }