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
			"backchart.canvasjs" : "backchart.canvasjs.min"
		  	//...code...
		}
		//...code...
	});
```
*Require the package and Backchart library script your want to use.*
```javascript:
	require(["backchart.canvasjs"], function(){
        require(["canvasjs"],function(backchart){
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
   &lt;!-- Import backbone --&gt;
   &lt;script type=&quot;text/javascript&quot; src=&quot;underscore.min.js&quot;&gt;&lt;/script&gt;
   &lt;script type=&quot;text/javascript&quot; src=&quot;backbone.min.js&quot;&gt;&lt;/script&gt;

   &lt;!-- Import base script --&gt;
   &lt;script type=&quot;text/javascript&quot; src=&quot;bowser/backchart.base.js&quot;&gt;&lt;/script&gt;
   
   &lt;!-- Import CanvasJS and Backchart support --&gt;
   &lt;script type=&quot;text/javascript&quot; src=&quot;canvasjs.min.js&quot;&gt;&lt;/script&gt;
   &lt;script type=&quot;text/javascript&quot; src=&quot;bowser/backchart.canvasjs.js&quot;&gt;&lt;/script&gt;
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
_(Coming soon)_

## Examples
_(Coming soon)_

## Release History
_(Nothing yet)_
