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
	domElement.onMouseDown(function(event) {
		start = domElement.relativePosition(event.pageX, event.pageY);

		event.preventDefault();
	});

	domElement.onMouseMove( function(event) {
		if(start === null) return;

		var end = domElement.relativePosition(event.pageX, event.pageY);
		drawLine(start.x, start.y, end.x, end.y);
		start = end;
	});

	domElement.onMouseLeave(function() {
		start = null;
	});

	domElement.onMouseUp(function() {
		start = null;
	});

	domElement.onTouchStart(function(event) {
		start = domElement.relativePosition(event.pageX, event.pageY);

		event.preventDefault();
	});

	domElement.onTouchMove(function(event) {
		if(start === null) return;

		var end = domElement.relativePosition(event.pageX, event.pageY);
		drawLine(start.x, start.y, end.x, end.y);
		start = end;
	});

	domElement.onTouchEnd(function() {
		start = null;
	});
}

function drawLine(startX, startY, endX, endY) {
	paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
}

}());
