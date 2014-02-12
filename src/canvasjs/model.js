/*********************************************************************************
 *     File Name           :     model.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:48]
 *     Last Modified       :     [2014-02-12 23:43]
 *     Description         :     Backchart model for canvasJS
 **********************************************************************************/
(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','../base/model'], function($, base) {
			return factory($, base);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		base = require("../base/model");
		module.exports = factory($, base);
	}else{
		var namespaces = name.split("."),
		scope = (root.jQuery || root.ender || root.$ || root || this);
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery),
					scope.backchart.base.model
				):
				{};
		}
	}
}(this, "backchart.canvasjs.model", function($, basemodel) {
	var backchartCanvasJSModel = basemodel.extend({
		/*
		 * If set xField and yFiled, we will use the two name to get x && y value from model
		 *
		 * example :
		 *   xField : "name",
		 *   yFiled : "value",
		 *   labelField : "labelName"
		 */
		_setAlias: function(obj, key, alias){
			if (typeof obj[key] !== "undefined"){
				obj[alias] = obj[key];
			}
		},
		constructor: function(attributes, options){
			options = options || {};
			options.parse = this.parse;
			return basemodel.prototype.constructor.apply(this, [attributes, options]);
		},
		parse: function(response){
			if (this.xField){
				this._setAlias(response, this.xField, 'x');
				if (this.timestamp){
					response['x'] = response['x'] * 1000;
				}
			}
			if (this.yField){
				this._setAlias(response, this.yField, 'y');
			}
			if (this.labelField){
				if (typeof this.labelField === "string"){
					this._setAlias(response, this.labelField, 'label');
				}else if (typeof this.labelField === "function"){
					this.labelField.call(response);
				}
			}
			return response;
		}
	});
	return backchartCanvasJSModel;
}));

