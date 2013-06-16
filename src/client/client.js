/* global describe, it, expect, dump, Raphael */

var wwp = {};

(function () {
"use strict";

wwp.initializeDrawingArea = function(drawingAreaElement) {
	var paper = new Raphael(drawingAreaElement);

	return paper;
};

}());