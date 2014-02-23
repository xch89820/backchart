/*! backchart - v0.1.0 - 2014-02-20 *//*! backchart - v0.1.0 - 2014-02-20 */(function(root, name, factory) {
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
}(this, "backchart.base.model", function($, Backbone) {
	var chartBaseModel = Backbone.Model.extend({});
	return chartBaseModel;
}));

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
			/*
			 * To save model options
			 */
			this._modelOptions = {};
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
		},
		/*
		 * Get model's options 
		 * A private method which can get one model bind options 
		 *
		 * return options if existed ,otherwise return null(the model not in the collection)
		 */
		getOptions: function(model){
			var me = this;
			if (model instanceof String || typeof model === "string"){
				model = me.get(model);
			}
			if (model instanceof Backbone.Model){
				for (var i=me.models.length-1; i>=0; i--){
					var m = me.models[i];
					if (m.cid === model.cid){
						if (!me._modelOptions[m.cid]){
						   	me._modelOptions[m.cid] = {};
						}
						return me._modelOptions[m.cid];
					}
				}
			}
			return null;
		},
		_setOptions: function(model, options){
			var me = this;
			if (!!!me._modelOptions[model.cid]){
				me._modelOptions[model.cid] = $.extend({}, options);
			}else{
				me._modelOptions[model.cid] = $.extend(me._modelOptions[model.cid], options);
			}
			return me._modelOptions[model.cid];
		},
		/*
		 * Set model's options
		 * A private method which can set one model bind options
		 *
		 * return the current options of this model
		 */
		setOptions: function(model, options){
			var me = this;
			if (model instanceof String || typeof model === "string"){
				model = me.get(model);
			}
			if (model instanceof Backbone.Model){
				for (var i=me.models.length-1; i>=0; i--){
					var m = me.models[i];
					if (m.cid === model.cid){
						me._setOptions(model, options);
					}
				}
			}
			return null;
		},
		/*
		 * Model in collection is visible or not
		 *
		 * @param model : the model instance or the id(you should set idAttribute first)
		 * @param visible : set true if you want to this model can display, otherwise set false
		 * return the model has hidden
		 */
		_setVisible: function(model, visible){
			var me = this;
			if (model instanceof String || typeof model === "string"){
				model = me.get(model);
			}
			if (model instanceof Backbone.Model){
				for (var i=me.models.length-1; i>=0; i--){
					var m = me.models[i];
					if (m.cid === model.cid){
						me._setOptions(model, {"visible": visible});
						me.trigger("change:visible", visible);
						return model;
					}
				}
			}
			return null;
		},
		hide: function(idOrInstance){
			return this._setVisible(idOrInstance, false);
		},
		show: function(idOrInstance){
			return this._setVisible(idOrInstance, true);
		},
		isVisibled: function(idOrInstance){
			var options = this.getOptions(idOrInstance);
			return options ? 
					(options.visible === false ? false : true):
					true;
		}
	});
	return backchartBaseCollection;
}));

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
		//scope = (root.jQuery || root.ender || root.$ || root || this);
		scope = root || this;
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i],
				ex = scope[p];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery),
					(root.Backbone || window.Backbone),
					(root._ || window._)
				):
				(ex || {});
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
				listenEvents = ['seted','removed','change','destroy','reseted','sort',"change:visible"];
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

(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','../backchart.base/model'], function($, base) {
			return factory($, base);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		base = require("../backchart.base/model");
		module.exports = factory($, base);
	}else{
		var namespaces = name.split("."),
		scope = root || this;
		for (var i=0; i<namespaces.length; i++) {
			var p = namespaces[i],
				ex = scope[p];
			scope = scope[p] = (i === namespaces.length - 1) ?
				factory(
					(root.jQuery || window.jQuery),
					 root.backchart.base.model
				):
				(ex || {});
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


(function(root, name, factory) {
	"use strict";
	if (typeof define === 'function' && define.amd) {
		define(['jquery','../backchart.base/collection'], function($, base) {
			return factory($, base);
		});
	}else if(typeof module !== 'undefined' && module.exports){
		var $ = require("jquery"),
		base = require("../backchart.base/collection");
		module.exports = factory($, base);
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
					root.backchart.base.collection
				):
				(ex || {});
		}
	}
}(this, "backchart.canvasjs.collection", function($, basecollection) {
	return basecollection;
}));

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
				if (collection.isVisibled(model)){
					var dataPoint = _.clone(model.attributes);
					dataPoints.push(dataPoint);
				}
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
			console.log(me);
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
