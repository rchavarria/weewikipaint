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

	it("draws a line caused by a dragged mouse", function() {
		drawingArea.remove();
		// arrange
		drawingArea = $("<div style='height: 123px; width: 321px; border-width: 13px;'>hi</div>");
		$(document.body).append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea[0]);
		
		// ask
		mouseDown(20, 30);
		mouseMove(50, 60);

		// assert
		expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60] ]);
		//expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
	});

	it("does not draw a line if mouse is not down", function() {
		drawingArea.remove();
		// arrange
		drawingArea = $("<div style='height: 123px; width: 321px; border-width: 13px;'>hi</div>");
		$(document.body).append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea[0]);
		
		// ask
		//mouseDown(20, 30);
		mouseMove(20, 30);
		mouseMove(50, 60);
		//mouseUp(50, 60);

		// assert
		expect(paperPaths(paper)).to.eql([ ]);
		//expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
	});

	it("stops drawing lines when mouse is up after being down", function() {
		drawingArea.remove();
		// arrange
		drawingArea = $("<div style='height: 123px; width: 321px; border-width: 13px;'>hi</div>");
		$(document.body).append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea[0]);
		
		// ask
		mouseDown(20, 30);
		mouseMove(50, 60);
		mouseUp(50, 60);
		mouseMove(40, 20);

		// assert
		expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60] ]);
		//expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
	});

	it("draws multiple segments when mouse is dragged over multiple places", function() {
		drawingArea.remove();
		// arrange
		drawingArea = $("<div style='height: 123px; width: 321px; border-width: 13px;'>hi</div>");
		$(document.body).append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea[0]);
		
		// ask
		mouseDown(20, 30);
		mouseMove(50, 60);
		mouseMove(40, 20);
		mouseUp(40, 20);

		// assert
		expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		//expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
	});

	it("draws multiple segments when mouse is dragged multiple times", function() {
		drawingArea.remove();
		// arrange
		drawingArea = $("<div style='height: 123px; width: 321px; border-width: 13px;'>hi</div>");
		$(document.body).append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea[0]);
		
		// ask
		mouseDown(20, 30);
		mouseMove(50, 60);
		mouseMove(40, 20);
		mouseUp(40, 20);

		mouseMove(10, 15);

		mouseDown(20, 20);
		mouseMove(20, 40);
		mouseMove(1, 1);
		mouseUp(0, 0);

		// assert
		expect(paperPaths(paper)).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20], [20, 20, 20, 40], [20, 40, 1, 1] ]);
	});

	function paperPaths(paper) {
		var result = [];
		paper.forEach(function(element) {
			var path = pathFor(element);
			result.push(path);
		});
		return result;
	}

	function mouseClick(relativeX, relativeY) {
		mouseEvent("click", relativeX, relativeY);
	}

	function mouseDown(relativeX, relativeY) {
		mouseEvent("mousedown", relativeX, relativeY);
	}

	function mouseMove(relativeX, relativeY) {
		mouseEvent("mousemove", relativeX, relativeY);
	}

	function mouseUp(relativeX, relativeY) {
		mouseEvent("mouseup", relativeX, relativeY);
	}

	function mouseEvent(event, relativeX, relativeY) {
		var drawingAreaPosition = drawingArea.offset();

		var eventData = new jQuery.Event();
		eventData.pageX = relativeX + drawingAreaPosition.left;
		eventData.pageY = relativeY + drawingAreaPosition.top;
		eventData.type = event;

		drawingArea.trigger(eventData);
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
	}
});

}());