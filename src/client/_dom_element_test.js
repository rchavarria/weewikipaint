/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael, wwp */

(function () {
"use strict";

describe("DOM Element", function() {

	describe("event handlers", function() {
		var domElement;

		beforeEach(function() {
			domElement = wwp.HtmlElement.fromHTML("<div></div>");
		});

		it("handles mouse events", function() {
			testEvent(domElement.onMouseDown, domElement.mouseDown);
			testEvent(domElement.onMouseLeave, domElement.mouseLeave);
			testEvent(domElement.onMouseMove, domElement.mouseMove);
			testEvent(domElement.onMouseUp, domElement.mouseUp);
		});

		it("appends elements", function() {
			expect(domElement.element.children().length).to.be(0);
			domElement.append(wwp.HtmlElement.fromHTML("<div></div>"));
			expect(domElement.element.children().length).to.be(1);
		});

		it("removes elements", function() {
			var elementToAppend = wwp.HtmlElement.fromHTML("<div></div>");
			domElement.append(elementToAppend);
			expect(domElement.element.children().length).to.be(1);
			elementToAppend.remove();
			expect(domElement.element.children().length).to.be(0);
		});

		it("converts to DOM element", function() {
			var internalElement = domElement.toDomElement();
			expect(internalElement.tagName).to.equal("DIV");
		});

		it("appends to body", function() {
			var body = new wwp.HtmlElement($(document.body));
			var childrenBeforeAppend = body.element.children().length;
			domElement.appendSelfToBody();
			var childrenAfterAppend = body.element.children().length;

			expect(childrenAfterAppend).to.be(childrenBeforeAppend + 1);
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
