/*********************************************************************************
 *     File Name           :     model.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:42]
 *     Last Modified       :     [2014-02-12 23:39]
 *     Description         :     Backchart basic backbone model
 **********************************************************************************/
(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','backbone'], function($, Backbone) {
			return factory($, Backbone);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		Backbone = require("backbone");
		module.exports = factory($, Backbone);
	}else{
		var namespaces = name.split("."),
		scope = (root.jQuery || root.ender || root.$ || root || this);
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery), 
				    (root.Backbone || window.Backbone)
				):
				{};
		}
	}
}(this, "backchart.base.model", function($, Backbone) {
	var chartBaseModel = Backbone.Model.extend({});
	return chartBaseModel;
}));
