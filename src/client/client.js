/* global describe, it, $, jQuery, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

var paper;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	var prevX = null;
	var prevY = null;
	var isDragging = false;

	paper = new Raphael(drawingAreaElement);

	var drawingArea = $(drawingAreaElement);

	$(document).mousedown(function(event) {
		isDragging = true;
		var position = drawingArea.offset();
		prevX = event.pageX - position.left;
		prevY = event.pageY - position.top;
	});
	$(document).mouseup(function() {
		isDragging = false;
	});

	drawingArea.mousemove( function(event) {
		var position = drawingArea.offset();
		var x = event.pageX - position.left;
		var y = event.pageY - position.top;

		if(prevX !== null && isDragging) wwp.drawLine(prevX, prevY, x, y);

		prevX = x;
		prevY = y;
	});

	return paper;
};

wwp.drawLine = function(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

}());