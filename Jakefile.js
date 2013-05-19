/*global desc, task, jake, fail, complete */
(function() {
"use strict";

task("default", ["lint", "test"]);

desc("Lint everything");
task("lint", [], function() {
	console.log("- linting");
	var lint = require("./build/lint/lint_runner.js");

	var files = new jake.FileList();
	files.include("**/*.js");
	files.exclude("node_modules");

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
task("test", [], function() {
	console.log("- testing goes here");

	var reporter = require("nodeunit").reporters["default"];
	reporter.run(["src/server/_server_test.js"], null, function(failures) {
		if(failures) fail("Tests failed");
		complete();
	});
}, { async: true });

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

desc("Enforcing node version 0.10.5");
task("node", [], function() {
	var expectedVersion = "v0.10.5";

	var command = "node --version";
	console.log("> " + command);

	var stdout = "";
	var process = jake.createExec(command, {printStdout: true, printStderr: true} );
	process.on("stdout", function(chunk) {
		stdout += chunk;
	});
	process.on("cmdEnd", function() {
		console.log(stdout);
		
		if(stdout !== expectedVersion + "\n") 
			fail("Wrong node version. Expected is " + expectedVersion);

		complete();
	});

	process.run();
}, {async: true});


})();