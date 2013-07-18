/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var paper;
var domElement;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	paper = new Raphael(drawingAreaElement);

	domElement = new wwp.DomElement($(drawingAreaElement));
	handleDragEvents(drawingAreaElement);

	return paper;
};

function handleDragEvents(drawingAreaElement) {
	var start = null;

	var drawingArea = $(drawingAreaElement);
	
	domElement.onMouseDown(startDrag);
	domElement.onTouchStart(startDrag);

	domElement.onMouseMove(continueDrag);
	domElement.onTouchMove(continueDrag);

	domElement.onMouseLeave(endDrag);
	domElement.onMouseUp(endDrag);
	domElement.onTouchEnd(endDrag);

	function startDrag(event, relativePosition) {
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
