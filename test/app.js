/*********************************************************************************
*     File Name           :     app.js
*     Created By          :     Jone Casper
*     Creation Date       :     [2014-02-11 17:52]
*     Last Modified       :     [2014-02-13 00:41]
*     Description         :     Test backchart main app
**********************************************************************************/
/*
 * requireJs config
 */
var debug = false;
require.config({
	  baseUrl: debug ? "../src" : "../dist",
	  packages: [
		  {
		  name: 'backchart',
		  main: "../main"
	  	  }
	  ],
	  paths:{
		  backbone : "../libs/utils/backbone-min",
		  underscore : "../libs/utils/underscore-min",
		  moment : "../libs/utils/moment.min",
		  excanvas : "../libs/utils/excanvas",
		  CanvasJS : "../libs/charts/canvasjs/canvasjs"
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
