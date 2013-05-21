/* server.js */
"use strict";

var http = require("http");
var fs = require("fs");
var server;

exports.start = function(htmlFileToServe, port) {
	if(!port) throw new Error("port number is required");

	server = http.createServer();

	server.on("request", function(request, response) {
		if(request.url === "/" || request.url === "/index.html") {
			fs.readFile(htmlFileToServe, function(err, data) {
				if(err) throw err;
				response.end(data);
			});
		} else {
			response.statusCode = 404;
			response.end();
		}
	});

	server.listen(port);
};

exports.stop = function(callback) {
	server.close(callback);
};