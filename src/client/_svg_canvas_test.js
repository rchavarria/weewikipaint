/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael, wwp */

(function () {
"use strict";

describe("Svg Canvas", function() {

	var div;
	var svgCanvas;

	beforeEach(function() {
		div = wwp.HtmlElement.fromHTML("<div style='width: 321px; height: 123px;'></div>");
		var documentBody = new wwp.HtmlElement($(document.body));
		documentBody.append(div);

		svgCanvas = new wwp.SvgCanvas(div);
	});

	afterEach(function() {
		div.remove();
	});

	it("returns height and width", function() {
		expect(svgCanvas.height()).to.be(123);
		expect(svgCanvas.width()).to.be(321);
	});

	it("returns zero line segments", function() {
		expect(svgCanvas.lineSegments()).to.eql( [] );
	});

	it("draws and returns line segments", function() {
		svgCanvas.drawLine(1, 2, 5, 10);
		expect(svgCanvas.lineSegments()).to.eql([ [1, 2, 5, 10] ]);
	});

	it("draws and returns multiple line segments", function() {
		svgCanvas.drawLine(1, 2, 5, 10);
		svgCanvas.drawLine(5, 10, 40, 40);
		svgCanvas.drawLine(40, 40, 100, 101);
		expect(svgCanvas.lineSegments()).to.eql([
			[1, 2, 5, 10],
			[5, 10, 40, 40],
			[40, 40, 100, 101]
		]);
	});

});

}());
