/* server.js */
"use strict";

var http = require("http");
var server;

exports.start = function(port, callback) {
	if(!port) throw new Error("port number is required");

	server = http.createServer();

	server.on("request", function(request, response) {
		response.end("Hello World");
	});

	server.listen(port, callback);
};

exports.stop = function(callback) {
	server.close(callback);
};