/* global describe, it, expect, wwp, jQuery, $, beforeEach, afterEach, Raphael */

(function () {
"use strict";

describe("Drawing area", function() {

	var drawingArea;
	var paper;

	beforeEach( function() {
		drawingArea = $("<div style='height: 123px; width: 321px'>hi</div>");
		$(document.body).append(drawingArea);
		// initialice
		paper = wwp.initializeDrawingArea(drawingArea[0]);
	});

	afterEach( function() {
		drawingArea.remove();
	});

	it("should be initialized with Raphael", function() {
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
		expect(paper.height).to.be(123);
		expect(paper.width).to.be(321);
	});

	it("should draw a line", function() {
		wwp.drawLine(20, 30, 30, 200);
		var elements = extractElements(paper);
		expect(elements.length).to.equal(1);
		var path = pathFor(elements[0]);
		expect(path).to.equal("M20,30L30,200");
	});

	it("responds to click events", function() {
		// arrange
		var eventData = new jQuery.Event();
		eventData.pageX = 20;
		eventData.pageY = 30;
		eventData.type = "click";

		// ask
		drawingArea.trigger(eventData);

		// assert
		var elements = extractElements(paper);
		expect(elements.length).to.equal(1);

		var drawingAreaPosition = drawingArea.offset();
		var expectedX = eventData.pageX - drawingAreaPosition.left;
		var expectedY = eventData.pageY - drawingAreaPosition.top;
		var path = pathFor(elements[0]);
		expect(path).to.equal("M0,0L" + expectedX + "," + expectedY);
	});

	function extractElements(paper) {
		var paperElements = [];
		paper.forEach(function(element) {
			paperElements.push(element);
		});

		return paperElements;
	}

	function pathFor(element) {
		var box = element.getBBox();
		return "M" + box.x + "," + box.y + "L" + box.x2 + "," + box.y2;
	}
});

}());