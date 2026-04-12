"use client";
import React, { useEffect, useState } from "react";
import type { Currency } from "./DashboardShell";

interface CryptoData {
  symbol: string;
  price: number;
  inrPrice?: number;
  price_inr?: number;
  priceInr?: number;
  timestamp: string;
  volume?: number;
  priceChangePercent?: number;
}

const CryptoNames: { [key: string]: string } = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  SOLUSDT: "Solana",
  DOGEUSDT: "Dogecoin",
  XRPUSDT: "XRP",
  BNBUSDT: "Binance",
  SUIUSDT: "Sui",
  USDCUSDT: "USDC",
  LINKUSDT: "Link",
  TRUMPUSDT: "Trump",
  TRXUSDT: "Tron",
  LTCUSDT: "Litecoin"
};

interface CryptoDashboardProps {
  currency: Currency;
}

const CryptoDashboard = ({ currency }: CryptoDashboardProps) => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [status, setStatus] = useState<string>("Connecting...");
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(true);

  const getInrPrice = (crypto: CryptoData): number | null => {
    if (typeof crypto.inrPrice === "number") return crypto.inrPrice;
    if (typeof crypto.price_inr === "number") return crypto.price_inr;
    if (typeof crypto.priceInr === "number") return crypto.priceInr;
    return null;
  };

  const formatPrice = (crypto: CryptoData): string => {
    if (currency === "INR") {
      const inrPrice = getInrPrice(crypto);
      if (typeof inrPrice === "number") {
        return `₹${inrPrice.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      }
    }

    return `$${crypto.price.toFixed(4)}`;
  };

  useEffect(() => {
    let ws: WebSocket | null = null;
    const connectWebSocket = () => {
      try {
        if (ws) ws.close();
        ws = new WebSocket("ws://localhost:5000");
        setStatus("Connecting...");
        setError(null);

        ws.onopen = () => {
          setStatus("Connected");
        };

        ws.onmessage = (event) => {
          try {
            const data: CryptoData[] = JSON.parse(event.data);
            setCryptoData(data);
          } catch (err) {
            console.error("Error parsing WebSocket data:", err);
          }
        };

        ws.onerror = () => {
          setError("Connection error");
          setStatus("Error");
        };

        ws.onclose = () => {
          setStatus("Reconnecting...");
          setTimeout(connectWebSocket, 3000);
        };
      } catch {
        setError("Failed to connect");
        setStatus("Error");
        setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();
    return () => {
      if (ws) ws.close();
    };
  }, []);

  const handleClick = () => {
    setAnimate(false);
    setTimeout(() => {
      setAnimate(true);
    }, 10);
  };

  return (
    <div className="relative p-6 bg-gray-200/40 rounded-lg shadow-md cursor-default">
      <h1
        onClick={handleClick}
        className={`text-2xl text-[#333] font-bold mb-4 
        ${animate ? 'animate__animated animate__bounce' : ''}`}
      >
        Popular Coins
      </h1>

      <div className="mb-2 text-sm">Status: {status}</div>
      <div className="mb-3 text-sm font-medium text-[#444]">Currency: {currency}</div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {cryptoData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.symbol}
              className="relative z-10 p-4 rounded-lg shadow-lg bg-white/80 text-[#333]"
            >
              <div className="text-lg font-semibold">
                {CryptoNames[crypto.symbol] || crypto.symbol}
              </div>
              <div className="text-2xl font-bold mt-1">
                {formatPrice(crypto)}
              </div>
              {typeof crypto.priceChangePercent === "number" && (
                <div
                  className={`text-sm ${
                    crypto.priceChangePercent < 0
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {crypto.priceChangePercent.toFixed(2)}%
                </div>
              )}
              <div>
                Volume:{" "}
                {crypto.volume?.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="animate-pulse bg-gray-200 h-24 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Loading price data...</p>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
