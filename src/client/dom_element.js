/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

wwp.relativePosition = function(drawingArea, absX, absY) {
	var position = drawingArea.offset();
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
