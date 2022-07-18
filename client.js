const WebSocket = require('ws');

let port = null;

process.argv.forEach(function (val, index, array) { 
  if ( index == 2 )
	port = val;
});

let webSocketString = 'ws://localhost:' + port;

var connection = new WebSocket(webSocketString);

connection.addEventListener("open", () => {
	console.log("I am connected");
	connection.send("Message from client after connection");
});

connection.addEventListener("message", (event) => {
	console.log("Message from server:", event.data);
});

connection.onerror = function(){
	console.log("Something went wrong");
}