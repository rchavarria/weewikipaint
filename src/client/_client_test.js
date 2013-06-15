/* global describe, it, expect */

(function () {
"use strict";

describe("test something", function() {

	it("should run", function() {
		var extractedDiv = document.getElementById("tdjs");
		expect(extractedDiv.getAttribute("foo")).to.equal("bar");
	});
});

}());