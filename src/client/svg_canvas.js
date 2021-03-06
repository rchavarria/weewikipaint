/* global describe, it, $, jQuery, expect, dump, Raphael, wwp:true */

(function () {
"use strict";

var SvgCanvas = function SvgCanvas(htmlElement) {
	this._paper = new Raphael(htmlElement.toDomElement());
};

SvgCanvas.prototype.drawLine = function(startX, startY, endX, endY) {
	this._paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
};

SvgCanvas.prototype.width = function() {
	return this._paper.width;
};

SvgCanvas.prototype.height = function() {
	return this._paper.height;
};

SvgCanvas.prototype.lineSegments = function() {
	var result = [];
	this._paper.forEach(function(element) {
		var path = pathFor(element);
		result.push(path);
	});
	return result;
};

function pathFor(element) {
	if(Raphael.svg) return vmlPathFor(element);
	else throw new Error("Raphael mode not implemented");
}

function vmlPathFor(element) {
	var path = element.node.attributes.d.value;
	var regex = /M(\d+),(\d+)L(\d+),(\d+)/;
	var groups = path.match(regex);

	return [groups[1], groups[2], groups[3], groups[4]];
}

module.exports = SvgCanvas;

}());
