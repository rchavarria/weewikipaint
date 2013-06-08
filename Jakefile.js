/*global desc, task, jake, fail, complete, directory */
(function() {
"use strict";

var TEMP_TESTFILE_DIR = "generated/test";
directory(TEMP_TESTFILE_DIR);

task("default", ["lint", "test"]);

desc("Delete all generated files");
task("clean", [], function() {
	jake.rmRf("generated");
});

desc("Lint everything");
task("lint", ["node"], function() {
	console.log("- linting");
	var lint = require("./build/lint/lint_runner.js");

	var files = new jake.FileList();
	files.include("**/*.js");
	files.exclude("node_modules");
	files.exclude("karma.conf.js");

	var options = {
		bitwise: true,
		curly: false,
		eqeqeq: true,
		forin: true,
		immed: true,
		latedef: true,
		newcap: true,
		noarg: true,
		noempty: true,
		nonew: true,
		regexp: true,
		undef: true,
		strict: true,
		trailing: true,
		node: true
	};

	var passed = lint.validateFileList(files.toArray(), options, {});
	if(!passed) fail("Lint failed");
});

desc("Test everything");
task("test", ["testServer", "testClient"], function() {
	console.log("- tests done");
});

desc("Test everything");
task("testServer", ["node", TEMP_TESTFILE_DIR], function() {
	console.log("- test server code goes here");

	var files = new jake.FileList();
	files.include("**/*_test.js");
	files.exclude("node_modules");
	files.exclude("src/client/_*_test.js");

	var reporter = require("nodeunit").reporters["default"];
	reporter.run(files.toArray(), null, function(failures) {
		if(failures) fail("Tests failed");
		complete();
	});
}, { async: true });

desc("Test client side");
task("testClient", function() {
	console.log("- test client code goes here");

	sh("node node_modules/.bin/karma run", "Client tests failed", function(stdout) {
			console.log(stdout);
			complete();
	});
}, {async: true});

desc("Integrate");
task("integrate", ["default"], function() {
	console.log("1. make sure 'git status' is clean");
	console.log("2. build on the integration box");
	console.log("    a. walk over integration box");
	console.log("    b. 'git pull' // para coger los últimos cambios en 'master'");
	console.log("    c. 'jake' con el default task");
	console.log("    d. if jake fails, stop! tray again after fixing the issue.");
	console.log("3. 'git checkout integration'");
	console.log("4. 'git merge master --no-ff --log' // para llevar los cambios que funcionan a la rama 'integration'");
	console.log("5. 'git checkout master' //para volver al curro en master");
});

desc("Deploy to the web");
task("deploy", ["default"], function() {
	console.log("1. make sure 'git status' is clean");
	console.log("2. git push heroku master");
	console.log("3. ./jake releasetest");
});

desc("Enforcing node version 0.10.8");
task("node", [], function() {
	var expectedVersion = "v0.10.8";

	sh("node --version", "Wrong node version", function(stdout) {
		console.log(stdout);
		
		if(stdout !== expectedVersion + "\n")
			fail("Wrong node version. Expected is " + expectedVersion);

		complete();
	});

}, {async: true});

function sh(command, errorMessage, callback) {
	console.log("> " + command);

	var stdout = "";

	var process = jake.createExec(command, {printStdout: true, printStderr: true} );
	process.on("stdout", function(chunk) {
		stdout += chunk;
	});
	process.on("error", function() {
		console.log(stdout);
		fail(errorMessage);
	});
	process.on("cmdEnd", function() {
		callback(stdout);
	});

	process.run();
}

})();