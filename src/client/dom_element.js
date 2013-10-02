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
