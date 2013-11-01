;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global describe, it, expect, dump, wwp, jQuery, $, beforeEach, afterEach, Raphael, window */

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
		//client.drawingAreaHasBeenRemovedFromDom();
		documentBody.removeAllEventHandlers();
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

		it("continues drawing even if mouse leaves drawing area", function() {
			// ask
			drawingArea.mouseDown(20, 30);
			drawingArea.mouseMove(50, 60);
			drawingArea.mouseLeave(350, 70);

			documentBody.mouseMove(350, 70);
			drawingArea.mouseMove(70, 90);
			drawingArea.mouseUp(70, 90);

			// assert
			expect(lineSegments()).to.eql([
				[20, 30, 50, 60],
				[50, 60, 350, 70],
				[350, 70, 70, 90]
			]);
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
		return (typeof Touch !== "undefined") && ('ontouchstart' in window);
	}

	function lineSegments() {
		return svgCanvas.lineSegments();
	}
});

}());

},{"./client.js":4,"./dom_element.js":5}],2:[function(require,module,exports){
/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael */

(function () {
"use strict";

var HtmlElement = require("./dom_element.js");

describe("DOM Element", function() {

	describe("event handlers", function() {
		var domElement;

		beforeEach(function() {
			domElement = HtmlElement.fromHTML("<div></div>");
		});

		it("triggers mouse eventos relative to element and handles them relative to page", function() {
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
			try {
				var body = new HtmlElement($(document.body));
				var childrenBeforeAppend = body.element.children().length;
				domElement.appendSelfToBody();
				var childrenAfterAppend = body.element.children().length;

				expect(childrenAfterAppend).to.be(childrenBeforeAppend + 1);
			} finally {
				domElement.remove();
			}
		});

		it("converts page coordinates into relative element coordinates", function() {
			try {
				domElement.appendSelfToBody();
				expect( domElement.relativeOffset( {x: 100, y: 100} ) ).to.eql( {x: 92, y: 92} );
			} finally {
				domElement.remove();
			}
		});

		function testEvent(onEvent, performEvent) {
			try {
				domElement.appendSelfToBody();

				var eventPageOffset = null;
				onEvent.call(domElement, function(pageOffset, event) {
					eventPageOffset = pageOffset;
				});
				performEvent.call(domElement, 42, 13);

				expect( domElement.relativeOffset(eventPageOffset) ).to.eql( {x: 42, y: 13} );

			} finally {
				domElement.remove();
			}
		}

		it("clears all events (useful for testing and debuggin", function() {
			domElement.onMouseDown(function() {
				expect(true).to.be(false); // deliberately fail
			});

			domElement.removeAllEventHandlers();

			domElement.mouseDown(0, 0);
		});

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
var HtmlElement = require("./dom_element.js");

var drawingArea;
var svgCanvas;
var documentBody;

exports.initializeDrawingArea = function(domElement) {
	//if (svgCanvas !== null) throw new Error("Client.js is not re-entrant");

	drawingArea = domElement;
	documentBody = new HtmlElement($(document.body));

	drawingArea = domElement;
	svgCanvas = new SvgCanvas(domElement);
	handleDragEvents();

	return svgCanvas;
};

exports.drawingAreaHasBeenRemovedFromDom = function() {
	svgCanvas = null;
};

function handleDragEvents() {
	var start = null;

	drawingArea.onMouseDown(startDrag);
	drawingArea.onTouchStart(startDrag);

	documentBody.onMouseMove(continueDrag);
	drawingArea.onTouchMove(continueDrag);

	drawingArea.onMouseUp(endDrag);
	drawingArea.onTouchEnd(endDrag);

	function startDrag(pageOffset, event) {
		start = drawingArea.relativeOffset(pageOffset);
		event.preventDefault();
	}

	function continueDrag(pageOffset) {
		if(start === null) return;

		var end = drawingArea.relativeOffset(pageOffset);
		svgCanvas.drawLine(start.x, start.y, end.x, end.y);
		start = end;
	}

	function endDrag() {
		start = null;
	}
}

}());

},{"./dom_element.js":5,"./svg_canvas.js":6}],5:[function(require,module,exports){
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

HtmlElement.prototype.mouseMove = mouseEventFn("mousemove");
HtmlElement.prototype.mouseDown = mouseEventFn("mousedown");
HtmlElement.prototype.mouseLeave = mouseEventFn("mouseleave");
HtmlElement.prototype.mouseUp = mouseEventFn("mouseup");

function mouseEventFn(event) {
	return function(relativeX, relativeY) {
		var jqElement = this.element;
		var offset = pageOffset(this, relativeX, relativeY);

		var eventData = new jQuery.Event();
		eventData.pageX = offset.x;
		eventData.pageY = offset.y;
		eventData.type = event;

		jqElement.trigger(eventData);
	};
}

HtmlElement.prototype.touchStart = sendTouchEventFn("touchstart");
HtmlElement.prototype.touchMove = sendTouchEventFn("touchmove");
HtmlElement.prototype.touchEnd = sendTouchEventFn("touchend");

function sendTouchEventFn(event) {
	return function(relativeX, relativeY) {
		var touchEvent = document.createEvent("TouchEvent");
		touchEvent.initTouchEvent(event, true, true);

		var element = this.element;
		var offset = pageOffset(this, relativeX, relativeY);
		var eventData = new jQuery.Event();
		eventData.pageX = offset.x;
		eventData.pageY = offset.y;
		eventData.type = event;
		eventData.originalEvent = touchEvent;

		element.trigger(eventData);
	};
}

HtmlElement.prototype.onMouseDown = onMouseEventFn("mousedown");
HtmlElement.prototype.onMouseMove = onMouseEventFn("mousemove");
HtmlElement.prototype.onMouseLeave = onMouseEventFn("mouseleave");
HtmlElement.prototype.onMouseUp = onMouseEventFn("mouseup");
HtmlElement.prototype.onTouchStart = onMouseEventFn("touchstart");
HtmlElement.prototype.onTouchMove = onMouseEventFn("touchmove");
HtmlElement.prototype.onTouchEnd = onMouseEventFn("touchend");

function onMouseEventFn(event) {
	return function(callback) {
		this.element.on(event, mouseStart(this, callback));
	};
}

HtmlElement.prototype.relativeOffset = function(pageOffset) {
	var elementPageOffset = this.element.offset();
	return {
		x: pageOffset.x - elementPageOffset.left,
		y: pageOffset.y - elementPageOffset.top
	};
};

function pageOffset(self, relativeX, relativeY) {
	var topLeftOfDrawingArea = self.element.offset();
	return {
		x: relativeX + topLeftOfDrawingArea.left,
		y: relativeY + topLeftOfDrawingArea.top
	};
}

function mouseStart(self, callback) {
	return function(event) {
		var pageOffset = { x: event.pageX, y: event.pageY };
		callback(pageOffset, event);
	};
}

HtmlElement.prototype.removeAllEventHandlers = function() {
	// call to jQuery .off() method to remove all event handlers on this object
	this.element.off();
};

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

},{}]},{},[1,2,3])
;