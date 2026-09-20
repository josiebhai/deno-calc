export type CurrencyCode = keyof typeof CURRENCIES;

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
  denominations: number[];
}

export const CURRENCIES = {
  INR: {
    code: "INR",
    symbol: "₹",
    label: "Indian Rupee",
    denominations: [500, 200, 100, 50, 20, 10, 5, 2, 1],
  },
  // Future currencies go here as new entries, e.g.:
  // USD: { code: "USD", symbol: "$", label: "US Dollar", denominations: [100, 50, 20, 10, 5, 1, 0.25, 0.10, 0.05, 0.01] },
} as const satisfies Record<string, CurrencyConfig>;

export const DEFAULT_CURRENCY_CODE: CurrencyCode = "INR";

export function getCurrency(code: string): CurrencyConfig {
  return (CURRENCIES as Record<string, CurrencyConfig>)[code] ?? CURRENCIES[DEFAULT_CURRENCY_CODE];
}

export function listCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCIES);
}
