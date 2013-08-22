/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var drawingArea;
var svgCanvas;

wwp.initializeDrawingArea = function(domElement) {
	drawingArea = domElement;
	svgCanvas = new wwp.SvgCanvas(domElement);
	handleDragEvents();

	return svgCanvas._paper;
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

		svgCanvas.drawLine(start.x, start.y, offset.x, offset.y);
		start = offset;
	}

	function endDrag() {
		start = null;
	}
}

}());
