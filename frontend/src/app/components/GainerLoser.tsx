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
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
        );
        if (!res.ok) throw new Error("Failed to fetch coins");
        const data = await res.json();
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
  }, []);

  if (loading) return <div>Loading top movers...</div>;
  if (!coins.length) return <div>No data available</div>;

  const gainers = [...coins]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);
  const losers = [...coins]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Gainers */}
      <div className="p-4 rounded-xl bg-green-900/20 border shadow-md">
        <h2 className="text-lg font-bold text-green-400 mb-3">Top Gainers (24h)</h2>
        {gainers.map((coin) => (
          <div
            key={coin.id}
            className="flex justify-between items-center py-2 border-b border-white/50 last:border-none"
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
      <div className="p-4 rounded-xl bg-red-900/20 border shadow-md">
        <h2 className="text-lg font-bold text-red-400 mb-3">Top Losers (24h)</h2>
        {losers.map((coin) => (
          <div
            key={coin.id}
            className="flex justify-between items-center py-2 border-b border-white/50 last:border-none"
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
