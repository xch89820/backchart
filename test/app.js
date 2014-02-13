/*********************************************************************************
 *     File Name           :     app.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 17:52]
 *     Last Modified       :     [2014-02-13 23:37]
 *     Description         :     Test backchart main app
 **********************************************************************************/
/*
 * requireJs config
 */
require.config({
	baseUrl: "../src",
	/*
	 * for debug
	 */
	/*packages: [
		{
		name: "base"
	},
	{
		name : "canvasjs"
	}
	],*/
	paths:{
		backbone : "../libs/utils/backbone-min",
		underscore : "../libs/utils/underscore-min",
		moment : "../libs/utils/moment.min",
		excanvas : "../libs/utils/excanvas",
		CanvasJS : "../libs/charts/canvasjs/canvasjs",
		/*
		 * for dist
		 */
		"backchart.base" : "../dist/backchart.base",
		"backchart.canvasjs" : "../dist/backchart.canvasjs"
	},
	shim:{
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		excanvas : [],
		CanvasJS :{
			deps : ['excanvas'],
			exports: 'CanvasJS'
		}
	}
});

define("jquery", function(){
	return jQuery;
});
/*
 * test
 */
$(function(){
	require(["./backchart_test.js"]);
});
