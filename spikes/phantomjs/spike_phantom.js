/* global phantom, wwp, $ */
(function() {
	"use strict";

	var page = require("webpage").create();

	console.log("Hello world");

	page.onConsoleMessage = function(message) {
		console.log("CONSOLE: " + message);
	};

	page.open("http://localhost:5000", function(success) {
		console.log("Success: " + success);

		page.evaluate(inBrowser);

		page.render("wwp.png");
		phantom.exit(0);
	});

	function inBrowser() {
		console.log("Hi");
		console.log("defined? " + isDefined(wwp.HtmlElement));

		var drawingArea = new wwp.HtmlElement($("#drawingArea"));
		drawingArea.mouseDown(10, 20);
		drawingArea.mouseMove(50, 60);
		drawingArea.mouseUp(50, 60);

		function isDefined(obj) {
			return typeof(obj) !== "undefined";
		}
	}

}());