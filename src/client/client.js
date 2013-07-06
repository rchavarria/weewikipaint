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
	var $document = $(document);
	$document.mousedown(function(event) {
		var potentialStart = relativePosition(drawingArea, event.pageX, event.pageY);
		if(isWithinDrawingArea(potentialStart)) {
			start = potentialStart;
		}
	});

	$document.mousemove( function(event) {
		if(start === null) return;

		var end = relativePosition(drawingArea, event.pageX, event.pageY);
		if(isWithinDrawingArea(end)) {
			drawLine(start.x, start.y, end.x, end.y);
			start = end;
		} else {
			start = null;
		}
	});

	$document.mouseup(function() {
		start = null;
	});
}

function isWithinDrawingArea(offset) {
	return (offset.x >= 0 && offset.x <= paper.width &&
			offset.y >= 0 && offset.y <= paper.height);
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
