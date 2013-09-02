;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global describe, it, expect, dump, wwp, jQuery, $, beforeEach, afterEach, Raphael */

(function () {
"use strict";

var client = require("./client.js");
var HtmlElement = require("./dom_element.js");

mocha.setup( {ignoreLeaks: true} );

describe("Drawing area", function() {

	var drawingArea;
	var documentBody;
	var svgCanvas;

	beforeEach(function() {
		documentBody = new HtmlElement($(document.body));
		
		drawingArea = HtmlElement.fromHTML("<div style='width: 321px; height: 123px; border-width: 13px;'>hi</div>");
		drawingArea.appendSelfToBody();
		svgCanvas = client.initializeDrawingArea(drawingArea);
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
		expect(svgCanvas.height()).to.be(123);
		expect(svgCanvas.width()).to.be(321);
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

	function browserSupportsTouchEvents() {
		return (typeof Touch !== "undefined");
	}

	function lineSegments() {
		return svgCanvas.lineSegments();
	}
});

}());

},{"./client.js":4,"./dom_element.js":5}],2:[function(require,module,exports){
/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael, wwp */

(function () {
"use strict";

var HtmlElement = require("./dom_element.js");

describe("DOM Element", function() {

	describe("event handlers", function() {
		var domElement;

		beforeEach(function() {
			domElement = HtmlElement.fromHTML("<div></div>");
		});

		it("handles mouse events", function() {
			testEvent(domElement.onMouseDown, domElement.mouseDown);
			testEvent(domElement.onMouseLeave, domElement.mouseLeave);
			testEvent(domElement.onMouseMove, domElement.mouseMove);
			testEvent(domElement.onMouseUp, domElement.mouseUp);
		});

		it("appends elements", function() {
			expect(domElement.element.children().length).to.be(0);
			domElement.append(HtmlElement.fromHTML("<div></div>"));
			expect(domElement.element.children().length).to.be(1);
		});

		it("removes elements", function() {
			var elementToAppend = HtmlElement.fromHTML("<div></div>");
			domElement.append(elementToAppend);
			expect(domElement.element.children().length).to.be(1);
			elementToAppend.remove();
			expect(domElement.element.children().length).to.be(0);
		});

		it("converts to DOM element", function() {
			var internalElement = domElement.toDomElement();
			expect(internalElement.tagName).to.equal("DIV");
		});

		it("appends to body", function() {
			var body = new HtmlElement($(document.body));
			var childrenBeforeAppend = body.element.children().length;
			domElement.appendSelfToBody();
			var childrenAfterAppend = body.element.children().length;

			expect(childrenAfterAppend).to.be(childrenBeforeAppend + 1);
		});

		function testEvent(onEvent, performEvent) {
			var eventOffset = null;
			onEvent.call(domElement, function(offset, event) {
				eventOffset = offset;
			});
			performEvent.call(domElement, 42, 13);

			expect(eventOffset).to.eql( {x: 42, y: 13} );
		}

	});

});

}());

},{"./dom_element.js":5}],3:[function(require,module,exports){
/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael, wwp */

(function () {
"use strict";

var SvgCanvas = require("./svg_canvas.js");
var HtmlElement = require("./dom_element.js");

describe("Svg Canvas", function() {

	var div;
	var svgCanvas;

	beforeEach(function() {
		div = HtmlElement.fromHTML("<div style='width: 321px; height: 123px;'></div>");
		div.appendSelfToBody();
		svgCanvas = new SvgCanvas(div);
	});

	afterEach(function() {
		div.remove();
	});

	it("returns height and width", function() {
		expect(svgCanvas.height()).to.be(123);
		expect(svgCanvas.width()).to.be(321);
	});

	it("returns zero line segments", function() {
		expect(svgCanvas.lineSegments()).to.eql( [] );
	});

	it("draws and returns line segments", function() {
		svgCanvas.drawLine(1, 2, 5, 10);
		expect(svgCanvas.lineSegments()).to.eql([ [1, 2, 5, 10] ]);
	});

	it("draws and returns multiple line segments", function() {
		svgCanvas.drawLine(1, 2, 5, 10);
		svgCanvas.drawLine(5, 10, 40, 40);
		svgCanvas.drawLine(40, 40, 100, 101);
		expect(svgCanvas.lineSegments()).to.eql([
			[1, 2, 5, 10],
			[5, 10, 40, 40],
			[40, 40, 100, 101]
		]);
	});

});

}());

},{"./dom_element.js":5,"./svg_canvas.js":6}],4:[function(require,module,exports){
/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var SvgCanvas = require("./svg_canvas.js");

var drawingArea;
var svgCanvas;

exports.initializeDrawingArea = function(domElement) {
	drawingArea = domElement;
	svgCanvas = new SvgCanvas(domElement);
	handleDragEvents();

	return svgCanvas;
};

function handleDragEvents() {
	var start = null;

	drawingArea.onMouseDown(startDrag);
	drawingArea.onTouchStart(startDrag);

	drawingArea.onMouseMove(continueDrag);
	drawingArea.onTouchMove(continueDrag);

	drawingArea.onMouseLeave(endDrag);
	drawingArea.onMouseUp(endDrag);
	drawingArea.onTouchEnd(endDrag);

	function startDrag(relativePosition, event) {
		start = relativePosition;
		event.preventDefault();
	}

	function continueDrag(offset) {
		if(start === null) return;

		svgCanvas.drawLine(start.x, start.y, offset.x, offset.y);
		start = offset;
	}

	function endDrag() {
		start = null;
	}
}

}());

},{"./svg_canvas.js":6}],5:[function(require,module,exports){
/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

(function () {
"use strict";

var HtmlElement = module.exports = function HtmlElement(jQueryElement) {
	this.element = jQueryElement;
};

HtmlElement.fromHTML = function(html) {
	return new HtmlElement($(html));
};

HtmlElement.prototype.append = function(domElementToAppend) {
	this.element.append(domElementToAppend.element);
};

HtmlElement.prototype.remove = function() {
	this.element.remove();
};

HtmlElement.prototype.toDomElement = function() {
	return this.element[0];
};

HtmlElement.prototype.appendSelfToBody = function() {
	$(document.body).append(this.element);
};

HtmlElement.prototype.mouseMove = function(relativeX, relativeY) {
	mouseEvent(this, "mousemove", relativeX, relativeY);
};

HtmlElement.prototype.mouseDown = function(relativeX, relativeY) {
	mouseEvent(this, "mousedown", relativeX, relativeY);
};

HtmlElement.prototype.mouseLeave = function(relativeX, relativeY) {
	mouseEvent(this, "mouseleave", relativeX, relativeY);
};

HtmlElement.prototype.mouseUp = function(relativeX, relativeY) {
	mouseEvent(this, "mouseup", relativeX, relativeY);
};

function mouseEvent(self, event, relativeX, relativeY) {
	var element = self.element;
	var offset = pageOffset(self, relativeX, relativeY);

	var eventData = new jQuery.Event();
	eventData.pageX = offset.x;
	eventData.pageY = offset.y;
	eventData.type = event;

	element.trigger(eventData);
}

HtmlElement.prototype.onMouseDown = function(callback) {
	this.element.mousedown(mouseStart(this, callback));
};

HtmlElement.prototype.onMouseMove = function(callback) {
	this.element.mousemove(mouseStart(this, callback));
};

HtmlElement.prototype.onMouseLeave = function(callback) {
	this.element.mouseleave(mouseStart(this, callback));
};

HtmlElement.prototype.onMouseUp = function(callback) {
	this.element.mouseup(mouseStart(this, callback));
};

HtmlElement.prototype.touchStart = function(relativeX, relativeY) {
	sendTouchEvent(this, "touchstart", relativeX, relativeY);
};

HtmlElement.prototype.touchMove = function(relativeX, relativeY) {
	sendTouchEvent(this, "touchmove", relativeX, relativeY);
};

HtmlElement.prototype.touchEnd = function(relativeX, relativeY) {
	sendTouchEvent(this, "touchend", relativeX, relativeY);
};

function sendTouchEvent(self, event, relativeX, relativeY) {
	var touchEvent = document.createEvent("TouchEvent");
	touchEvent.initTouchEvent(event, true, true);

	var element = self.element;
	var offset = pageOffset(self, relativeX, relativeY);
	var eventData = new jQuery.Event();
	eventData.pageX = offset.x;
	eventData.pageY = offset.y;
	eventData.type = event;
	eventData.originalEvent = touchEvent;

	element.trigger(eventData);
}

HtmlElement.prototype.onTouchStart = function(callback) {
	this.element.on("touchstart", mouseStart(this, callback));
};

HtmlElement.prototype.onTouchMove = function(callback) {
	this.element.on("touchmove", callback);
};

HtmlElement.prototype.onTouchEnd = function(callback) {
	this.element.on("touchend", callback);
};

function relativeOffset(self, absX, absY) {
	var position = self.element.offset();
	return {
		x: absX - position.left,
		y: absY - position.top
	};
}

function pageOffset(self, relativeX, relativeY) {
	var topLeftOfDrawingArea = self.element.offset();
	return {
		x: relativeX + topLeftOfDrawingArea.left,
		y: relativeY + topLeftOfDrawingArea.top
	};
}

function mouseStart(self, callback) {
	return function(event) {
		var offset = relativeOffset(self, event.pageX, event.pageY);
		callback(offset, event);
	};
}

}());

},{}],6:[function(require,module,exports){
/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

(function () {
"use strict";

var SvgCanvas = function SvgCanvas(htmlElement) {
	this._paper = new Raphael(htmlElement.toDomElement());
};

SvgCanvas.prototype.drawLine = function(startX, startY, endX, endY) {
	this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

SvgCanvas.prototype.width = function() {
	return this._paper.width;
};

SvgCanvas.prototype.height = function() {
	return this._paper.height;
};

SvgCanvas.prototype.lineSegments = function() {
	var result = [];
	this._paper.forEach(function(element) {
		var path = pathFor(element);
		result.push(path);
	});
	return result;
};

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

module.exports = SvgCanvas;

}());

},{}]},{},[2,1,3])
;