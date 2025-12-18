"use client";
import React, { useEffect, useState } from "react";

interface Coin {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function TopMovers() {
  const [data, setData] = useState<Coin[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/losers-gainers")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
      });
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!data.length) return <div className="animate-pulse bg-gray-200 h-24 rounded-lg flex items-center justify-center">
    <p className="text-gray-500">Loading data...</p>
  </div>;


  const gainers = [...data]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const losers = [...data]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6 text-[#333]">
      {/* Gainers */}
      <div className="p-4 rounded-xl bg-green-900/20 border border-green-700/50 shadow-md">
        <h2 className="text-lg font-bold text-green-400 mb-3">Top Gainers (24h)</h2>
        {gainers.map((coin) => (
          <div
            key={coin.id}
            className="flex justify-between items-center py-2 border-b border-white/20 last:border-none"
          >
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
              <span>{coin.name}</span>
            </div>
            <span className="text-green-400 font-medium">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>

      {/* Losers */}
      <div className="p-4 rounded-xl bg-red-900/20 border border-red-700/50 shadow-md">
        <h2 className="text-lg font-bold text-red-400 mb-3">Top Losers (24h)</h2>
        {losers.map((coin) => (
          <div
            key={coin.id}
            className="flex justify-between items-center py-2 border-b border-white/20 last:border-none"
          >
            <div className="flex items-center gap-2">
              <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
              <span>{coin.name}</span>
            </div>
            <span className="text-red-400 font-medium">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
