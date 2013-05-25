/* server.js */
(function() {
"use strict";

var http = require("http");
var fs = require("fs");
var server;

exports.start = function(homePageToServe, notFoundPageToServe, port, readyCallback) {
	if(!port) throw new Error("port number is required");

	server = http.createServer();

	server.on("request", function(request, response) {
		if(request.url === "/" || request.url === "/index.html") {
			response.statusCode = 200;
			serveFile(homePageToServe, response);
		} else {
			response.statusCode = 404;
			serveFile(notFoundPageToServe, response);
		}
	});

	server.listen(port, readyCallback);
};

var serveFile = function(file, response) {
	fs.readFile(file, function(err, data) {
		if(err) throw err;
		response.end(data);
	});
};

exports.stop = function(callback) {
	server.close(callback);
};

})();