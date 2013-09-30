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

	drawingArea.onMouseMove(continueDrag);
	drawingArea.onTouchMove(continueDrag);

	// drawingArea.onMouseLeave(endDrag);
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
