"use client";
import { useEffect, useState } from "react";
import { SiBitcoin, SiEthereum, SiTether } from "react-icons/si";

const convertNum = (num: number): string => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + "T";
  }else if(num >= 1_000_000_000){
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
}

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
    fetch("/api/market-dominance")
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="p-4 rounded-xl bg-gray-200/40 shadow-md">
      <h2 className="text-xl font-bold mb-2">Market Dominance</h2>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <SiBitcoin color="orange" size={20} />
          <p>BitCoin: {data.btc.toFixed(2)}%</p>
        </div>
        <div className="flex items-center gap-2">
          <SiEthereum color="blue" size={20} />
          <p>Ethereum: {data.eth.toFixed(2)}%</p>
        </div>
        <div className="flex items-center gap-2">
          <SiTether color="green" size={20} />
          <p>Tether USDT: {data.usdt.toFixed(2)}%</p>
        </div>
        <p>Other crypto: {data.others.toFixed(2)}%</p>
      </div>

      <div className="mt-3 text-sm text-gray-400 space-y-1">
        <p>Total Market Cap: ${convertNum(data.totalMarketCap)}</p>
        <p>24h Volume: ${convertNum(data.volume24h)}</p>
        <p>Active Cryptos: {data.activeCrypto.toLocaleString()}</p>
      </div>
    </div>
  );
}
