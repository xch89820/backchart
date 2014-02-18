/*********************************************************************************
*     File Name           :     main.js
*     Created By          :     Jone Casper
*     Creation Date       :     [2014-02-17 23:04]
*     Last Modified       :     [2014-02-18 17:19]
*     Description         :     document for Backbone
**********************************************************************************/
(function(window){
	var backchartModel = backchart.canvasjs.model,
	    backchartCollection = backchart.canvasjs.collection,
		backchartView = backchart.canvasjs.view;
	//The simple chart
	$(function(){
		$("#simple-example").height($("#simple-example-code").height());
		var myView = new (backchartView.extend({
			container : document.getElementById("simple-example")
		}));
		var myCollection = new backchartCollection;
		myView.onCollection(myCollection, {
		    type: "column",
			showInLegend: true,
			legendText: "The column"
		});
		myView.onCollection(myCollection, {
			type: "line",
			showInLegend: true,
   			legendText: "The line"			
		});
		myCollection.set([
			{ x: 10, y: 97800, label: "UAE"},
			{ x: 20, y: 267017,  label: "Saudi Arabia" },
			{ x: 30, y: 116000,  label: "Russia"},
			{ x: 40, y: 297571, label: "Venezuela"},
			{ x: 50, y: 154580,  label: "Iran"},
			{ x: 60, y: 175200,  label: "Canada"},
			{ x: 70, y: 20682,  label: "US"},
			{ x: 80, y: 20350,  label: "China"}
		]);
	});

	$(function(){
		$("#bea-example").height($("#bea-example-code").height());
		//filter United States
		var BEAFView = new (backchartView.extend({
			container : document.getElementById("bea-example2")
		}))({
			legend:{
				fontSize: 13
			},
			axisX:{
				interval : 1,
				labelFontSize: 13
			},
			axisY:{
				labelFontSize: 13
			}
		});

		//Define the view inherit to backchart.canvasjs.view;
		var BEAView = new (backchartView.extend({
			container : document.getElementById("bea-example")
		}))({
			legend:{
				fontSize: 13
			},
			axisX:{
				interval : 1,
				labelFontSize: 13
			},
			axisY:{
				labelFontSize: 13
			}
		});
		
		/**
		 * Define the model to deal with each row of data
		 * You should covered each data received to your chart can accept.
		 * We used CanvasJS, so add label,legendText and y in my data
		 **/
		var BEAModel = backchartModel.extend({
			parse : function(respo){
				console.log(respo);
				return {
					label : respo.GeoName,
					legendText: respo.GeoName,
					y : parseInt(respo.DataValue,10)
				}
			}
		});
		//Define collection and set the URL and the name of dataset in the result
		var BEACollection = new (backchartCollection.extend({
			model: BEAModel,
			url: "http://www.bea.gov/api/data",
			parse : function(respo){
				//remove United States average 
				return respo.BEAAPI ? respo.BEAAPI.Results.Data : [];
			}
		}));
		//Bind collection to view
		BEAView.onCollection(BEACollection, {
			type: "bar",
			showInLegend: true
		});

		//do some filter after 
		BEACollection.on("sync", function(){
			var usModel = BEACollection.findWhere({label: "United States"});
			if (usModel){
				var usAverage = usModel.get("y");
				var aboveAvg = BEACollection.filter(function(model){
					return model.get("y") > usAverage;
				});
				BEAFView.onCollection(new backchartCollection(aboveAvg), {
					type: "bar",
					showInLegend: true
				},{
					renderAfterOn : true
				});
			}
		});

		//Fetch data
		BEACollection.fetch({
			dataType: "jsonp",
			jsonp:"jsonp",
			data: {
				UserID : "2A28DB6F-5FE7-4A05-8899-D6F4B72C5102",
				method : "GetData",
				datasetname : "RegionalData",
				KeyCode : "PCPI_CI",
				GeoFIPS : "STATE",
				Year : "2011",
				ResultFormat : "json"
			}
		});

	});
})(window)


