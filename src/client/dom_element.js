/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var HtmlElement = wwp.HtmlElement = function HtmlElement(jQueryElement) {
	this.element = jQueryElement;
};

HtmlElement.fromHTML = function(html) {
	return new wwp.HtmlElement($(html));
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

HtmlElement.prototype.appendToBody = function() {
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
