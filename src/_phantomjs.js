// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
/*global phantom, wwp, $ */

(function() {
	"use strict";

	var page = require("webpage").create();

	console.log("Hello world");

	page.open("http://localhost:5000", function(success) {
		page.evaluate(inBrowser);

		phantom.exit(0);
	});

	function inBrowser() {
		var drawingArea = new wwp.HtmlElement($("#drawingArea"));
		drawingArea.mouseDown(10, 20);
		drawingArea.mouseMove(50, 60);
		drawingArea.mouseUp(50, 60);
	}

}());