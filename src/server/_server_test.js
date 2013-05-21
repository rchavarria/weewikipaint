// test for server.js
/*global fail*/

(function() {
	"use strict";

	var server = require("./server.js");
	var http = require("http");
	var fs = require("fs");
	var assert = require("assert");
	
	var TEST_FILE = "generated/test.html";

	exports.tearDown = function(done) {
		if(fs.existsSync(TEST_FILE)){
			fs.unlinkSync(TEST_FILE);
			assert.ok(!fs.existsSync(TEST_FILE));
		}
		done();
	};

	exports.test_serverRequiresFileToServe = function(test) {
		test.throws(function() {
			server.start();
		});
		test.done();
	};

	exports.test_serverRequiresPortNumber = function(test) {
		test.throws(function() {
			server.start(TEST_FILE);
		});
		test.done();
	};

	exports.test_serverRunsCallbackWhenStopCompletes = function(test) {
		server.start(TEST_FILE, 8080);
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

	exports.test_serverServesHomePageFromFile = function(test) {
		var fileData = "This is served from a file";
		fs.writeFileSync(TEST_FILE, fileData);

		httpGet("http://localhost:8080", function(response, responseText) {
			test.equals(response.statusCode, 200, "status code");
			test.equals(responseText, fileData, "response text");
			test.done();
		});
	};

	exports.test_serverServesHomePageToIndex = function(test) {
		var fileData = "This is served from a file";
		fs.writeFileSync(TEST_FILE, fileData);

		httpGet("http://localhost:8080/index.html", function(response, responseText) {
			test.equals(response.statusCode, 200, "status code");
			test.done();
		});
	};

	exports.test_serverResponds404ToEverythingButHomePage = function(test) {
		httpGet("http://localhost:8080/bargle", function(response, responseText) {
			test.equals(response.statusCode, 404, "status code");
			test.done();
		});
	};

	function httpGet(url, callback) {
		server.start(TEST_FILE, 8080);

		var request = http.get(url);
		request.on("response", function(response) {
			var responseText = "";
			response.setEncoding("utf8");

			response.on("data", function(chunk) {
				responseText += chunk;
			});
			
			response.on("end", function() {
				server.stop(function() {
					callback(response, responseText);
				});
			});
		});
	}
})();
