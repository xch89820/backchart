/*********************************************************************************
 *     File Name           :     collection.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:46]
 *     Last Modified       :     [2014-02-12 23:44]
 *     Description         :     Backchart collection for canvasJS
 **********************************************************************************/
(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','../base/collection'], function($, base) {
			return factory($, base);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		base = require("../base/collection");
		module.exports = factory($, base);
	}else{
		var namespaces = name.split("."),
		scope = (root.jQuery || root.ender || root.$ || root || this);
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery),
					scope.backchart.base.collection
				):
				{};
		}
	}
}(this, "backchart.canvasjs.collection", function($, basecollection) {
	return basecollection;
}));
