const mqtt = require("mqtt")

const client = mqtt.connect("mqtt://localhost:1883");

client.on("connect", () => {
    console.log("Connected to MQTT Broker!");

    client.subscribe("test/topic", (err) => {
        if(!err){
            console.log("Subscribed to test/topic!");

            client.publish("test/topic", "Hello everyone, Success!")
        }else{
            console.error("subs error", err);
        }
    });
});

client.on("message", (topic, message) => {
    console.log(`Received on ${topic}: ${message.toString()}`);
})