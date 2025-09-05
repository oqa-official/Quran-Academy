// context/CurrencyContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const staticRates: Record<string, number> = {
  USD: 1,
  CAD: 1.36,
  AUD: 1.52,
  GBP: 0.79,
};

const symbols: Record<string, string> = {
  USD: "$",
  CAD: "C$",
  AUD: "A$",
  GBP: "£",
};

type Currency = {
  symbol: string;
  code: string;
  rate: number;
};

const CurrencyContext = createContext<Currency>({
  symbol: "$",
  code: "USD",
  rate: 1,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>({
    symbol: "$",
    code: "USD",
    rate: 1,
  });

  useEffect(() => {
    async function fetchCurrency() {
      try {
        // Step 1: Get IP location
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const map: Record<string, string> = {
          US: "USD",
          CA: "CAD",
          AU: "AUD",
          GB: "GBP",
        };

        const code = map[data.country_code] || "USD";

        // Step 2: Fallback immediately
        setCurrency({
          symbol: symbols[code],
          code,
          rate: staticRates[code],
        });

        // Step 3: Try real-time rates
        const fxRes = await fetch(
          `https://api.exchangerate.host/latest?base=USD&symbols=USD,CAD,AUD,GBP`
        );
        const fxData = await fxRes.json();

        if (fxData?.rates && fxData.rates[code]) {
          setCurrency({
            symbol: symbols[code],
            code,
            rate: fxData.rates[code],
          });
        }
      } catch (err) {
        console.error("Currency fetch failed, fallback in use", err);
      }
    }

    fetchCurrency();
  }, []);

  return (
    <CurrencyContext.Provider value={currency}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
