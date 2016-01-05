var socket = io();

socket.on("connect", function() {
	console.log("Connected to socket.io server.");
});

/* This custom event "message" is what we specified in server.js */
socket.on("message", function (message) {
	console.log(message.text);
	jQuery(".messages").append('<p>' + message.text + '</p>'); /* "." for classes when using jQuery. Append adds to a tag. */
});

/* Handles submitting new messages */

var $form = jQuery('#message-form'); /* we use jQuery to get everything in form tags with the id = "message-form" # for format*/
/* user submits the message */
$form.on("submit", function (event) {
	/* preventDefault is used on a form when you do not want to submit it the default way (refreshing) */
	event.preventDefault();

	var $message = $form.find("input[name=message]"); /* We search the form tag with id = "message-form" for input with name = message */

	socket.emit("message", {
		text: $message.val() /* .val() changes $message into a string */ 
	});

	/* we set the $message to an empty string */ 
	$message.val("");
});