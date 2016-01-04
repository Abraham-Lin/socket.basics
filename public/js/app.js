var socket = io();

socket.on("connect", function() {
	console.log("Connected to socket.io server.");
});

/* This custom event "message" is what we specified in server.js */
socket.on("message", function (message) {
	console.log(message.text);
});

/* Handles submitting new messages */
var $form = jQuery('#message-form'); /* we use jQuery to get everything with the form "message-form" */
/* user submits the message */
$form.on("submit", function (event) {
	/* preventDefault is used on a form when you do not want to submit it the default way (refreshing) */
	event.preventDefault();

	var $message = $form.find("input[name=message]"); /* will search all input tags with name = message */
	});

	socket.emit("message", {
		text: $message.val() /* .val() changes $message into a string */ 

	/* we set the $message to an empty string */
	$message.val("");
});