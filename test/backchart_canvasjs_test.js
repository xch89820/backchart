/*********************************************************************************
 *     File Name           :     backchart_test.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-12 13:18]
 *     Last Modified       :     [2014-02-15 19:31]
 *     Description         :     Test module
 **********************************************************************************/

(function(root, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		/*define(['jquery','backchart'], function($, base) {
			require(["backchart.canvasjs"], function(chart){
				factory($, chart.model, chart.collection, chart.view);
			});
		});*/
        define(["backchart.canvasjs"], function(chart){
            factory($, chart.model, chart.collection, chart.view);
        });
		/*}else if(typeof module !== 'undefined' && module.exports){
		  var $ = require("jquery"),
		  base = require("");
		  module.exports = factory($, base);
	*/}else{
   		
			factory($,
				root.backchart.canvasjs.model, 
				root.backchart.canvasjs.collection,
				root.backchart.canvasjs.view);
	}
}(this,  function($, _model, _collection, _view) {
		module("base.module", {
			setup: function() {
				ok( true, "Begin..." );
			}, teardown: function() {
				ok( true, "End.." );
			}
		});

		var PCPIModel = _model.extend({
			parse : function(respo){
				return {
					label : respo.GeoName,
					legendText: respo.GeoName, 
					y : parseInt(respo.DataValue,10)
				}
			}
		});
		var PCPICollection = new (_collection.extend({
			model: PCPIModel,
			url: "http://www.bea.gov/api/data",
			parse : function(respo){
				if (respo.BEAAPI){
					return respo.BEAAPI.Results.Data;
				}else{
					return [];
				}
			},
			comparator : 'y'
		}));
		var PCPIView = new (_view.extend({
			container : document.getElementById("chart"),
            height : 500
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
        PCPIView.onCollection(PCPICollection,{
            type:"bar",
            showLegend : true
        });

		PCPICollection.fetch({
			dataType: "jsonp",
			jsonp:"jsonp",
			data: {
				UserID : "2A28DB6F-5FE7-4A05-8899-D6F4B72C5102",
				method : "GetData",
				datasetname : "RegionalData",
				KeyCode : "PCPI_CI",
				GeoFIPS : "STATE",
				Year : "2010",
				ResultFormat : "json"
			}
		});
}));
