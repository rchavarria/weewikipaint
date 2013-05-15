// test for server.js

"use strict";

var server = require("./server.js");

exports.testNothing = function(test) {
	test.equals(3, server.number(), "must be equals");
	test.done();
};