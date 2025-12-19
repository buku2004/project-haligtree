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

export default function MarketDominance() {
  const [data, setData] = useState<DominanceData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/market-dominance`)
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="animate-pulse bg-gray-200 h-24 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading data...</p>
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
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            Ethereum
          </span>
          <p className="text-xl font-bold text-[#333]">{data.eth.toFixed(1)}%</p>
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
