/*********************************************************************************
 *     File Name           :     collection.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:45]
 *     Last Modified       :     [2014-02-15 19:27]
 *     Description         :     Backchart basic backbone collection
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
		//scope = (root.jQuery || root.ender || root.$ || root || this);
		scope = root || this;
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i],
				ex = scope[p];
			scope = scope[p] = (i === namespaces.length - 1) ? 
				factory(
					(root.jQuery || window.jQuery),
					(root.Backbone || window.Backbone)
				):
				(ex || {});
		}
	}
}(this, "backchart.base.collection", function($, Backbone) {
	var backchartBaseCollection = Backbone.Collection.extend({
		/*
		 * Backchart mark
		 */
		_backchart : true,
		/*parse: function(response) {
		  if (response.success) {
		  return response.msg;
		  }
		  return [];
		  },*/
		initialize: function(){
			this._silence = false;
			return Backbone.Collection.prototype.initialize.apply(this, arguments);
		},
		/*
		 * The silence flag.If set many datas to append, you can set it to true for closing auto-render in view.
		 * If you set the flag, we will not recover it after all operation.
		 */
		setSilence : function(flag){
			this._silence = flag;
		},
		/*
		 * Override collection set ,remove, change, reset "sync" function and add render function after finished.
		 * When these function executing, view will enter the "silence" model and not do any render util end of it for avoiding repeating rendered.
		 */
		set : function(models, options){
			if (this._silence === true){
				return Backbone.Collection.prototype.set.apply(this, arguments);

			}
			this.setSilence(true);
			var result = Backbone.Collection.prototype.set.apply(this, arguments);
			this.setSilence(false);
			this.trigger('seted', this.models, this, options);
			return result;
		},
		remove: function(models, options){
			if (this._silence === true){
				return Backbone.Collection.prototype.remove.apply(this, arguments);
			}
			this.setSilence(true);
			var result = Backbone.Collection.prototype.remove.apply(this, arguments);
			this.setSilence(false);
			this.trigger('removed', this.models, this, options);
			return result;
		},
		reset: function(models, options){
			if (this._silence === true){
				return Backbone.Collection.prototype.reset.apply(this, arguments);
			}
			this.setSilence(true);
			var result = Backbone.Collection.prototype.reset.apply(this, arguments);
			this.setSilence(false);
			this.trigger('reseted', this, options);
			return result;
		}
	});
	return backchartBaseCollection;
}));
