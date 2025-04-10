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

const latestCryptoData = {};
const miniTickerData = {};

const coins = [
    "btcusdt", "ethusdt", "solusdt", "xrpusdt", "dogeusdt", "bnbusdt",
     "suiusdt", "usdcusdt", "linkusdt", "trumpusdt", "trxusdt", "ltcusdt"
    ];

// Open WebSocket connection for Binance streams
const tradeStreams = coins.map(coin => `${coin}@trade`);
const miniTickerStreams = coins.map(coin => `${coin}@miniTicker`);
const allStreams = [...tradeStreams, ...miniTickerStreams];

const binanceSocket = new WebSocket(
    `wss://stream.binance.com:9443/stream?streams=${allStreams.join("/")}`
);

binanceSocket.on("message", (data) => {
    const message = JSON.parse(data);
    const streamData = message.data;
    const streamName = message.stream;

    if (streamName.includes('@trade')) {
        const symbol = streamData.s.toLowerCase();
        const price = parseFloat(streamData.p).toFixed(4);

        if (!latestCryptoData[symbol]) {
            latestCryptoData[symbol] = {
                symbol: symbol.toUpperCase(),
                price: parseFloat(price),
                timestamp: new Date().toISOString(),
            };
        } else {
            latestCryptoData[symbol].price = parseFloat(price);
            latestCryptoData[symbol].timestamp = new Date().toISOString();
        }
    } 
    else if (streamName.includes('@miniTicker')) {
        const symbol = streamData.s.toLowerCase();

        // Calculate price change %
        const open = parseFloat(streamData.o);
        const close = parseFloat(streamData.c);
        const priceChangePercent = ((close - open) / open) * 100;

        miniTickerData[symbol] = {
            symbol: streamData.s,
            close: close,
            volume: parseFloat(streamData.v),
            quoteVolume: parseFloat(streamData.q),
            priceChangePercent: parseFloat(priceChangePercent.toFixed(2)),
            timestamp: new Date().toISOString()
        };

        if (latestCryptoData[symbol]) {
            latestCryptoData[symbol] = {
                ...latestCryptoData[symbol],
                volume: miniTickerData[symbol].volume,
                quoteVolume: miniTickerData[symbol].quoteVolume,
                priceChangePercent: parseFloat(priceChangePercent.toFixed(2))
            };
        }
    }

    const dataArray = Object.values(latestCryptoData);

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
