Backchart
======

Backchart is a lightweight JavaScript library based on Backbone and many chart libraries(current just support CanvasJS)
This project support AMD&COMMONJS standard and the aim of this project is make a MVC wrapper for char library and render it easily.

##Install
---
If you async loading your modules by AMD or CommonJS ,please copy all js files in *dist* directory but not *browser* directory to your library location.
Otherwise, please copy all js files in *browser* directory to your target.

##Import
---
###AMD (require.js)
*Add package configure in your `path` config, exmaple(load CanvasJS):*
```javascript
	require.config({
		path :{
			backbone : "you/backbone/path",
        	underscore : "you/underscore/path",

			//import the chart library you want to use.
        	CanvasJS : "../libs/charts/canvasjs/canvasjs",

			//import the backchart to support your chart library
			"backchart" : "backchart.canvasjs"
		  	//...code...
		}
		//...code...
	});
```
*Require the package and Backchart library script your want to use.*
```javascript:
	require(["backchart"], function(){
        require(["backchart.canvasjs"],function(backchart){
			var _model = backchart.model,
				_collection = backchart.collection,
				_view = backchart.view;
			//...write codes...
		});
	});
```

###Browser
*Add Backchart base scripts and Backchart library script your want to use.*
```html
   <!-- Import backbone -->
   <script type="text/javascript" src="underscore.min.js"></script>
   <script type="text/javascript" src="backbone.min.js"></script>

   <!-- Import CanvasJS and Backchart support -->
   <script type="text/javascript" src="canvasjs.min.js"></script>
   <script type="text/javascript" src="browser/backchart.canvasjs.js"></script>
```
*The global namespace which named `backchart` will be created if load script succeed.*
```javascript
   //Get MVC object
   (function(window){
		var _model = backchart.canvasjs.model,
			_collection = backchart.canvasjs.collection,
			_view = backchart.canvasjs.view;

		//...write codes...
   })(window);
```
## Documentation


## Examples


## Release History
0.1.0 Released
