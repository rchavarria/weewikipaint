/* server.js */
"use strict";

var http = require("http");
var server;

exports.start = function(port, callback) {
	server = http.createServer();

	server.on("request", function(request, response) {
		response.end("Hello World");
	});

	server.listen(port, callback);
};

exports.stop = function(callback) {
	server.close(callback);
};