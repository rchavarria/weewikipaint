/* global describe, it, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

var paper;

wwp.initializeDrawingArea = function(drawingAreaElement) {
	paper = new Raphael(drawingAreaElement);
	return paper;
};

wwp.drawLine = function(startX, startY, endX, endY) {
	paper.path("M1,1L2,2");
};

}());