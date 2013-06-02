/*jshint regexp:false*/
(function () {
	"use strict";

	var child_process = require("child_process");
	var http = require("http");
	var fs = require("fs");
	var child;

	exports.test_isOnWeb = function(test) {
		httpGet("http://rct-weewikipaint.herokuapp.com", function(response, responseText) {
			var homePageFound = responseText.indexOf("WeeWikiPaint home page") !== -1;
			test.ok(homePageFound, "home page should contain WeeWikiPaint marker");
			test.done();
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