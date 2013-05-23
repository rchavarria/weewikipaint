(function () {
	"use strict";

	var child_process = require("child_process");

	exports.test_for_smoke = function(test) {
		runServer("node src/server/weewikipaint 8080", function() {
			test.done();
		});
	};

	var runServer = function(command, callback) {
		child_process.exec(command, function(err, stdout, stderr) {
			if(err !== null) {
				console.log(stdout);
				console.log(stderr);
				throw err;
			}

			callback();
		});
	};

})();