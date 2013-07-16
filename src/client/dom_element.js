/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var DomElement = wwp.DomElement = function DomElement(jQueryElement) {
	this.element = jQueryElement;
};

DomElement.prototype.onMouseDown = function(callback) {
	this.element.mousedown(callback);
};

DomElement.prototype.onMouseMove = function(callback) {
	this.element.mousemove(callback);
};

DomElement.prototype.onMouseLeave = function(callback) {
	this.element.mouseleave(callback);
};

DomElement.prototype.onMouseUp = function(callback) {
	this.element.mouseup(callback);
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
