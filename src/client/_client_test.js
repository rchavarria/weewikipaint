/* global describe, it, expect, wwp */

(function () {
"use strict";

describe("Drawing area", function() {

	it("should be initialized in predefined div", function() {
		// predefined div
		var div = document.createElement("div");
		div.setAttribute("id", "wwp-drawingArea");
		document.body.appendChild(div);

		// initialice
		wwp.initializeDrawingArea();

		// verify
		var extractedDiv = document.getElementById("wwp-drawingArea");
		expect(extractedDiv).to.be.ok(); // it exist
	});
});

}());