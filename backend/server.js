const express = require("express");
const cors = require("cors");
const mqtt = require("mqtt");

const app = express();
const PORT = 5000;
app.use(cors());

let latestData = {};

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("Connected to MQTT Broker -> Mosquitto");
    client.subscribe("sensor/data", (err) => {
        if(!err){
            console.log("Subscribed to sensor/data.");
        }else{
            console/log("Subscribe error:", err);
        }
    })
});

setInterval(() => {
    const temperature = (Math.random() * 50).toFixed(4);
    const testData = JSON.stringify({Temperature: parseFloat(temperature)});
    client.publish("sensor/data", testData);
}, 5000);

client.on("message", (topic, message) => {
    latestData = JSON.parse(message.toString());
    console.log(`Received from ${topic}:`, latestData);
})

// API
app.get("/data", (req, res) => {
    res.json(latestData);
});

app.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
});