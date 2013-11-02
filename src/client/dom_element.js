/* global describe, it, $, jQuery, expect, dump, Raphael, document */

(function () {
"use strict";

var HtmlElement = module.exports = function HtmlElement(domElement) {
	this.element = $(domElement);
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
		
		var offset;
		if(relativeX === undefined || relativeY === undefined) {
			offset = { x: 0, y: 0 };
		} else {
			offset = this.pageOffset( { x: relativeX, y: relativeY } );
		}

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
