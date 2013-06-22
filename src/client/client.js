/* global describe, it, $, jQuery, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

var paper;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	paper = new Raphael(drawingAreaElement);

	var drawingArea = $(drawingAreaElement);

	drawingArea.click( function(event) {
		var position = drawingArea.offset();

		var borderTop = parseInt(drawingArea.css("border-top-width"), 10);
		var borderLeft = parseInt(drawingArea.css("border-left-width"), 10);

		var x = event.pageX - position.left - borderLeft;
		var y = event.pageY - position.top - borderTop;
		wwp.drawLine(0, 0, x, y);
	});

	return paper;
};

wwp.drawLine = function(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

}());