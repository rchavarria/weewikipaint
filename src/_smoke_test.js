(function () {
	"use strict";

	var child_process = require("child_process");

	exports.test_for_smoke = function(test) {
		child_process.exec("node weewikipaint 8080", function(err, stdout, stderr) {
			if(err !== null) {
				console.log(stdout);
				console.log(stderr);
				throw err;
			}
			test.done();
		});
	};

})();