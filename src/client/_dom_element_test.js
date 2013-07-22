/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael, wwp */

(function () {
"use strict";

describe("DOM Element", function() {

	describe("event handlers", function() {
		var domElement;

		beforeEach(function() {
			domElement = new wwp.DomElement( $("<div></div>") );
		});

		it("handles mouse events", function() {
			testEvent(domElement.onMouseDown, domElement.mouseDown);
			testEvent(domElement.onMouseLeave, domElement.mouseLeave);
			testEvent(domElement.onMouseMove, domElement.mouseMove);
			testEvent(domElement.onMouseUp, domElement.mouseUp);
		});

		function testEvent(onEvent, performEvent) {
			var eventOffset = null;
			onEvent.call(domElement, function(offset, event) {
				eventOffset = offset;
			});
			performEvent.call(domElement, 42, 13);

			expect(eventOffset).to.eql( {x: 42, y: 13} );
		}

	});

});

}());
