(function () {
	"use strict";

	var child_process = require("child_process");
	var http = require("http");
	
	exports.test_for_smoke = function(test) {
		runServer("node src/server/weewikipaint 8080", function() {
			httpGet("http://localhost:8080", function() {
				test.done();
			})
		});
	};

	var runServer = function(command, callback) {
		child_process.exec(command, function(err, stdout, stderr) {
			if(err !== null) {
				console.log(stdout);
				console.log(stderr);
				throw err;
			}

			callback();
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

})();