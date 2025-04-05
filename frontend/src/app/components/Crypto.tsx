"use client";
import React, { useEffect, useState } from "react";

interface CryptoData {
  symbol: string;
  price: number;
  timestamp: string;
}

const CryptoDashboard = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [status, setStatus] = useState<string>("Connecting...");
  const [error, setError] = useState<string | null>(null);

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
            
            if (Array.isArray(data) && data.length > 0) {
              setCryptoData(data);
            }
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

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-[20rem]">
      <h1 className="text-2xl font-bold mb-4">Live Crypto Prices</h1>
      
      <div className="mb-2 text-sm text-gray-500">Status: {status}</div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded ">{error}</div>
      )}
      
      {cryptoData.length > 0 ? (
        <div className="flex flex-col gap-2">
          {cryptoData.map((crypto) => (
            <div key={crypto.symbol} className="bg-white p-4 rounded-lg shadow">
              <div className="text-lg font-semibold">{crypto.symbol}</div>
              <div className="text-3xl font-bold mt-2">${crypto.price.toFixed(4)}</div>
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
