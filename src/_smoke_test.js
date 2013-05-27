/*jshint regexp:false*/
(function () {
	"use strict";

	var child_process = require("child_process");
	var http = require("http");
	var fs = require("fs");
	var child;

	exports.setUp = function(done) {
		runServer(done);
	};

	exports.tearDown = function(done) {
		child.on("exit", function() {
			done();
		});
		child.kill();
	};

	exports.test_canGetHomePage = function(test) {
		httpGet("http://localhost:8080", function(response, responseText) {
			var homePageFound = responseText.indexOf("WeeWikiPaint home page") !== -1;
			test.ok(homePageFound, "home page should contain WeeWikiPaint marker");
			test.done();
		});
	};

	exports.test_canGet404Page = function(test) {
		httpGet("http://localhost:8080/noneexistant.html", function(response, responseText) {
			var errorPage404Found= responseText.indexOf("WeeWikiPaint 404 page") !== -1;
			test.ok(errorPage404Found, "home page should contain 404 marker");
			test.done();
		});
	};

	var runServer = function(callback) {
		var commandLine = parseProcFile();

		child = child_process.spawn(commandLine.command, commandLine.options);
		child.stdout.setEncoding("utf8");

		child.stdout.on("data", function(chunk) {
			if(chunk.trim() === "Server started") callback();
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

	function parseProcFile() {
		var procfile = require("procfile");
		var file = fs.readFileSync("Procfile", "utf8");
		var parsed = procfile.parse(file);

		var web = parsed.web;
		web.options = web.options.map( function(element) {
			if(element === "$PORT") return "8080";
			else return element;
		});

		return parsed.web;
	}

})();