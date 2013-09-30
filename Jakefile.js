// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global desc, task, jake, fail, complete, directory*/

(function() {
	"use strict";

	if (!process.env.loose) console.log("For more forgiving test settings, use 'loose=true'");

	var shell = require("shelljs");
	var fs = require("fs");

	var browserify = require("browserify");
	var lint = require("./build/util/lint_runner.js");
	var nodeunit = require("./build/util/nodeunit_runner.js");
	var testacular = require("./build/util/testacular_runner.js");
	var versionChecker = require("./build/util/version_checker.js");
	var path = require("path");
	var runServer = require("./src/_run_server.js");

	var NODE_VERSION = "v0.10.16";
	var SUPPORTED_BROWSERS = [
		"Firefox 24.0 (Linux)"
	];

	var GENERATED_DIR = "generated";
	var TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";
	var BUILD_DIR = GENERATED_DIR + "/build";
	var BUILD_CLIENT_DIR = BUILD_DIR + "/client";

	directory(TEMP_TESTFILE_DIR);
	directory(BUILD_DIR);
	directory(BUILD_CLIENT_DIR);

	desc("Delete all generated files");
	task("clean", [], function() {
		jake.rmRf(GENERATED_DIR);
	});

	desc("Build and test");
	task("default", ["lint", "test"], function() {
		console.log("\n\nOK");
	});

	desc("Start Testacular server for testing");
	task("karma", function() {
		testacular.serve("build/karma.conf.js", complete, fail);
	}, {async: true});

	desc("Run server for manual testing");
	task("run", ["build"], function() {
		console.log("Starting the server");

		runServer.runInteractively(function(callback) {
			console.log("...started");
		});
	}, {async: true});

	desc("Lint everything");
	task("lint", ["lintNode", "lintClient"]);

	task("lintNode", ["nodeVersion"], function() {
		var passed = lint.validateFileList(nodeLintFiles(), nodeLintOptions(), {});
		if (!passed) fail("Lint failed");
	});

	task("lintClient", function() {
		var passed = lint.validateFileList(clientLintFiles(), clientLintOptions(), clientGlobals());
		if (!passed) fail("Lint failed");
	});

	desc("Test everything");
	task("test", ["testServer", "testClient", "testSmoke"]);

	desc("Test server code");
	task("testServer", ["nodeVersion", TEMP_TESTFILE_DIR], function() {
		nodeunit.runTests(serverTestFiles(), complete, fail);
	}, {async: true});

	desc("Test client code");
	task("testClient", ["build"], function() {
		testacular.runTests(SUPPORTED_BROWSERS, complete, fail);
	}, {async: true});

	desc("End-to-end smoke tests");
	task("testSmoke", ["build"], function() {
		nodeunit.runTests(smokeTestFiles(), complete, fail);
	});

	desc("Bundle and build code");
	task("build", [BUILD_CLIENT_DIR], function() {
		console.log("Bundling with browserify");

		shell.rm("-rf", BUILD_CLIENT_DIR + "/*");
		shell.cp("-R", ["./src/client/*.html", "./src/client/vendor"], BUILD_CLIENT_DIR);

		// browserify production code
		var b = browserify([
			"./src/client/client.js",
			"./src/client/dom_element.js"
			// "./src/client/svg_canvas.js",
			]);
		b.bundle({}, function(err, bundle) {
			if(err) fail(err);
			fs.writeFileSync(BUILD_CLIENT_DIR + "/bundle.js", bundle);

			// browserify test code
			b.require("./src/client/client.js", {expose: "./client.js"} );
			b.require("./src/client/dom_element.js", {expose: "./dom_element.js"} );
			b = browserify([
				"./src/client/_client_test.js",
				"./src/client/_dom_element_test.js",
				"./src/client/_svg_canvas_test.js"
				]);
			b.bundle({}, function(err, bundle) {
				if(err) fail(err);
				fs.writeFileSync(BUILD_CLIENT_DIR + "/_test_bundle.js", bundle);
				complete();
			});
		});
	}, {async: true});

	desc("Deploy to Heroku");
	task("deploy", ["default"], function() {
		console.log("1. Make sure 'git status' is clean.");

		// Correction: Use "git push heroku integration:master" to deploy from integration branch.
		// Thanks to Jüri A, http://www.letscodejavascript.com/v3/comments/live/32#comment-798947003 .
		console.log("2. 'git push heroku master' (or integration:master)");
		console.log("3. 'jake test'");
	});

//	desc("Ensure correct version of Node is present.");
	task("nodeVersion", [], function() {
		versionChecker.check("Node", !process.env.loose, NODE_VERSION, process.version, fail);
	});

	desc("Integration checklist");
	task("integrate", ["default"], function() {
		console.log("1. Make sure 'git status' is clean.");
		console.log("2. Build on the integration box.");
		console.log("   a. Walk over to integration box.");
		console.log("   b. 'git pull'");
		console.log("   c. 'npm rebuild'");
		console.log("   d. Check status for files that need to be .gitignore'd");
		console.log("   e. 'jake'");
		console.log("   f. If jake fails, stop! Try again after fixing the issue.");
		console.log("3. 'git checkout integration'");
		console.log("4. 'git merge master --no-ff --log'");
		console.log("5. 'git checkout master'");
	});

	desc("End-of-episode checklist");
	task("episode", [], function() {
		console.log("1. Save recording.");
		console.log("2. Double-check sound and framing.");
		console.log("3. Commit source code.");
		console.log("4. Check Windows compatibility");
		console.log("   a. Switch to Windows VM");
		console.log("   b. 'git pull'");
		console.log("   c. 'npm rebuild'");
		console.log("   d. Check status for files that need to be .gitignore'd");
		console.log("   e. 'jake'");
		console.log("5. Tag episode: 'git tag -a episodeXX -m \"End of episode XX\"'");
	});

	function serverTestFiles() {
		var testFiles = new jake.FileList();
		testFiles.include("src/server/**/_*_test.js");
		testFiles = testFiles.toArray();
		return testFiles;
	}

	function smokeTestFiles() {
		var testFiles = new jake.FileList();
		testFiles.include("src/_*_test.js");
		testFiles = testFiles.toArray();
		return testFiles;
	}

	function nodeLintFiles() {
		var javascriptFiles = new jake.FileList();
		javascriptFiles.include("*.js");
		javascriptFiles.include("build/util/*.js");
		javascriptFiles.include("src/server/**/*.js");
		javascriptFiles.include("src/*.js");
		return javascriptFiles.toArray();
	}

	function clientLintFiles() {
		var javascriptFiles = new jake.FileList();
		javascriptFiles.include("src/client/*.js");
		return javascriptFiles.toArray();
	}

	function nodeLintOptions() {
		var options = sharedLintOptions();
		options.node = true;
		return options;
	}

	function clientLintOptions() {
		var options = sharedLintOptions();
		options.browser = true;
		return options;
	}

	function sharedLintOptions() {
		return {
			bitwise: true,
			curly: false,
			eqeqeq: true,
			forin: true,
			immed: true,
			latedef: false,
			newcap: true,
			noarg: true,
			noempty: true,
			nonew: true,
			regexp: true,
			undef: true,
			strict: true,
			trailing: true
		};
	}

	function clientGlobals() {
		return {
			wwp: true,

			// Browserify
			module: false,
			require: false,
			exports: false,

			// Mocha / expect.js
			mocha: false,
			describe: false,
			it: false,
			expect: false,
			dump: false,
			beforeEach: false,
			afterEach: false
		};
	}

}());
