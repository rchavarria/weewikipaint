require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"eYKSv0":[function(require,module,exports){
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

	// drawingArea.onMouseLeave(endDrag);
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

},{"./svg_canvas.js":4}],"./client.js":[function(require,module,exports){
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
		var offset = pageOffset(this, relativeX, relativeY);

		var eventData = new jQuery.Event();
		eventData.pageX = offset.x;
		eventData.pageY = offset.y;
		eventData.type = event;

		jqElement.trigger(eventData);
	};
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