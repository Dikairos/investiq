export const savedCompaniesStorageKey = "investiq-demo:saved-companies";
export const comparisonTickersStorageKey = "investiq-demo:comparison-tickers";
export const assistantTickerStorageKey = "investiq-demo:assistant-ticker";

export function readStoredTickers(
  key: string,
  allowedTickers: string[],
  limit = allowedTickers.length,
) {
  const stored = window.localStorage.getItem(key);
  if (stored === null) return [];

  const value: unknown = JSON.parse(stored);
  if (!Array.isArray(value)) {
    throw new Error("Stored demo preferences are invalid.");
  }

  const allowed = new Set(allowedTickers);
  return [...new Set(value.filter((ticker): ticker is string =>
    typeof ticker === "string" && allowed.has(ticker),
  ))].slice(0, limit);
}

export function writeStoredTickers(key: string, tickers: string[]) {
  window.localStorage.setItem(key, JSON.stringify([...new Set(tickers)]));
}

export function readStoredTicker(key: string, allowedTickers: string[]) {
  const ticker = window.localStorage.getItem(key);
  return ticker && allowedTickers.includes(ticker) ? ticker : null;
}

export function writeStoredTicker(key: string, ticker: string) {
  if (ticker) {
    window.localStorage.setItem(key, ticker);
  } else {
    window.localStorage.removeItem(key);
  }
}
