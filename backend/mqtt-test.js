const mqtt = require("mqtt")

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("Connected to MQTT Broker!");

    client.subscribe("sensor/data", (err) => {
        if(!err){
            console.log("Subscribed to sensor/data.");

            // client.publish("sensor/data", "Hello everyone, Success!");
        }else{
            console.error("subs error", err);
        }
    });

    setInterval(() => {
        const temperature = (Math.random() * 50).toFixed(4);
        const testData = JSON.stringify({Temperature: parseFloat(temperature)});
        client.publish("sensor/data", testData);
    }, 5000);


});

client.on("message", (topic, message) => {
    console.log(`Received on ${topic}: ${message.toString()}`);
})