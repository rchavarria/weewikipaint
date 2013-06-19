/* global describe, it, expect, wwp, $, afterEach, Raphael */

(function () {
"use strict";

describe("Drawing area", function() {

	var drawingArea;

	afterEach( function() {
		drawingArea.remove();
	});

	it("should be initialized with Raphael", function() {
		// predefined div
		drawingArea = $("<div></div>");
		$(document.body).append(drawingArea);

		// initialice
		wwp.initializeDrawingArea(drawingArea[0]);

		// verify
		var extractedDiv = document.getElementById("wwp-drawingArea");
		expect(drawingArea).to.be.ok(); // it exist
		// raphael adds a svg tag to our div to start drawing
		var tagName = $(drawingArea).children()[0].tagName.toLowerCase();
		if(Raphael.type === "SVG") {
			// we're in a browser with svg support
			expect(tagName).to.equal("svg");
		} else if(Raphael.type === "VML") {
			// we're in a non-svg browser, e.g.: IE 8.0
			expect(tagName).to.equal("div"); // a 'div' inside our div
		} else {
			throw new Error("Raphael doesn't support this browser");
		}
	});

	it("should have same dimensions as its enclosing div", function() {
		drawingArea = $("<div style='height: 123px; width: 321px'>hi</div>");
		$(document.body).append(drawingArea);

		// initialice
		var paper = wwp.initializeDrawingArea(drawingArea[0]);

		// verify
		expect(paper.height).to.be(123);
		expect(paper.width).to.be(321);
	});

	it("should draw a line", function() {
		drawingArea = $("<div style='height: 123px; width: 321px'>hi</div>");
		$(document.body).append(drawingArea);
		var paper = wwp.initializeDrawingArea(drawingArea[0]);

		wwp.drawLine(20, 30, 30, 200);

		var totalElements = 0;
		paper.forEach(function(element) {
			totalElements++;
		});
		expect(totalElements).to.equal(1);
	});
});

}());