var kafka = require('no-kafka');
const WebSocketServer = require('ws');

let topicListen = null;
let port = null;

process.argv.forEach(function (val, index, array) {
  if ( index == 2 )
	topicListen = val;
  
  if ( index == 3 )
	port = val;
});

const wss = new WebSocketServer.Server({ port: port })

wss.on("connection", ws => {
	
	console.log("Client connected");
	
	var consumer = new kafka.SimpleConsumer({
        connectionString: 'localhost:9092', //kafka broker port
        clientId: 'no-kafka-client'
    });
	
	var dataKafka = function(message, topic){
		message.forEach(function(item){
			console.log("Topic:", topic,"|Offset:", item.offset, "|Message sent:", item.message.value.toString('utf8'));
			if( topic == topicListen ){
				ws.send(JSON.stringify(item.message.value.toString('utf8')));
			}
		})
	}
	
	consumer.init().then(function(){
		var message = consumer.subscribe(topicListen, dataKafka);
	})
	
	ws.on("close", () => {
        console.log("Client disconnected");
    });
	
	ws.onerror = function () {
        console.log("Something went wrong");
    }
});
console.log("The WebSocket server is running on port", port);
console.log("Listen the kafka broker on topic:", topicListen);