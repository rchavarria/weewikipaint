// test for server.js
/*global fail*/

(function() {
	"use strict";

	var server = require("./server.js");
	var http = require("http");

	exports.test_respondsToRequests = function(test) {
		server.start(8080);

		httpGet("http://localhost:8080", function(response, responseText) {
			test.equals(response.statusCode, 200, "status code");
			test.equals(responseText, "Hello World", "response text");
			server.stop(function() {
				test.done();
			});
		});
	};

	function httpGet(url, callback) {
		var request = http.get(url);
		request.on("response", function(response) {
			var responseText = "";
			response.setEncoding("utf8");

			response.on("data", function(chunk) {
				responseText += chunk;
			});
			
			response.on("end", function() {
				callback(response, responseText);
			});
		});
	}

	exports.test_serverRequiresPortNumber = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
		server.start(8080);
		server.stop(function() {
			test.done();
		});
	};

	exports.test_callingServerStopsWhenNotRunningThrowsException = function(test) {
		test.throws(function() {
			server.stop();
		});
		test.done();
	};

})();