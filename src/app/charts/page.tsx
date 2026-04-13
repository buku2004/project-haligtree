import React from "react";
import CandleChart from "./Charts";

const COINS = [
  { symbol: "BTCUSDT", name: "Bitcoin" },
  { symbol: "ETHUSDT", name: "Ethereum" },
  { symbol: "SOLUSDT", name: "Solana" },
  { symbol: "DOGEUSDT", name: "Dogecoin" },
  { symbol: "XRPUSDT", name: "XRP" },
  { symbol: "BNBUSDT", name: "Binance" },
  { symbol: "SUIUSDT", name: "Sui" },
  { symbol: "USDCUSDT", name: "USDC" },
  { symbol: "LINKUSDT", name: "Link" },
  { symbol: "TRUMPUSDT", name: "Trump" },
  { symbol: "TRXUSDT", name: "Tron" },
  { symbol: "LTCUSDT", name: "Litecoin" },
];

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 md:px-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-5 text-2xl font-bold text-slate-100">Coin Candlestick Charts</h1>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {COINS.map((coin) => (
            <CandleChart
              key={coin.symbol}
              symbol={coin.symbol}
              interval="1m"
              title={coin.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;