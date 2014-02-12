/*********************************************************************************
 *     File Name           :     view.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-01 10:39]
 *     Last Modified       :     [2014-02-12 23:40]
 *     Description         :     Backchart basic backbone view
 **********************************************************************************/
(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','backbone',"underscore"], function($, Backbone, _) {
			return factory($, Backbone, _);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		_ = require("underscore"),
		Backbone = require("backbone");
		module.exports = factory($, Backbone, _);
	}else{
		var namespaces = name.split("."),
		scope = (root.jQuery || root.ender || root.$ || root || this);
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery),
					(root.Backbone || window.Backbone),
					(root._ || window._)
				):
				{};
		}
	}
}(this, "backchart.base.view", function($, Backbone, _) {
	/*var getObjectName = function(object) { 
	  var funcNameRegex = /function (.{1,})\(/;
	  var results = (funcNameRegex).exec((object).constructor.toString());
	  return (results && results.length > 1) ? results[1] : "";
	  };*/
	/*
	 * Backbone chart base view
	 */
	var chartBaseView = Backbone.View.extend({
		tagName: "div",
		className: "backchart",
		_collectionPrefix : "_cname",
		/*
		 * The element which to render
		 */
		container: null,
		/*
		 * Defined the collections' event listener
		 */
		eventCallback: {
			"default" : "render"
		},
		_getEventCallback: function(eventName){
			var callbackName = this.eventCallback[eventName] || this.eventCallback["default"];
			return callbackName ? this[callbackName] : this.render;
		},
		/*
		 * For saving collections' configure
		 *
		 * _collectionRenderOptions: {
		 * }
		 */
		/*
		 * Store all collections
		 *
		 * collections: {
		 * }
		 */
		/*
		 * The silence flag to suspend responding events from bind collection.
		 * It can be used when you refresh or set many.
		 * Normally ,chart will be rendered many times because sync/set function will create many add events in backbone. you can set it to true for closing auto-render in view.
		 * If you set the flag personally ,you should remember recover it after all operation is done.
		 */
		setSilence: function(flag){
			this._silence = flag;
		},
		/*
		 * Collection is visible or not
		 * @param  bindIdOrCollection
		 *    If it's a string ,will hide the graph by this bindId
		 *    If it's a Collection instance, will hide all of graph from getting data in this collection
		 */
		_setVisible: function(bindIdOrCollection, visible){
			var me = this;
			if (typeof bindIdOrCollection === "string" || bindIdOrCollection instanceof String){
				var bc = me._collectionOptions[bindIdOrCollection];
				if (bc){
					bc.visible = visible;
				}
			}else if (bindIdOrCollection instanceof Backbone.Collection){
				me.eachCollection(function(uid, collection, rdOptions, options){
					if (collection === bindIdOrCollection){
						options.visible = visible;
					}
				});
			}
			me.render();
			return me;
		},
		/*
		 * Hide graph
		 */
		hide: function(bindIdOrCollection){
			return this._setVisible(bindIdOrCollection, false);
		},
		/*
		 * Show graph
		 */
		show: function(bindIdOrCollection){
			return this._setVisible(bindIdOrCollection, true);
		},
		/*
		 * Check a graph visible status
		 */
		isVisibled: function(bindIdOrCollection){
			var me = this;
			if (typeof bindIdOrCollection=== "string" || bindIdOrCollection instanceof String){
				var bc = me._collectionOptions[bindIdOrCollection];
				return bc ? bc.visible : false;
			}else if (bindIdOrCollection instanceof Backbone.Collection){
				var Options = {};
				me.eachCollection(function(uid, collection, renderOption, options){
					if (collection === bindIdOrCollection){
						Options[uid] = options ? options.visible : false;
					}
				});
				return Options;
			}
		},
		/*
		 * Overwrite initialize
		 */
		initialize: function(){
			var me = this;
			me._silence = false;
			Backbone.View.prototype.initialize.apply(this, arguments);

			//initialize collections
			me.collections = {};
			me._collectionOptions = {};
			me._collectionRenderOptions = {};

			//bind on and off events
			this.on("collection.on", function(unid, collection, renderOpt, options){
				if (options.renderAfterOn === true){
					me.render();
				}
			});
			this.on("collection.off", function(){
				me.render();
			});
		},

		/*
		 * Bind collection's event on me
		 */
		__bce: function(unid, evearr, collection){
			var me = this;
			_.each(evearr, function(eve){
				me.listenTo(collection, eve, me._getEventCallback(eve));
				//collection.on(eve+":"+unid, me._getEventCallback(eve));
				//collection.on(eve, me._getEventCallback(eve));
			});
		},
		__ubce: function(unid, evearr, collection){
			var me = this;
			_.each(evearr, function(eve){
				//collection.off(eve+":"+unid, me._getEventCallback(eve));
				collection.off(eve, me._getEventCallback(eve));
			});
		},
		_getBindEvents:function(collection){
			var listenEvents = ['set','add','change','destroy','reset','sort'];
			if (typeof collection._backchart !== "undefined"){
				listenEvents = ['seted','removed','change','destroy','reseted','sort'];
			}
			return listenEvents;
		},
		_bindCollectionEvent: function(unid, collection, options){
			if (options.silence === true){
				return;
			}
			this.__bce(unid, 
					   this._getBindEvents(collection),
					   collection);
		},
		_unbindColletionEvent: function(unid, collection){
			this.__ubce(unid, 
						this._getBindEvents(collection),
						collection);
		},
		_collectionHasBind: function(collection){
			for(var uid in this.collections){
				if (this.collections[uid] === collection){
					return true;
				}
			}
			return false;
		},
		/*
		 * Bind one collection to this view
		 *
		 * This view will bind to the collection's 'set','add','change','destroy','reset','sorted','sync' events, and execute the relevant method which defined in eventCallback.
		 * @param collection
		 * @param renderOptions : render chart options which based what chart library you used.
		 * @param options :
		 *	  bid : Setting a uniq id
		 *    silence : Not bind any event for rendering
		 *    visible : Display or not render this collection,default is true.
		 *			    You can use hide/show function to dynamic control.
		 *    renderAfterOn : Default is false, render chart after binding.
		 * @return the unique Id of this collection
		 *
		 */
		onCollection: function(collection, renderOptions, options){
			renderOptions = renderOptions || {};
			options = options || {};
			var me = this,
			unid =	options.bid || _.uniqueId(me._collectionPrefix);

			if (!collection instanceof Backbone.Collection){
				return;
			}	    
			//bind collection
			if (!me._collectionHasBind(collection)){
				me._bindCollectionEvent(unid, collection, options);
				me.trigger("collection.bindEvent", collection);
			}
			//add collection to my collections
			me.collections[unid] = collection;

			//set render options
			var _rdOptions = _.clone(renderOptions);
			me._collectionOptions[unid] = options;
			me._collectionRenderOptions[unid] = _rdOptions;
			//trigger collection.add event
			me.trigger("collection.on", unid, collection, _rdOptions, options);
			return unid;
		},
		/*
		 * Bind one or more collections
		 * @return a object (key:collection,value:bind ID)
		 */
		onCollections: function(collections, renderOptions, options){
			var me = this;
			if (!collections instanceof Array){
				collections = [collections];
			}
			var bid = {};
			_.each(collections, function(collection){
				bid[collection] = me.onCollection(collection, renderOptions, options);
			});
			return bid;
		},
		/*
		 * Remove one collection from the view
		 * @param uid or collection
		 *     If convey a collection instance, we will remove all bind configure about this collection
		 * @return Collection instance
		 */
		unCollection: function(unid){
			var me = this,
			collection = null;
			if (typeof unid === "string" || unid instanceof String){
				collection = me.collections[unid];
				if (collection){
					delete me.collections[unid];
					var _rdOptions = me._collectionRenderOptions[unid];
					var _options = me._collectionOptions[unid];
					delete me._collectionRenderOptions[unid];
					delete me._collectionOptions[unid];
					/*
					 * If collection not exist in this
					 */
					if (!me._collectionHasBind(collection)){
						me._unbindColletionEvent(unid, collection);
						me.trigger("collection.unbindEvent", collection);
					}
					me.trigger("collection.off", unid, collection, _rdOptions, _options);
				}
				return collection;
			}else if (unid instanceof Backbone.Collection){
				var removeUnids = [];
				collection = unid;
				for(var uid in me.collections){
					if (me.collections[uid] === collection){
						removeUnids.push(uid);
					}
				}
				_.each(removeUnids, function(unid){
					me.unCollection(unid);
				});
				return collection;
			}
		},
		/*
		 * Remove all collection in this view
		 */
		clearCollection: function(){
			var me = this;
			var unids = _.keys(this.collections);
			_.each(unids, function(unid){
				me.unCollection(unid);
			});
			return this;
		},
		/*
		 * A generic iterator function, which can be used to seamlessly iterate collection has binded in this view
		 * 
		 * The eachCollection same as the jQuery.each function.The callback is passed an bind ID, the instance of collection, the render options and the config options.The this always as an collection currently in callback function.
		 */
		eachCollection: function(fn){
			var me = this;
			for(var uid in me.collections){
				fn.call(me.collections[uid], uid, me.collections[uid], me._collectionRenderOptions[uid], me._collectionOptions[uid]);
			}
		},
		/*
		 * Get collections by uid or get uids by collection
		 * @param getBindID:
		 * @return
		 *   If it's Boolean type and false, will return a Array contained all collections binded in this view
		 *   If it's String type ,will return the representative collection.
		 *   If it's a instance of Backbone.Collection, will return a Array contained all bind ID's
		 *   else return a map ,key is collections ,values is uid array corresponded
		 */
		getCollection: function(getBindID){
			var me = this;
			if (typeof getBindID === "boolean" && getBindID === false){
				return _.uniq(_.values(me.collections));
			}else if (typeof getBindID === "string" || getBindID instanceof String){
				return me.collections[getBindID];
			}else if (getBindID instanceof Backbone.Collection){
				var uids = [];
				me.eachCollection(function(uid){
					if (this === getBindID){
						uids.push(uid);
					}
				});
				return uids;
			}else{
				var cols = {};
				me.eachCollection(function(uid){
					if (typeof cols[this] === "undefined"){
						cols[this] = [];
					}
					cols[this].push(uid);
				});
				return cols;
			}
		},
		getOptions: function(getBindID){
			var me = this,
			Options = null;
			if (typeof getBindID === "string" || getBindID instanceof String){
				return me._collectionOptions[getBindID];
			}else if (getBindID instanceof Backbone.Collection){
				Options = [];
				me.eachCollection(function(uid, collection, renderOption, options){
					if (collection === getBindID){
						Options.push(options);
					}
				});
				return Options;
			}else{
				Options = {};
				me.eachCollection(function(uid, collection, renderOption, options){
					if (typeof Options[this] === "undefined"){
						Options[this] = [];
					}
					Options[this].push(options);
				});
				return Options;
			}
		},
		getRenderOptions : function(getBindID){
			var me = this,
			renderOptions = [];
			if (typeof getBindID === "string" || getBindID instanceof String){
				return me._collectionRenderOptions[getBindID];
			}else if (getBindID instanceof Backbone.Collection){
				renderOptions = [];
				me.eachCollection(function(uid, collection, renderOption){
					if (collection === getBindID){
						renderOptions.push(renderOption);
					}
				});
				return renderOptions;
			}else{
				renderOptions = {};
				me.eachCollection(function(uid, collection, renderOption){
					if (typeof renderOptions[this] === "undefined"){
						renderOptions[this] = [];
					}
					renderOptions[this].push(renderOption);
				});
				return renderOptions;
			}

		},
		/*
		 * The default render,all inherit View MUST call this function in front of you code, like this:
		 *   baseview.extend({
		 *    ...
		 *    render : function(){
		 *       var baserender = baseview.prototype.render.apply(me, arguments);
		 *       if (!baserender){
		 *           return false;
		 *       }
		 *    }
		 *    ...
		 *  });
		 *                                           }
		 */
		render : function(){
			var me = this;
			//initialization container
			if (!me.container) {
				return;
			}
			me.$container = $(me.container);
			if (me.$container.is(":hidden")){
				return false;
			}
			if (me._silence === true){
				return false;
			}
			return true;
		},
		/*
		 * All inherit render function should send the unity of event after rendered chart, like this
		 *  baseview.extend({
		 *    ...
		 *    render : function(){
		 *    	//implement rendered
		 *    	baseview.prototype.renderEvents.apply(this, [this, this.el, chart object, renderOptions]);
		 *		...
		 *    }
		 *    ...
		 *  });
		 */   
		renderEvents : function(){
			this.trigger.apply(this, ["view.rendered"].concat(arguments));
			$(this.container).trigger("backchart.rendered",arguments);
		},
		elFillParents : function(){
			this.$el.css({
				width: "100%",
				height:"100%"
			});
		}
	});
	return chartBaseView;
}));
