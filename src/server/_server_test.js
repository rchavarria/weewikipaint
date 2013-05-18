// test for server.js
/*globals fail*/

"use strict";

var server = require("./server.js");
var http = require("http");

exports.tearDown = function(done) {
	server.stop( done );
};

exports.testServerRespondsToGetRequests = function(test) {
	server.start();

	http.get("http://localhost:8080/", function(response) {
		console.log("response has code: " + response.statusCode);
		response.on("data", function() {});
		test.done();
	});
};