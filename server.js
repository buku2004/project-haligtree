const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const PORT = 5000;

app.use(cors());

const wsServer = new WebSocket.Server({ server });
const activeConnections = new Set();

const latestCryptoData = {}; // crypto data go here

const coins = ["btcusdt", "ethusdt", "solusdt", "xrpusdt", "dogeusdt"];

// Open WebSocket connection for Binance streams
const binanceSocket = new WebSocket(
    `wss://stream.binance.com:9443/ws/${coins.map(coin => `${coin}@trade`).join("/")}`
);

binanceSocket.on("message", (data) => {
    const trade = JSON.parse(data);
    const symbol = trade.s.toLowerCase();
    const price = parseFloat(trade.p).toFixed(4);

    latestCryptoData[symbol] = {
        symbol: symbol.toUpperCase(),
        price: parseFloat(price),
        timestamp: new Date().toISOString(),
    };

    // Send updated data to all clients
    const dataArray = Object.values(latestCryptoData); // Convert to array
    activeConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(dataArray));
        }
    });

    console.log("Updated Crypto Prices:", dataArray);
});

// API endpoint for initial data
app.get("/data", (req, res) => {
    res.json(Object.values(latestCryptoData)); // Send array of prices
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
