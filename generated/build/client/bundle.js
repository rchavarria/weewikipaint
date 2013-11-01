require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"eYKSv0":[function(require,module,exports){
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

},{"./dom_element.js":"Rkd7/B","./svg_canvas.js":4}],"./client.js":[function(require,module,exports){
module.exports=require('eYKSv0');
},{}],"Rkd7/B":[function(require,module,exports){
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
		var offset = this.pageOffset( { x: relativeX, y: relativeY } );

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
		var offset = this.pageOffset( { x: relativeX, y: relativeY } );
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

HtmlElement.prototype.pageOffset = function(relativeOffset) {
	var elementPageOffset = this.element.offset();
	return {
		x: relativeOffset.x + elementPageOffset.left,
		y: relativeOffset.y + elementPageOffset.top
	};
};

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

},{}],4:[function(require,module,exports){
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

},{}],"./dom_element.js":[function(require,module,exports){
module.exports=require('Rkd7/B');
},{}]},{},["eYKSv0","Rkd7/B"])
;