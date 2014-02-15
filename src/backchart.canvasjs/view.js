/*********************************************************************************
 *     File Name           :     view.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:50]
 *     Last Modified       :     [2014-02-15 19:28]
 *     Description         :     Backchart view for canvasJS
 **********************************************************************************/
(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','../backchart.base/view','backbone',"underscore","CanvasJS"], function($, base, Backbone, _, canvasjs) {
			canvasjs = canvasjs || window.CanvasJS;
			return factory($, Backbone, _, base, canvasjs);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		base = require("../backchart.base/view"),
		Backbone = require("backbone"),
		_ = require("underscore"),
		canvasjs = require("CanvasJS") || window.CanvasJS;
		module.exports = factory($, Backbone, _, base, canvasjs);
	}else{
		var namespaces = name.split("."),
			//scope = (root.jQuery || root.ender || root.$ || root || this),
			scope = root || this;
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i],
				ex = scope[p];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery),
					(root.Backbone|| window.Backbone),
					(root._ || window._),
					root.backchart.base.view,
					(root.CanvasJS || window.CanvasJS)
				):
				(ex || {}); 
		}
	}
}(this, "backchart.canvasjs.view", function($, Backbone, _, baseview, CanvasJS) {
	var backchartCanvasJSView = baseview.extend({
		/*
		 * The default render options
		 */
		defaultRenderOptions :{
			type: "column"
		},
		initialize: function(defaultOptions, defaultRenderOptions) {
			baseview.prototype.initialize.apply(this, arguments);
			this.defaultOptions = $.extend(true, {}, this.defaultOptions, defaultOptions);
			this.defaultRenderOptions = $.extend(true, {}, this.defaultRenderOptions, defaultRenderOptions);
		},
		/*
		 * deal the data
		 * return one of the data option for canvasjs
		 */
		transformData: function(collection, renderOptions){
			var me = this,
			dataPoints = [],
			ro = $.extend(true, {}, me.defaultRenderOptions, renderOptions);
			collection.each(function(model) {
				var dataPoint = _.clone(model.attributes);
				dataPoints.push(dataPoint);
			});
			ro.dataPoints = dataPoints;
			return ro;
		},
		render: function(){
			var me = this;
			var rret = baseview.prototype.render.apply(me, arguments);
			if (!rret){
				return false;
			}
			//initialization el id 
			if (!me.el.id){
				me.el.id = _.uniqueId("backchartel");
			}
			var renderOptions = _.clone(me.defaultOptions);
			renderOptions.data = [];
			me.eachCollection(function(uid, collection, renderOption, options){
				if (collection._silence || options.visible === false){
					return;
				}
				renderOptions.data.push(me.transformData(collection, renderOption));
			});

			me.$container.empty().append(me.$el.empty());
			me.elFillParents();
			me.Chart = new CanvasJS.Chart(me.el.id, renderOptions);
			me.Chart.render();

			baseview.prototype.renderEvents.apply(me, [me, me.el, me.Chart, renderOptions]);
		}
	});
	return backchartCanvasJSView;
}));
