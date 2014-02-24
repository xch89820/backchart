/*********************************************************************************
 *     File Name           :     collection.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:45]
 *     Last Modified       :     [2014-02-24 11:12]
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
}(this, "backchart.base.collection",function($, Backbone) {   
	/**
	 * Backbone chart base collection 
	 * @module base/collection
	 * @requires jquery
	 * @requires backbone
	 * @this {Backbone.Collection}
	 */
	var exports = Backbone.Collection.extend(
		/** 
		* @lends module:base/collection.prototype 
		*/
		{
		/**
		 * A significant that indicate this class is Backchart collection
		 * @type {boolean}
		 * @static
		 */
		_backchart : true,
        /**
         * initialize
         * @return {Backbone.Collection} collection instance
         */
		initialize: function(){
			this._silence = false;
			return Backbone.Collection.prototype.initialize.apply(this, arguments);
		},
		/**
		 * Set the silence flag.If you want to set lots of data to append, you can set it to true for ban the collection creating seted, removed and reseted event.If you set the flag to true, please recover the flag to false after you finished your work.
         *
         * @param {boolean} flag
         * @return
         */
		setSilence : function(flag){
			this._silence = flag;
		},
		/**
		 * Override collection set function and trigger seted event after processing has done.
		 * When these function processing, collection will enter the "silence" model for avoiding to render chart repeatedly.
		 * Please see [Backbone.Collection#set]{@link http://backbonejs.org/#Collection-set}
		 *
         * @param {(Backbone.Model[]|String[])} models
         * @param {Object} options
		 * @fires module:base/collection#seted
         * @return {Object} result of Backbone.Collection.prototype.set
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
		/**
		* A event triggered after finished to add/set/sync.
		* @event module:base/collection#seted
		* @type {object}
		* @property {boolean} models - Indicates all models affected.
		* @property {boolean} collection - this instance
		* @property {boolean} options - the options of set
		*/
		/**
		 * Override collection remove function and trigger removed event after processing has done.
		 * When these function processing, collection will enter the "silence" model for avoiding to render chart repeatedly.
		 * Please see [Backbone.Collection#remove]{@link http://backbonejs.org/#Collection-remove}
		 *
		 * @param {(Backbone.Model[]|String[])} models
         * @param {Object} options
		 * @fires module:base/collection#removed
         * @return {Object} result of Backbone.Collection.prototype.remove
         */
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
		/**
		* A event triggered after finished to remove.
		* @event module:base/collection#removed
		* @type {object}
		* @property {boolean} models - Indicates all models affected.
		* @property {boolean} collection - this instance
		* @property {boolean} options - the options of set
		*/

		/**
		 * Override collection reset function and trigger reseted event after processing has done.
		 * When these function processing, collection will enter the "silence" model for avoiding to render chart repeatedly.
		 * Please see [Backbone.Collection#reset]{@link http://backbonejs.org/#Collection-reset}
		 *
		 * @param {(Backbone.Model[]|String[])} models
         * @param {Object} options
		 * @fires module:base/collection#reseted
         * @return {Object} result of Backbone.Collection.prototype.reset
         */
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
		/**
		* A event triggered after finished to reset.
		* @event module:base/collection#reseted
		* @type {object}
		* @property {boolean} collection - this instance
		* @property {boolean} options - the options of set
		*/

	});
	return exports;
}));
