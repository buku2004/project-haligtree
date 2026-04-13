"use client";
import { useEffect, useState } from "react";

const convertNum = (num: number): string => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + "T";
  } else if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
};

interface DominanceData {
  btc: number;
  eth: number;
  usdt: number;
  others: number;
  totalMarketCap: number;
  volume24h: number;
  activeCrypto: number;
}

const toSafeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function MarketDominance() {
  const [data, setData] = useState<DominanceData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    fetch(`${apiBaseUrl}/api/market-dominance`)
      .then((res) => res.json())
      .then((incoming) => {
        const normalized: DominanceData = {
          btc: toSafeNumber(incoming?.btc),
          eth: toSafeNumber(incoming?.eth),
          usdt: toSafeNumber(incoming?.usdt),
          others: toSafeNumber(incoming?.others),
          totalMarketCap: toSafeNumber(incoming?.totalMarketCap),
          volume24h: toSafeNumber(incoming?.volume24h),
          activeCrypto: Math.round(toSafeNumber(incoming?.activeCrypto)),
        };

        setData(normalized);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load market dominance data");
      });
  }, []);

  if (!data) {
    return (
      <div className="animate-pulse bg-gray-200 h-24 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">{error || "Loading data..."}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gray-200/40 shadow-md">
      <h2 className="text-xl font-bold mb-2">Market Dominance</h2>

      <div className="mb-2 flex justify-between text-sm text-gray-400">
        <div>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Bitcoin
          </span>
          <p className="text-xl font-bold text-[#333]">{data.btc.toFixed(1)}%</p>
        </div>

        <div>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Ethereum
          </span>
          <p className="text-xl font-bold text-[#333]">{data.eth.toFixed(1)}%</p>
        </div>

        <div>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            USDT
          </span>
          <p className="text-xl font-bold text-[#333]">{data.usdt.toFixed(1)}%</p>
        </div>

        <div>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            Others
          </span>
          <p className="text-xl font-bold text-[#333]">
            {data.others.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-400 space-y-1">
        <p>Total Market Cap: ${convertNum(data.totalMarketCap)}</p>
        <p>24h Volume: ${convertNum(data.volume24h)}</p>
        <p>Active Cryptos: {data.activeCrypto.toLocaleString()}</p>
      </div>
    </div>
  );
}
