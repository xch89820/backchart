/*********************************************************************************
 *     File Name           :     app.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 17:52]
 *     Last Modified       :     [2014-03-09 19:06]
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
		name: "backchart.base"
	},
	{
		name : "backchart.canvasjs"
	},
	{
		name : "backchart.amcharts"
	}
	],*/
	paths:{
		backbone : "../libs/utils/backbone-min",
		underscore : "../libs/utils/underscore-min",
		moment : "../libs/utils/moment.min",
		excanvas : "../libs/utils/excanvas",
		CanvasJS : "../libs/charts/canvasjs/canvasjs",
		"AmCharts.core" : "../libs/charts/amcharts/amcharts",
		"AmCharts.serial" : "../libs/charts/amcharts/serial",
		"AmCharts.pie" : "../libs/charts/amcharts/pie",
		"AmCharts.radar" : "../libs/charts/amcharts/radar",
		"AmCharts.funnel" : "../libs/charts/amcharts/funnel",
		"AmCharts.gauge" : "../libs/charts/amcharts/gauge",
		"AmCharts.xy" : "../libs/charts/amcharts/xy",
        "AmCharts.theme.light" : "../libs/charts/amcharts/themes/light",
        "AmCharts.theme.dark" : "../libs/charts/amcharts/themes/dark",
        "AmCharts.theme.chalk" : "../libs/charts/amcharts/themes/chalk",
        "AmCharts.theme.patterns" : "../libs/charts/amcharts/themes/patterns",
        "AmCharts.language.zh-CN" : "../libs/charts/amcharts/language/zh-CN",
		/*
		 * for dist
		 */
        "backcanvasjs" : "../dist/backchart.canvasjs",
        "backamcharts" : "../dist/backchart.amcharts"
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
		},
		"AmCharts.core": {
            deps : [],
			exports: 'AmCharts'
		},
	    "AmCharts.serial": ["AmCharts.core"],
		"AmCharts.pie": ["AmCharts.core"],
		"AmCharts.radar": ["AmCharts.core"],
		"AmCharts.funnel": ["AmCharts.core"],
		"AmCharts.gauge": ["AmCharts.core"],
		"AmCharts.xy": ["AmCharts.core"],
		"AmCharts.theme.light": ["AmCharts.core"],
		"AmCharts.theme.dark": ["AmCharts.core"],
		"AmCharts.theme.dark": ["AmCharts.core"],
		"AmCharts.theme.patterns": ["AmCharts.core"],
        "AmCharts.language.zh-CN" : ["AmCharts.core"]
	}
});

define("AmCharts", ["AmCharts.core","AmCharts.serial","AmCharts.pie","AmCharts.radar"], function(AmCharts){
    return AmCharts;
})

define("jquery", function(){
	return jQuery;
});
/*
 * test
 */
$(function(){
	require(["./backchart_amcharts_test.js"]);
});
