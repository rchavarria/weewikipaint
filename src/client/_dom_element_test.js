/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael, wwp */

(function () {
"use strict";

describe("DOM Element", function() {

	describe("event handlers", function() {
		var domElement;

		beforeEach(function() {
			domElement = new wwp.DomElement( $("<div></div>") );
		});

		it("handles mouse down", function() {
			var eventOffset = null;
			domElement.onMouseDown(function(offset, event) {
				eventOffset = offset;
			});
			domElement.mouseDown(42, 13);

			expect(eventOffset).to.eql( {x: 42, y: 13} );

		});

	});

});

}());
