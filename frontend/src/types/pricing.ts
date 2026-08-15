export interface OptionPrice {
  strike: number;
  call: number;
  put: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
}

export interface PricingData {
  spot: number;
  timestamp: string;
  options: OptionPrice[];
}

export type PriceDirection = "up" | "down";