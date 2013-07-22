/* global describe, it, expect, dump, wwp, jQuery, $, beforeEach, afterEach, Raphael */

(function () {
"use strict";

describe("Drawing area", function() {

	var drawingArea;
	var documentBody;
	var paper;

	beforeEach(function() {
		drawingArea = wwp.HtmlElement.fromHTML("<div style='width: 321px; height: 123px; border-width: 13px;'>hi</div>");
		documentBody = new wwp.HtmlElement($(document.body));
		documentBody.append(drawingArea);
		paper = wwp.initializeDrawingArea(drawingArea);
	});

	afterEach( function() {
		drawingArea.remove();
	});

	it("should be initialized with Raphael", function() {
		var extractedDiv = document.getElementById("wwp-drawingArea");
		expect(drawingArea.element).to.be.ok(); // it exist
		// raphael adds a svg tag to our div to start drawing
		var tagName = $(drawingArea.element).children()[0].tagName.toLowerCase();
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
			drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("does not draw a line if mouse is not down", function() {
			// ask
			//drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("stops drawing lines when mouse is up after being down", function() {
			// ask
			drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);
			drawingArea.mouseMove(40, 20);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("draws multiple segments when mouse is dragged over multiple places", function() {
			// ask
			drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseMove(40, 20);
			drawingArea.mouseUp(40, 20);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
			//expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20] ]);
		});

		it("draws multiple segments when mouse is dragged multiple times", function() {
			drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseMove(40, 20);
			drawingArea.mouseUp(40, 20);

			drawingArea.mouseMove(10, 15);

			drawingArea.mouseDown(20, 20);
			drawingArea.mouseMove(20, 40);
			drawingArea.mouseMove(1, 1);
			drawingArea.mouseUp(0, 0);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60], [50, 60, 40, 20], [20, 20, 20, 40], [20, 40, 1, 1] ]);
		});

		it("stops drawing when mouse leaves drawing area", function() {
			// ask
			drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseLeave(350, 70);
			documentBody.mouseMove(350, 70);
			drawingArea.mouseMove(70, 90);
			drawingArea.mouseUp(71, 91);

			// assert
			expect(lineSegments()).to.eql([ [20, 30, 50, 60] ]);
		});

		it("does not draw a line if drag starts outside drawing aread", function() {
			// ask
			documentBody.mouseDown(10, 124); // outside y coordinate
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);

			documentBody.mouseDown(10, -1);  // outside y coordinate
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);
			
			documentBody.mouseDown(322, 10); // outside x coordinate
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);
			
			documentBody.mouseDown(-1, 10);  // outside x coordinate
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([]);
		});

		it("draws lines if drag starts at the edges of drawing aread", function() {
			// ask
			drawingArea.mouseDown(321, 123);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);

			drawingArea.mouseDown(0, 0);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseUp(50, 60);

			// assert
			expect(lineSegments()).to.eql([ [321, 123, 50, 60], [0, 0, 50, 60] ]);
		});

		it("does not select test when drag starts within drawing area", function() {
			drawingArea.onMouseDown(function(offset, event) {
				expect(event.isDefaultPrevented()).to.be(true);
			});
			drawingArea.mouseDown(20, 30);
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
			drawingArea.touchStart(20, 30);
			drawingArea.touchMove(50, 60);
			drawingArea.touchEnd(50, 60);

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
