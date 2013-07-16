/* global describe, it, expect, dump, wwp, jQuery, $, beforeEach, afterEach, Raphael */

(function () {
"use strict";

describe("Drawing area", function() {

	var drawingArea;
	var domElement;
	var paper;

	beforeEach(function() {
		drawingArea = $("<div style='width: 321px; height: 123px; border-width: 13px;'>hi</div>");
		domElement = new wwp.DomElement(drawingArea);
		$(document.body).append(drawingArea);
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

	describe("line drawing", function() {

		it("draws a line caused by a dragged mouse", function() {
			// ask
			mouseDown(20, 30);
			mouseMove(50, 60);
			mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("does not draw a line if mouse is not down", function() {
			// ask
			//mouseDown(20, 30);
			mouseMove(20, 30);
			mouseMove(50, 60);
			mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("stops drawing lines when mouse is up after being down", function() {
			// ask
			mouseDown(20, 30);
			mouseMove(50, 60);
			mouseUp(50, 60);
			mouseMove(40, 20);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("draws multiple segments when mouse is dragged over multiple places", function() {
			// ask
			mouseDown(20, 30);
			mouseMove(50, 60);
			mouseMove(40, 20);
			mouseUp(40, 20);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("draws multiple segments when mouse is dragged multiple times", function() {
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
			expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20], [20, 20, 20, 40], [20, 40, 1, 1] ]);
		});

		it("stops drawing when mouse leaves drawing area", function() {
			// ask
			mouseDown(20, 30);
			mouseMove(50, 60);
			mouseLeave(350, 70);
			mouseMove(350, 70, $(document)); // we're moving over document instead of drawing area
			mouseMove(70, 90);
			mouseUp(71, 91);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
		});

		it("does not draw a line if drag starts outside drawing aread", function() {
			// ask
			mouseDown(10, 124, $(document)); // outside y coordinate
			mouseMove(50, 60);
			mouseUp(50, 60);

			mouseDown(10, -1, $(document));  // outside y coordinate
			mouseMove(50, 60);
			mouseUp(50, 60);
			
			mouseDown(322, 10, $(document)); // outside x coordinate
			mouseMove(50, 60);
			mouseUp(50, 60);
			
			mouseDown(-1, 10, $(document));  // outside x coordinate
			mouseMove(50, 60);
			mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([]);
		});

		it("draws lines if drag starts at the edges of drawing aread", function() {
			// ask
			mouseDown(321, 123);
			mouseMove(50, 60);
			mouseUp(50, 60);

			mouseDown(0, 0);
			mouseMove(50, 60);
			mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [321, 123, 50, 60], [0, 0, 50, 60] ]);
		});

		it("does not select test when drag starts within drawing area", function() {
			drawingArea.mousedown(function(event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			mouseDown(20, 30);
		});

	});

	describe("touch events", function() {
		// available touch events:
		// - touchstart
		// - touchmove
		// - touchend
		// - ¿?

		it("draws a line caused by a drag by touching", function() {
			// skip if browser does not support touch events
			if(!browserSupportsTouchEvents()) return;

			// ask
			touchStart(20, 30);
			touchMove(50, 60);
			touchEnd(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
		});

	});

	function lineSegments() {
		var result = [];
		paper.forEach(function(element) {
			var path = pathFor(element);
			result.push(path);
		});
		return result;
	}

	function mouseClick(relativeX, relativeY, optionalElement) {
		mouseEvent("click", relativeX, relativeY, optionalElement);
	}

	function mouseDown(relativeX, relativeY, optionalElement) {
		mouseEvent("mousedown", relativeX, relativeY, optionalElement);
	}

	function mouseMove(relativeX, relativeY, optionalElement) {
		mouseEvent("mousemove", relativeX, relativeY, optionalElement);
	}

	function mouseLeave(relativeX, relativeY, optionalElement) {
		mouseEvent("mouseleave", relativeX, relativeY, optionalElement);
	}

	function mouseUp(relativeX, relativeY, optionalElement) {
		mouseEvent("mouseup", relativeX, relativeY, optionalElement);
	}

	function mouseEvent(event, relativeX, relativeY, optionalElement) {
		var $element = optionalElement || drawingArea;
		var offset = domElement.pageOffset(relativeX, relativeY);

		var eventData = new jQuery.Event();
		eventData.pageX = offset.x;
		eventData.pageY = offset.y;
		eventData.type = event;

		$element.trigger(eventData);
	}

	function browserSupportsTouchEvents() {
		return (typeof Touch !== "undefined");
	}

	function touchStart(relativeX, relativeY, optionalElement) {
		sendTouchEvent("touchstart", relativeX, relativeY, optionalElement);
	}

	function touchMove(relativeX, relativeY, optionalElement) {
		sendTouchEvent("touchmove", relativeX, relativeY, optionalElement);
	}

	function touchEnd(relativeX, relativeY, optionalElement) {
		sendTouchEvent("touchend", relativeX, relativeY, optionalElement);
	}

	function sendTouchEvent(event, relativeX, relativeY, optionalElement) {
		var $element = optionalElement || drawingArea;

		var touchEvent = document.createEvent("TouchEvent");
		touchEvent.initTouchEvent(event, true, true);

		var offset = domElement.pageOffset(relativeX, relativeY);
		var eventData = new jQuery.Event();
		eventData.pageX = offset.x;
		eventData.pageY = offset.y;
		eventData.type = event;
		eventData.originalEvent = touchEvent;

		$element.trigger(eventData);
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
