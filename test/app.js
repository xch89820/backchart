/*********************************************************************************
 *     File Name           :     app.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 17:52]
 *     Last Modified       :     [2014-04-10 02:36]
 *     Description         :     Test backchart main app
 **********************************************************************************/
/*
 * requireJs config
 */
require.config({
    baseUrl: "./",
    /*
     * for debug
     */
    /*packages: [
    {
        name: "backchart.base",
        location: "../../src/backchart.base"
    },
    {
        name : "backchart.canvasjs",
        location: "../../src/backchart.canvasjs"
    },
    {
        name : "backchart.amcharts",
        location: "../../src/backchart.amcharts"
    },
    {
        name : "backchart.echarts",
        location: "../../src/backchart.echarts"
    },
    { 
        name: "backchart.utils",
        location: "../../src/backchart.utils"
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

        'echarts' : '../libs/charts/echarts/echarts',
        'echarts/chart/line': '../libs/charts/echarts/echarts',
        'echarts/chart/bar': '../libs/charts/echarts/echarts',
        'echarts/chart/scatter': '../libs/charts/echarts/echarts',
        'echarts/chart/k': '../libs/charts/echarts/echarts',
        'echarts/chart/pie': '../libs/charts/echarts/echarts',
        'echarts/chart/radar': '../libs/charts/echarts/echarts',
        'echarts/config' : '../libs/charts/echarts/echarts',
        'zrender' : '../libs/charts/echarts/zrender',
        'zrender/tool/event' : '../libs/charts/echarts/zrender'
        /*
         * for dist
         */
        ,"backcanvasjs" : "../../dist/backchart.canvasjs",
        "backamcharts" : "../../dist/backchart.amcharts",
        "backecharts" : "../../dist/backchart.echarts",
        "backutils" : "../../dist/backchart.utils"
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

define(["jquery"], function(){
    var headScript = document.getElementsByTagName('script');
    for (var i=headScript.length-1; i>=0; i--){
        if (headScript[i].getAttribute("data-model") === "true"){
            headScript[i].src = headScript[i].getAttribute("data-src");
        }   
    }   
});  
