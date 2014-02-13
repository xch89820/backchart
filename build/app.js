/*********************************************************************************
 *     File Name           :     app.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 17:52]
 *     Last Modified       :     [2014-02-13 23:04]
 *     Description         :     Test backchart main app
 **********************************************************************************/
require.config({
	baseUrl: "../src",
	packages: [
		{
		name: "base"
	},
	{
		name : "canvasjs"
	}
	],
	paths:{
		jquery : "../libs/jquery/jquery",
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
