// // hooks/useCurrency.ts
// "use client";

// import { useEffect, useState } from "react";

// const exchangeRates: Record<string, number> = {
//   USD: 1,
//   CAD: 1.36,
//   AUD: 1.52,
//   GBP: 0.79,
// };

// const symbols: Record<string, string> = {
//   USD: "$",
//   CAD: "C$",
//   AUD: "A$",
//   GBP: "£",
// };

// export function useCurrency() {
//   const [currency, setCurrency] = useState<{
//     symbol: string;
//     code: string;
//     rate: number;
//   }>({ symbol: "$", code: "USD", rate: 1 });

//   useEffect(() => {
//     async function fetchCurrency() {
//       try {
//         const res = await fetch("https://ipapi.co/json/");
//         const data = await res.json();

//         const map: Record<string, string> = {
//           US: "USD",
//           CA: "CAD",
//           AU: "AUD",
//           GB: "GBP",
//         };

//         const code = map[data.country_code] || "USD";
//         setCurrency({
//           symbol: symbols[code],
//           code,
//           rate: exchangeRates[code],
//         });
//       } catch (err) {
//         console.error("Currency fetch failed", err);
//       }
//     }

//     fetchCurrency();
//   }, []);

//   return currency;
// }




















// // hooks/useCurrency.ts
// "use client";

// import { useEffect, useState } from "react";

// const staticRates: Record<string, number> = {
//   USD: 1,
//   CAD: 1.36,
//   AUD: 1.52,
//   GBP: 0.79,
// };

// const symbols: Record<string, string> = {
//   USD: "$",
//   CAD: "C$",
//   AUD: "A$",
//   GBP: "£",
// };

// export function useCurrency() {
//   const [currency, setCurrency] = useState<{
//     symbol: string;
//     code: string;
//     rate: number;
//   }>({ symbol: "$", code: "USD", rate: 1 });

//   useEffect(() => {
//     async function fetchCurrency() {
//       try {
//         // Step 1: Detect country via IP
//         const res = await fetch("https://ipapi.co/json/");
//         const data = await res.json();

//         const map: Record<string, string> = {
//           US: "USD",
//           CA: "CAD",
//           AU: "AUD",
//           GB: "GBP",
//         };

//         const code = map[data.country_code] || "USD";

//         // Step 2: Show fallback immediately
//         setCurrency({
//           symbol: symbols[code],
//           code,
//           rate: staticRates[code],
//         });

//         // Step 3: Try fetching real-time rates
//         const fxRes = await fetch(
//           `https://api.exchangerate.host/latest?base=USD&symbols=USD,CAD,AUD,GBP`
//         );
//         const fxData = await fxRes.json();

//         if (fxData?.rates && fxData.rates[code]) {
//           setCurrency({
//             symbol: symbols[code],
//             code,
//             rate: fxData.rates[code],
//           });
//         }
//       } catch (err) {
//         console.error("Currency fetch failed, using fallback", err);
//         // Fallback is already shown, so do nothing
//       }
//     }

//     fetchCurrency();
//   }, []);

//   return currency;
// }













// hooks/useCurrency.ts
"use client";

import { useEffect, useState } from "react";

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

// ✅ cache across components
let cachedCurrency: { symbol: string; code: string; rate: number } | null = null;

export function useCurrency() {
  const [currency, setCurrency] = useState<{
    symbol: string;
    code: string;
    rate: number;
  }>(
    cachedCurrency || { symbol: "$", code: "USD", rate: 1 } // use cache if available
  );

  useEffect(() => {
    if (cachedCurrency) return; // ✅ don’t fetch again if already resolved

    async function fetchCurrency() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const map: Record<string, string> = {
          US: "USD",
          CA: "CAD",
          AU: "AUD",
          GB: "GBP",
        };

        const code = map[data.country_code] || "USD";

        // fallback immediately with static
        let newCurrency = {
          symbol: symbols[code],
          code,
          rate: staticRates[code],
        };
        setCurrency(newCurrency);
        cachedCurrency = newCurrency;

        // try real-time API
        const fxRes = await fetch(
          `https://api.exchangerate.host/latest?base=USD&symbols=USD,CAD,AUD,GBP`
        );
        const fxData = await fxRes.json();

        if (fxData?.rates && fxData.rates[code]) {
          newCurrency = {
            symbol: symbols[code],
            code,
            rate: fxData.rates[code],
          };
          setCurrency(newCurrency);
          cachedCurrency = newCurrency;
        }
      } catch (err) {
        console.error("Currency fetch failed", err);
      }
    }

    fetchCurrency();
  }, []);

  return currency;
}
