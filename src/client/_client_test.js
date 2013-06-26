/* global describe, it, expect, dump, wwp, jQuery, $, beforeEach, afterEach, Raphael */

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
		expect(paperPaths(paper)).to.eql([ [20, 30, 30, 200] ]);
	});

	it("takes into account border", function() {
		drawingArea.remove();
		// arrange
		drawingArea = $("<div style='height: 123px; width: 321px; border-width: 13px;'>hi</div>");
		$(document.body).append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea[0]);
		
		// ask
		clickMouse(20, 30);
		clickMouse(50, 60);
		clickMouse(40, 20);

		// assert
		expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
	});

	function paperPaths(paper) {
		var elements = extractElements(paper);

		// this will return an array of arrays
		var result = elements.map( function (element) {
			return pathFor(element);
		});
		return result;
	}

	function clickMouse(relativeX, relativeY) {
		var drawingAreaPosition = drawingArea.offset();

		var eventData = new jQuery.Event();
		eventData.pageX = relativeX + drawingAreaPosition.left;
		eventData.pageY = relativeY + drawingAreaPosition.top;
		eventData.type = "click";

		drawingArea.trigger(eventData);
	}

	function extractElements(paper) {
		var paperElements = [];
		paper.forEach(function(element) {
			paperElements.push(element);
		});

		return paperElements;
	}

	function pathFor(element) {
		if(Raphael.svg) return vmlPathFor(element);
		else throw new Error("Raphael mode not implemented");
	}

	function vmlPathFor(element) {
		var path = element.node.attributes.d.value;
		var regex = /M(\d+),(\d+)L(\d+),(\d+)/;
		var groups = path.match(regex);

		return [groups[1], groups[2], groups[3], groups[4]];
		/*
		return {
			x: groups[1],
			y: groups[2],
			x2: groups[3],
			y2: groups[4]
		};
		*/
	}
});

}());