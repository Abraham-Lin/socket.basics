var PORT = process.env.PORT || 3000;
var moment = require("moment");
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
/* io variable is similar to app variable. ie: app.get, app.post, app.delete etc */
/* includes our public folder in this server.js file */
app.use(express.static(__dirname + '/public'));
var clientInfo = {}; 

function sendCurrentUsers(socket) {
	var userData = clientInfo[socket.id]
	var matchedUsers = [];
	if (typeof userData === 'undefined') {
		return;
	}

	var keyArray = Object.keys(clientInfo);
	var iter;
	for (var i = 0; i < keyArray.length; i++) {
		iter = clientInfo[keyArray[i]];
		if (userData.room === iter.room && userData.name !== iter.name) {
			matchedUsers.push(iter.name);
		}
	}

	socket.emit("message", {
		name: "System",
		text: "Current Users: " + matchedUsers.join(', '),
		timestamp: moment.valueOf()
	})
};
/* io.on allows us to listen for event. This particular event checks forw hen a user has been connected. */
io.on("connection", function (socket) {
	console.log("User connected via socket.io");

	socket.on("disconnect", function() {
		if (typeof clientInfo[socket.id] !== 'undefined') {
			socket.leave(clientInfo[socket.id].room);
			io.to(clientInfo[socket.id].room).emit("message", {
				name: "System",
				text: clientInfo[socket.id].name + " has left the room.",
				timestamp: moment().valueOf()
			});
			delete(clientInfo[socket.id]);
		}
	});

	/* Request is the object we just created in app.js with the name and room attribute */
	socket.on("joinRoom", function(request) {
		clientInfo[socket.id] = request
		socket.join(request.room);
		socket.broadcast.to(request.room).emit('message', {
			name: "System",
			text: request.name + " has joined the room.",
			timestamp: moment().valueOf()
		});
	});

	socket.on("message", function (message) {
		if (message.text === "@currentUsers") {
			sendCurrentUsers(socket);
		} else {
			message.timestamp = moment().valueOf();
			io.to(clientInfo[socket.id].room).emit('message', message); 
		}

		console.log("Message receieved: " + message.text);
	});

	socket.emit('message', {
		name: "System",
		text: "Welcome to the chat application!",
		timestamp: moment().valueOf()
	});
});

http.listen(PORT, function () {
	console.log("Server has started!");
});