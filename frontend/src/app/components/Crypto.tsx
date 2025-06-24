"use client";
import React, { useEffect, useState } from "react";
import "animate.css";

interface CryptoData {
  symbol: string;
  price: number;
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

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [status, setStatus] = useState<string>("Connecting...");
  const [error, setError] = useState<string | null>(null);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    let ws: WebSocket | null = null;

    const connectWebSocket = () => {
      try {
        if (ws) ws.close();

        ws = new WebSocket("ws://localhost:5000");
        setStatus("Connecting...");
        setError(null);

        ws.onopen = () => {
          console.log("✅ WebSocket connected");
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

        ws.onerror = (event) => {
          console.error("WebSocket error:", event);
          setError("Connection error");
          setStatus("Error");
        };

        ws.onclose = () => {
          console.log("🔄 WebSocket closed. Reconnecting in 3 seconds...");
          setStatus("Reconnecting...");
          setTimeout(connectWebSocket, 3000);
        };
      } catch (err) {
        console.error("Failed to connect:", err);
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
    <div className="p-6 bg-gray-100 rounded-lg shadow-md max-w-[85%] cursor-default ml-auto">
      <h1 
      onClick={handleClick}
      className={`text-2xl font-bold mb-4 
        ${animate ? 'animate__animated animate__bounce' : ''}`}
      >
        Popular Coins
      </h1>

      <div className="mb-2 text-sm text-gray-500">Status: {status}</div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {cryptoData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cryptoData.map((crypto) => (
            <div
              key={crypto.symbol}
              className="bg-white p-4 rounded-lg shadow"
            >
              <div className="text-lg font-semibold">
                {CryptoNames[crypto.symbol] || crypto.symbol}
              </div>
              <div className="text-2xl font-bold mt-1 text-blue-600">
                ${crypto.price.toFixed(4)}
              </div>
              {typeof crypto.priceChangePercent === 'number' && (
                <div className={`text-sm ${crypto.priceChangePercent < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Trend 24h: {crypto.priceChangePercent.toFixed(2)}%
                </div>
               )}

              <div>
                  Volume: {crypto.volume?.toLocaleString(undefined, {
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
