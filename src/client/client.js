/* global describe, it, $, jQuery, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

var paper;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	var isDragging = false;
	var start = null;

	paper = new Raphael(drawingAreaElement);

	var drawingArea = $(drawingAreaElement);

	$(document).mousedown(function(event) {
		isDragging = true;
		start = relativePosition(drawingArea, event.pageX, event.pageY);
	});
	$(document).mouseup(function() {
		isDragging = false;
	});

	drawingArea.mousemove( function(event) {
		var end = relativePosition(drawingArea, event.pageX, event.pageY);

		if(start !== null && isDragging) wwp.drawLine(start.x, start.y, end.x, end.y);

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