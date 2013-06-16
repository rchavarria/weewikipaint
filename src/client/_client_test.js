/* global describe, it, expect, wwp, $, afterEach */

(function () {
"use strict";

describe("Drawing area", function() {

	afterEach( function() {
		$("#wwp-drawingArea").remove();
	});

	it("should be initialized with Raphael", function() {
		// predefined div
		var div = document.createElement("div");
		div.setAttribute("id", "wwp-drawingArea");
		document.body.appendChild(div);

		// initialice
		wwp.initializeDrawingArea("wwp-drawingArea");

		// verify
		var extractedDiv = document.getElementById("wwp-drawingArea");
		expect(extractedDiv).to.be.ok(); // it exist
		// raphael adds a svg tag to our div to start drawing
		var tagName = $(extractedDiv).children()[0].tagName.toLowerCase();
		if(tagName === "svg") {
			// we're in a browser with svg support
			expect(tagName).to.equal("svg");
		} else {
			// we're in a non-svg browser, e.g.: IE 8.0
			expect(tagName).to.equal("div"); // a 'div' inside our div
		}
	});

	it("should have same dimensions as its enclosing div", function() {
		var testHtml = "<div style='height: 200px; width: 400px'>hi</div>";
		$(document.body).append(testHtml);

		// initialice
		var paper = wwp.initializeDrawingArea("wwp-drawingArea");

		// verify
		expect(paper.width).to.be(400);
		expect(paper.height).to.be(200);
	});
});

}());