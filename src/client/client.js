/* global describe, it, expect, dump */

var wwp = {};

(function () {
"use strict";

wwp.initializeDrawingArea = function(drawingAreaId) {
	var paper = new Raphael(drawingAreaId)

	return paper;
};

}());