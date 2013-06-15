/* global describe, it, expect */

(function () {
"use strict";

describe("test something", function() {

	it("should run", function() {
		var div = document.createElement("div");
		div.setAttribute("id", "tdjs");
		div.setAttribute("foo", "bar");
		document.body.appendChild(div);

		var extractedDiv = document.getElementById("tdjs");
		expect(extractedDiv.getAttribute("foo")).to.equal("bar");
	});
});

}());