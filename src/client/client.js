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
		var x = event.pageX - position.left;
		var y = event.pageY - position.top;
		wwp.drawLine(0, 0, x, y);
	});

	return paper;
};

wwp.drawLine = function(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

}());