import express from "express";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const PORT = 5000;

app.use(cors());

const wsServer = new WebSocketServer({ server });
const activeConnections = new Set();

const latestCryptoData = {};
const miniTickerData = {};

const coins = [
  "btcusdt", "ethusdt", "solusdt", "xrpusdt", "dogeusdt", "bnbusdt",
  "suiusdt", "usdcusdt", "linkusdt", "trumpusdt", "trxusdt", "ltcusdt"
];

// Open WebSocket connection for Binance streams
const tradeStreams = coins.map((coin) => `${coin}@trade`);
const miniTickerStreams = coins.map((coin) => `${coin}@miniTicker`);
const allStreams = [...tradeStreams, ...miniTickerStreams];

const binanceSocket = new WebSocket(
  `wss://stream.binance.com:443/stream?streams=${allStreams.join("/")}`
);

binanceSocket.on("message", (data) => {
  const message = JSON.parse(data);
  const streamData = message.data;
  const streamName = message.stream;

  if (streamName.includes("@trade")) {
    const symbol = streamData.s.toLowerCase();
    const price = parseFloat(streamData.p).toFixed(4);

    latestCryptoData[symbol] = {
      symbol: symbol.toUpperCase(),
      price: parseFloat(price),
      timestamp: new Date().toISOString(),
      ...(latestCryptoData[symbol] || {}),
    };
  } else if (streamName.includes("@miniTicker")) {
    const symbol = streamData.s.toLowerCase();
    // calculate % price change
    const open = parseFloat(streamData.o);
    const close = parseFloat(streamData.c);
    const priceChangePercent = ((close - open) / open) * 100;

    miniTickerData[symbol] = {
      symbol: streamData.s,
      close: close,
      volume: parseFloat(streamData.v),
      quoteVolume: parseFloat(streamData.q),
      priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
      timestamp: new Date().toISOString(),
    };

    latestCryptoData[symbol] = {
      ...(latestCryptoData[symbol] || {}),
      symbol: streamData.s,
      price: close,
      volume: miniTickerData[symbol].volume,
      quoteVolume: miniTickerData[symbol].quoteVolume,
      priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
  }

  const dataArray = Object.values(latestCryptoData);

  activeConnections.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(dataArray));
    }
  });
});

// Initial data endpoint
app.get("/data", (req, res) => {
  res.json(Object.values(latestCryptoData));
});

// Handle WebSocket connections
wsServer.on("connection", (ws) => {
  console.log("New WebSocket Connection");

  activeConnections.add(ws);

  if (Object.keys(latestCryptoData).length > 0) {
    ws.send(JSON.stringify(Object.values(latestCryptoData)));
  }

  ws.on("close", () => {
    console.log("Client disconnected");
    activeConnections.delete(ws);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
