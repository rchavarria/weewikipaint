/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var DomElement = wwp.DomElement = function DomElement(browserDomElement) {
	this.element = browserDomElement;
};

DomElement.prototype.relativePosition = function(absX, absY) {
	var position = this.element.offset();
	return {
		x: absX - position.left,
		y: absY - position.top
	};
};

wwp.pageOffset = function(drawingArea, relativeX, relativeY) {
	var topLeftOfDrawingArea = drawingArea.offset();
	return {
		x: relativeX + topLeftOfDrawingArea.left,
		y: relativeY + topLeftOfDrawingArea.top
	};
};

}());
