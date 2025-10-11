"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const bankDetails = [
  { label: "Account holder", value: "Global Quran Academy Limited" },
  { label: "Sort code", value: "23-08-01" },
  { label: "Account number", value: "26364451" },
  { label: "IBAN", value: "GB93 TRWI 2308 0126 3644 51" },
  { label: "Bank name", value: "Wise Payments Limited" },
  { label: "Address", value: "56 Shoreditch High Street, London" },
];

export default function WisePaymentCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      console.error("Failed to copy text");
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#0e1b1f] dark:to-[#122031] border border-emerald-200 dark:border-gray-700 rounded-xl p-5 shadow-md space-y-3 mt-4">
      <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">
        Pay directly into the academy’s account:
      </h3>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {bankDetails.map((item) => (
          <div
            key={item.label}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-2"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
              {item.label}:
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-gray-800 dark:text-gray-100 break-all">
                {item.value}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(item.value, item.label)}
                className="h-7 w-7"
              >
                {copiedField === item.label ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
