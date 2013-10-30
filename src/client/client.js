/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var SvgCanvas = require("./svg_canvas.js");

var drawingArea;
var svgCanvas;

exports.initializeDrawingArea = function(domElement) {
	drawingArea = domElement;
	svgCanvas = new SvgCanvas(domElement);
	handleDragEvents();

	return svgCanvas;
};

function handleDragEvents() {
	var start = null;

	drawingArea.onMouseDown(startDrag);
	drawingArea.onTouchStart(startDrag);

	documentBody.onMouseMove(continueDrag);
	drawingArea.onTouchMove(continueDrag);

	drawingArea.onMouseUp(endDrag);
	drawingArea.onTouchEnd(endDrag);

	function startDrag(pageOffset, event) {
		start = drawingArea.relativeOffset(pageOffset);
		event.preventDefault();
	}

	function continueDrag(pageOffset) {
		if(start === null) return;

		var end = drawingArea.relativeOffset(pageOffset);
		svgCanvas.drawLine(start.x, start.y, end.x, end.y);
		start = end;
	}

	function endDrag() {
		start = null;
	}
}

}());
