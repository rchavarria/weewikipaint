// Copyright (c) 2013 Titanium I.T. LLC. All rights reserved. See LICENSE.TXT for details.
/*global phantom, wwp, $ */

(function() {
    "use strict";

    var page = require("webpage").create();

    page.onConsoleMessage = function(message) {
        console.log("CONSOLE: " + message);
    };

    page.open("http://localhost:5000", function(success) {
        try {
            var error = page.evaluate(inBrowser);
            if (error) {
                console.log(error);
                phantom.exit(1);
            } else {
                phantom.exit(0);
            }
        
        } catch(err) {
            console.log("Exception in PhantomJS code: " + err);
            phantom.exit(2);
        }
    });

    function inBrowser() {
        try {
            var drawingArea = new wwp.HtmlElement($("#drawingArea"));
            drawingArea.mouseDown(10, 20);
            drawingArea.mouseMove(50, 60);
            drawingArea.mouseUp(50, 60);

            var actual = JSON.stringify(wwp.drawingAreaCanvas.lineSegments());
            var expected = JSON.stringify([[ "10", "20", "50", "60" ]]);

            if (actual !== expected) return "lines drawn expected " + expected + " but was " + actual;
            else return null;
        
        } catch(err) {
            return "Exception in PhantomJS browser code: " + err;
        }
    }

}());