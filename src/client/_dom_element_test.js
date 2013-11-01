/* global describe, beforeEach, it, $, jQuery, expect, dump, Raphael */

(function () {
"use strict";

var HtmlElement = require("./dom_element.js");

describe("DOM Element", function() {

	describe("event handlers", function() {
		var domElement;

		beforeEach(function() {
			domElement = HtmlElement.fromHTML("<div></div>");
		});

		it("triggers mouse eventos relative to element and handles them relative to page", function() {
			testEvent(domElement.onMouseDown, domElement.mouseDown);
			testEvent(domElement.onMouseLeave, domElement.mouseLeave);
			testEvent(domElement.onMouseMove, domElement.mouseMove);
			testEvent(domElement.onMouseUp, domElement.mouseUp);
		});

		it("appends elements", function() {
			expect(domElement.element.children().length).to.be(0);
			domElement.append(HtmlElement.fromHTML("<div></div>"));
			expect(domElement.element.children().length).to.be(1);
		});

		it("removes elements", function() {
			var elementToAppend = HtmlElement.fromHTML("<div></div>");
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
			try {
				var body = new HtmlElement($(document.body));
				var childrenBeforeAppend = body.element.children().length;
				domElement.appendSelfToBody();
				var childrenAfterAppend = body.element.children().length;

				expect(childrenAfterAppend).to.be(childrenBeforeAppend + 1);
			} finally {
				domElement.remove();
			}
		});

		it("converts page coordinates into relative element coordinates", function() {
			try {
				domElement.appendSelfToBody();
				expect( domElement.relativeOffset( {x: 100, y: 100} ) ).to.eql( {x: 92, y: 92} );
			} finally {
				domElement.remove();
			}
		});

		function testEvent(onEvent, performEvent) {
			try {
				domElement.appendSelfToBody();

				var eventPageOffset = null;
				onEvent.call(domElement, function(pageOffset, event) {
					eventPageOffset = pageOffset;
				});
				performEvent.call(domElement, 42, 13);

				expect( domElement.relativeOffset(eventPageOffset) ).to.eql( {x: 42, y: 13} );

			} finally {
				domElement.remove();
			}
		}

		it("clears all events (useful for testing and debuggin", function() {
			domElement.onMouseDown(function() {
				throw new Error("Event handler should be removed");
			});

			domElement.removeAllEventHandlers();

			domElement.mouseDown(0, 0);
		});

	});

});

}());
