(function() {
	"use strict";

	var HOME_DIR = "src/client";

	var server = require("./server.js");

	// getting the port from the command line arguments ('process' is provided by node)
	var port = process.argv[2];

	server.start(HOME_DIR, "/404.html", port, function() {
		console.log("Server started");
	});
}());