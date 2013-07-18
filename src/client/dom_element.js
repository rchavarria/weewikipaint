/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var DomElement = wwp.DomElement = function DomElement(jQueryElement) {
	this.element = jQueryElement;
};

DomElement.prototype.onMouseDown = function(callback) {
	var self = this;
	this.element.mousedown(function(event) {
		var offset = self.relativePosition(event.pageX, event.pageY);
		callback(event, offset);
	});
};

DomElement.prototype.onMouseMove = function(callback) {
	var self = this;
	this.element.mousemove(function(event) {
		var offset = self.relativePosition(event.pageX, event.pageY);
		callback(offset);
	});
};

DomElement.prototype.onMouseLeave = function(callback) {
	this.element.mouseleave(callback);
};

DomElement.prototype.onMouseUp = function(callback) {
	this.element.mouseup(callback);
};

DomElement.prototype.onTouchStart = function(callback) {
	var self = this;
	this.element.on("touchstart", function(event) {
		var offset = self.relativePosition(event.pageX, event.pageY);
		callback(event, offset);
	});
};

DomElement.prototype.onTouchMove = function(callback) {
	this.element.on("touchmove", callback);
};

DomElement.prototype.onTouchEnd = function(callback) {
	this.element.on("touchend", callback);
};

DomElement.prototype.relativePosition = function(absX, absY) {
	var position = this.element.offset();
	return {
		x: absX - position.left,
		y: absY - position.top
	};
};

DomElement.prototype.pageOffset = function(relativeX, relativeY) {
	var topLeftOfDrawingArea = this.element.offset();
	return {
		x: relativeX + topLeftOfDrawingArea.left,
		y: relativeY + topLeftOfDrawingArea.top
	};
};

}());
