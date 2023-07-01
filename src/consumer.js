// instalar el socketio cliente, ya que con el consumer va a aguardar la informacion, libreria socket io y ve el ejemplo de como envia la data
const io = require("socket.io-client");

const socket = io("http://localhost:3000");
// CommonJS require
const fs = require('fs');

function readConfigFile(fileName) {
    const data = fs.readFileSync(fileName, 'utf8').toString().split("\n");
    return data.reduce((config, line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            config[key] = value;
        }
        return config;
    }, {})
}
const Kafka = require("node-rdkafka");
const config = readConfigFile("api-key.txt");
config["group.id"] = "node-group";

const consumer = new Kafka.KafkaConsumer(config, {"auto.offset.reset": "earliest" });
consumer.connect();
consumer.on("ready", () => {
    console.log('ready');
    consumer.subscribe(["my_topic"]);
    consumer.consume();
}).on("data", (message) => {
    console.log("Consumed message", message.value.toString());
    socket.emit("data", message.value.toString());
});