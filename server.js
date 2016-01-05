var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/* io variable is similar to app variable. ie: app.get, app.post, app.delete etc */
/* includes our public folder in this server.js file */
app.use(express.static(__dirname + '/public'));

/* io.on allows us to listen for event. This particular event checks forw hen a user has been connected. */
io.on("connection", function (socket) {
	console.log("User connected via socket.io");

	socket.on("message", function (message) {
		console.log("Message receieved: " + message.text);
		io.emit('message', message); 
	});

	socket.emit("message", {
		text: "Welcome to the chat application"
	});
});

http.listen(PORT, function () {
	console.log("Server has started!");
});