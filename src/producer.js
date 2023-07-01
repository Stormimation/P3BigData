const axios = require('axios');
const fs = require('fs');
const { setTimeout } = require('timers/promises')

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
const producer = new Kafka.Producer(readConfigFile("api-key.txt"));
producer.connect();


producer.on("ready", async () => {
    console.log('ready producer');
    while (true) {
        try {
           //Todo este codigo es para llamar a las siguientes 2 apis
            let options = {
                method: 'GET',
                url: 'https://randomuser.me/api/',
                
            };
            let response = await axios.request(options);
            let email =response.data.results[0].email;
           //segunda llamada a api
            options = {
            method: 'GET',
            url: 'https://league-of-legends-esports.p.rapidapi.com/teams',
            headers: {
                'X-RapidAPI-Key': '452a8d3eb5msh2990ce928f0ad63p171e17jsnac5315111544',
                'X-RapidAPI-Host': 'free-epic-games.p.rapidapi.com'
            }
            };
            response = await axios.request(options);
            let playerName = response.data.teams[0].players[0].firstName;
            //tercera llamada a api
            options = {
            method: 'GET',
            url: 'https://free-epic-games.p.rapidapi.com/free',
            headers: {
              'X-RapidAPI-Key': '452a8d3eb5msh2990ce928f0ad63p171e17jsnac5315111544',
              'X-RapidAPI-Host': 'free-epic-games.p.rapidapi.com'
            }
            };
            response = await axios.request(options);
            let title = freeGames.current.title[0];
            producer.produce("my_topic", -1, Buffer.from(email), Buffer.from("key"));
            producer.produce("my_topic", -1, Buffer.from(playername), Buffer.from("key"));
            producer.produce("my_topic", -1, Buffer.from(title), Buffer.from("key"));
        } catch (error) {

            console.error(error);
        }
        await setTimeout(5000)
    }
});