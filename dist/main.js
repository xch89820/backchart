/*! Backchart - v0.1.0 - 2014-02-13
* https://github.com/xch89820/backchart
* Copyright (c) 2014 xu.chenhui; Licensed MIT */
!function(){var a=function(a,b,c){return{model:a,collection:b,view:c,run:function(d){return d(a,b,c)}}};define("backchart.base",["./base/model","./base/collection","./base/view"],a),define("backchart.canvasjs",["./canvasjs/model","./canvasjs/collection","./canvasjs/view"],a)}();