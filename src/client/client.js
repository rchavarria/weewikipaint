/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var SvgCanvas = require("./svg_canvas.js");
var HtmlElement = require("./dom_element.js");

var drawingArea;
var svgCanvas;
var documentBody;
var windowElement;

exports.initializeDrawingArea = function(domElement) {
	//if (svgCanvas !== null) throw new Error("Client.js is not re-entrant");

	drawingArea = domElement;
	documentBody = new HtmlElement(document.body);
	windowElement = new HtmlElement(window);

	svgCanvas = new SvgCanvas(domElement);
	handleDragEvents();

	return svgCanvas;
};

exports.drawingAreaHasBeenRemovedFromDom = function() {
	svgCanvas = null;
};

function handleDragEvents() {
	var start = null;

	drawingArea.onMouseDown(startDrag);
	drawingArea.onTouchStart(startDrag);

	documentBody.onMouseMove(continueDrag);
	drawingArea.onTouchMove(continueDrag);

	documentBody.onMouseUp(endDrag);
	drawingArea.onTouchEnd(endDrag);

	windowElement.onMouseUp(endDrag);

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
