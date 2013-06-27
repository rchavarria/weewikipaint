/* global describe, it, $, jQuery, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

var paper;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	var start = null;

	paper = new Raphael(drawingAreaElement);

	var drawingArea = $(drawingAreaElement);

	$(document).mousedown(function(event) {
		start = relativePosition(drawingArea, event.pageX, event.pageY);
	}).mouseup(function() {
		start = null;
	});

	drawingArea.mousemove( function(event) {
		if(start === null) return;

		var end = relativePosition(drawingArea, event.pageX, event.pageY);
		wwp.drawLine(start.x, start.y, end.x, end.y);
		start = end;
	});

	return paper;
};

wwp.drawLine = function(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

function relativePosition(drawingArea, absX, absY) {
	var position = drawingArea.offset();
	return {
		x: absX - position.left,
		y: absY - position.top
	};
}

}());