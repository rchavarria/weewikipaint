/* global describe, it, expect, dump, wwp, jQuery, $, beforeEach, afterEach, Raphael */

(function () {
"use strict";

describe("Drawing area", function() {

	var drawingArea;
	var domElement;
	var documentBody;
	var paper;

	beforeEach(function() {
		drawingArea = $("<div style='width: 321px; height: 123px; border-width: 13px;'>hi</div>");
		domElement = new wwp.DomElement(drawingArea);
		documentBody = new wwp.DomElement($(document.body));
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
			domElement.mouseDown(20, 30);
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("does not draw a line if mouse is not down", function() {
			// ask
			//domElement.mouseDown(20, 30);
			domElement.mouseMove(20, 30);
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("stops drawing lines when mouse is up after being down", function() {
			// ask
			domElement.mouseDown(20, 30);
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);
			domElement.mouseMove(40, 20);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("draws multiple segments when mouse is dragged over multiple places", function() {
			// ask
			domElement.mouseDown(20, 30);
			domElement.mouseMove(50, 60);
			domElement.mouseMove(40, 20);
			domElement.mouseUp(40, 20);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("draws multiple segments when mouse is dragged multiple times", function() {
			domElement.mouseDown(20, 30);
			domElement.mouseMove(50, 60);
			domElement.mouseMove(40, 20);
			domElement.mouseUp(40, 20);

			domElement.mouseMove(10, 15);

			domElement.mouseDown(20, 20);
			domElement.mouseMove(20, 40);
			domElement.mouseMove(1, 1);
			domElement.mouseUp(0, 0);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20], [20, 20, 20, 40], [20, 40, 1, 1] ]);
		});

		it("stops drawing when mouse leaves drawing area", function() {
			// ask
			domElement.mouseDown(20, 30);
			domElement.mouseMove(50, 60);
			domElement.mouseLeave(350, 70);
			documentBody.mouseMove(350, 70);
			domElement.mouseMove(70, 90);
			domElement.mouseUp(71, 91);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
		});

		it("does not draw a line if drag starts outside drawing aread", function() {
			// ask
			documentBody.mouseDown(10, 124); // outside y coordinate
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);

			documentBody.mouseDown(10, -1);  // outside y coordinate
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);
			
			documentBody.mouseDown(322, 10); // outside x coordinate
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);
			
			documentBody.mouseDown(-1, 10);  // outside x coordinate
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([]);
		});

		it("draws lines if drag starts at the edges of drawing aread", function() {
			// ask
			domElement.mouseDown(321, 123);
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);

			domElement.mouseDown(0, 0);
			domElement.mouseMove(50, 60);
			domElement.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [321, 123, 50, 60], [0, 0, 50, 60] ]);
		});

		it("does not select test when drag starts within drawing area", function() {
			drawingArea.mousedown(function(event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			domElement.mouseDown(20, 30);
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
