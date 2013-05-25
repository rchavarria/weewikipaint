(function() {
	"use strict";

	var server = require("./server.js");

	// getting the port from the command line arguments ('process' is provided by node)
	var port = process.argv[2];

	server.start("src/server/content/homepage.html", "src/server/content/404.html", port, function() {
		console.log("Server started");
	});
}());