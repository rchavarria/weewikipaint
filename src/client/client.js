/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var paper;
var drawingArea;

wwp.initializeDrawingArea = function(domElement) {
	drawingArea = domElement;
	paper = new Raphael(domElement.element[0]);
	handleDragEvents();

	return paper;
};

function handleDragEvents() {
	var start = null;

	drawingArea.onMouseDown(startDrag);
	drawingArea.onTouchStart(startDrag);

	drawingArea.onMouseMove(continueDrag);
	drawingArea.onTouchMove(continueDrag);

	drawingArea.onMouseLeave(endDrag);
	drawingArea.onMouseUp(endDrag);
	drawingArea.onTouchEnd(endDrag);

	function startDrag(relativePosition, event) {
		start = relativePosition;
		event.preventDefault();
	}

	function continueDrag(offset) {
		if(start === null) return;

		drawLine(start.x, start.y, offset.x, offset.y);
		start = offset;
	}

	function endDrag() {
		start = null;
	}
}

function drawLine(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
}

}());
