/* global describe, it, expect, wwp, $ */

(function () {
"use strict";

describe("Drawing area", function() {

	it("should be initialized in predefined div", function() {
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
		var tagName = $(extractedDiv).children()[0].tagName;
		expect(tagName).to.equal("svg");
	});
});

}());