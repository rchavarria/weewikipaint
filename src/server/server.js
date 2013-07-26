/* server.js */
(function() {
"use strict";

var http = require("http");
var fs = require("fs");
var send = require("send");
var server;

exports.start = function(contentDir, notFoundPageToServe, port, readyCallback) {
	if(!port) throw new Error("port number is required");

	server = http.createServer();

	server.on("request", function(request, response) {
		send(request, request.url).
			root(contentDir).
			on("error", handleError).
			pipe(response);

		function handleError(err) {
			if(err.status === 404) serveErrorFile(response, 404, contentDir + "/" + notFoundPageToServe);
			else throw err;
		}
	});

	server.listen(port, readyCallback);
};

var serveErrorFile = function(response, statusCode, file) {
	response.statusCode = statusCode;
	fs.readFile(file, function(err, data) {
		if(err) throw err;
		response.end(data);
	});
};

exports.stop = function(callback) {
	server.close(callback);
};

})();