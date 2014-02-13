Backchart
======

Backchart is a lightweight JavaScript library based on Backbone and many chart libraries(current just support CanvasJS)
This project support AMD&COMMONJS standard and the aim of this project is make a MVC wrapper for char library and render it easily.

##Install
---
Copy all files in *dist* directory to your JavaScript location.


##Import
---
###AMD (require.js)
*Add package configure in your application's import script.*
```javascript
	require.config({
		packages: [
          {
          	name: 'backchart',
         	main: "main"
          },
		  //...code...
      	]
	//...code...
	});
```
*Require the package and Backchart library script your want to use.*
```javascript
	require(["backchart"], function(){
        require(["backchart.canvasjs"],function(backchart){
			//...write codes...
		});
	});
```

###Browser
*Add Backchart base scripts and Backchart library script your want to use.*
```javascript
   //Import base script
   <script type="text/javascript" src="base/model.js"></script>
   <script type="text/javascript" src="base/collection.js"></script>
   <script type="text/javascript" src="base/view.js"></script>

   //Import CanvasJS and Backchart support
   <script type="text/javascript" src="canvasjs.min.js"></script>
   <script type="text/javascript" src="canvasjs/model.js"></script>
   <script type="text/javascript" src="canvasjs/collection.js"></script>
   <script type="text/javascript" src="canvasjs/view.js"></script>

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
