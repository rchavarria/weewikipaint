/* global describe, it, $, jQuery, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

var paper;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	paper = new Raphael(drawingAreaElement);
	handleDragEvents(drawingAreaElement);

	return paper;
};

function handleDragEvents(drawingAreaElement) {
	var start = null;

	var drawingArea = $(drawingAreaElement);
	drawingArea.mousedown(function(event) {
		start = relativePosition(drawingArea, event.pageX, event.pageY);

		event.preventDefault();
	});

	drawingArea.mousemove( function(event) {
		if(start === null) return;

		var end = relativePosition(drawingArea, event.pageX, event.pageY);
		drawLine(start.x, start.y, end.x, end.y);
		start = end;
	});

	drawingArea.mouseleave(function() {
		start = null;
	});

	drawingArea.mouseup(function() {
		start = null;
	});
}

function drawLine(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
}

function relativePosition(drawingArea, absX, absY) {
	var position = drawingArea.offset();
	return {
		x: absX - position.left,
		y: absY - position.top
	};
}

}());
