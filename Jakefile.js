desc("this is a description");
task("example", ["dependency"], function() {
	console.log("this is an example");
});

task("dependency", function() {
	console.log("exe the dependency");
})