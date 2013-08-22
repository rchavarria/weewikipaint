/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

window.wwp = window.wwp || {};

(function () {
"use strict";

var SvgCanvas = wwp.SvgCanvas = function SvgCanvas(htmlElement) {
	this._paper = new Raphael(htmlElement.element[0]);
};

SvgCanvas.prototype.drawLine = function(startX, startY, endX, endY) {
	this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

}());
