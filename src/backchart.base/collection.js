/*********************************************************************************
 *     File Name           :     collection.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 10:45]
 *     Last Modified       :     [2014-04-05 03:20]
 *     Description         :     Backchart basic backbone collection
 **********************************************************************************/
(function(root, name, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'underscore', 'backbone',
               "backchart.utils/loader", 
               "backchart.utils/logger"], 
               function($, _,  Backbone,  loader) {
                   return factory($, _, Backbone, loader);
               });
    }else if(typeof module !== 'undefined' && module.exports){
        var $ = require("jquery"),
        Backbone = require("backbone"),
        _ = require("underscore");
        require("backchart.utils/logger");
        var loader = require("backchart.utils/loaler");
        module.exports = factory($, _, Backbone, loader);
    }else{
        var namespaces = name.split("."),
        scope = root || this;
        for (var i=0; i<namespaces.length; i++) {
            var p = namespaces[i],
            ex = scope[p];
            scope = scope[p] = (i === namespaces.length - 1) ? 
                factory(
                    (root.jQuery || window.jQuery),
            (root._|| window._),
            (root.Backbone || window.Backbone),
            root.backchart.utils.loader
            ):
                (ex || {});
        }
    }
}(this, "backchart.base.collection",function($, _,Backbone, loader) { 
    var root = this;
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
        constructor: function(){
            var me = this;
            /**
             * Set the parsing file format.
             * The default filetype is "json", it means that use the backbone json parser to serialized data from server.
             * If the filed not set or undefined, we will identify the corresponding format by the content-type field in HTTP head firstly.If we can not detect the format by HTTP head, we will guess the format by file extension.
             * If all ways are failed, a warning wil be throwed and continue to work.
             * Currently, the following formats are supported:
             * Filetype                      extension  MIME  
             * csv  Comma Separated Value    (*.csv)    text/csv
             * tsv  Tab Separated Value      (*.tsv)    text/tsv
             * xls  Microsoft Execl          (*.xls)    application/vnd.ms-excel
             * xlsx Microsoft Execl          (*.xlsx)   application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
             * @type {object}
             */
            this.fileType = null;
            /**
             * Set the options of parser
             * @property {number} sheetIndex The index of sheets should be as the source 
             * @property {string} sheetName The name of sheets should be as the source
             * @property {string} type Default value is binary, you can set 'base64' if the data returned has be encoded by base64
             * @type {object}
             */
            this.parseOptions = $.extend({
                //we only save the first sheet when pasre the xls/xlsx file 
                sheetIndex : 0
            },me.parseOptions);
            
            var _bkAjax = Backbone.ajax;
            /**
             * override the old Backbone.ajax
             * @param {Object} options
             */
            this._BackboneAjax = function(options){
                if (options.type !== "POST" && options.type !== "GET"){
                    return _bkAjax.apply(Backbone.$, arguments);
                }
                var filetype = me.fileType;
                if (!filetype && options.url){
                    var split = options.url.split(".");
                    var extname = split.length > 0 ? split.pop() : "";
                    switch(extname.toLowerCase()){
                        case "csv" : filetype = "csv";break;
                        case "tsv" : filetype = "tsv";break;
                        case "xls" : filetype = "xls";break;
                        case "xlsx" : filetype = "xlsx";break;
                    }
                }
                if (filetype !== "json" && typeof options.dataType !== "undefined"){
                    options.dataType = "text";
                }
                var success = options.success;
                options.success = function(resp, testStatus, jqXHR){
                    if (!filetype){
                        var contentType = jqXHR.getResponseHeader("content-type") || "";
                        if (contentType === "text/csv"){
                            filetype = "csv";
                        }else if (/\/tsv/.test(contentType)){
                            filetype = "tsv";
                        }else if (/vnd\.ms\-excel/.test(contentType)){
                            filetype = "xls";
                        }else if (/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/.test(contentType)){
                            filetype = "xlsx";
                        }
                    }
                    if (filetype){
                        loader(["backchart.utils/jszip/jszip","backchart.utils/codepage/cptable"],    
                            function(JSZip){
                            root.JSZip = JSZip;
                            loader("backchart.utils/parser" ,function(Parser){
                            switch (filetype){
                                case "csv" : resp = Parser.parseCSV(resp);break;
                                case "tsv" : resp = Parser.parseTSV(resp);break;
                                case "xls" : resp = Parser.parseXLS(resp, me.parseOptions);break;
                                case "xlsx" : resp = Parser.parseXLSX(resp, me.parseOptions);break;
                            }
                            return success.call(me, resp, testStatus, jqXHR);
                            });
                        });
                    }else{
                        resp = typeof resp === "string" ? $.parseJSON(resp): resp;
                        return success.call(me, resp, testStatus, jqXHR);
                    }
                };
                return _bkAjax.call(Backbone.$, options);
            };
            Backbone.Collection.apply(this, arguments);
        },
        /**
         * Override the default sync.
         */
        sync: function(){
            var _bkAjax = Backbone.ajax;
            Backbone.ajax = this._BackboneAjax;
            var retSync = Backbone.sync.apply(this, arguments);
            Backbone.ajax = _bkAjax;
            return retSync;
        },
        /**
         * initialize
         * @return {Backbone.Collection} collection instance
         */
        initialize: function(){
            this._silence = false;
            //The model options
            this._modelOptions = {};

            return Backbone.Collection.prototype.initialize.apply(this, arguments);
        },
        /**
         * Set the silence flag.If you want to set lots of data to append, you can set it to true for ban the collection creating seted, removed and reseted event.If you set the flag to true, please recover the flag to false after you finished your work.
         *
         * @param {boolean} flag
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
            var soptions = $.extend({silent:true}, options);
            if (this._silence === true){
                return Backbone.Collection.prototype.set.apply(this, [models, soptions]);
            }
            this.setSilence(true);
            var result = Backbone.Collection.prototype.set.apply(this, [models, soptions]);
            this.setSilence(false);
            this.trigger('seted', this.models, this, options);
            return result;
        },
        /**
         * A event triggered after finished to add/set/sync.
         * @event module:base/collection#seted
         * @type {object}
         * @property {boolean} models indicates all models affected.
         * @property {boolean} collection this instance
         * @property {boolean} options the options of set
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
            var soptions = $.extend({silent:true}, options);
            if (this._silence === true){
                return Backbone.Collection.prototype.remove.apply(this, [models, soptions]);
            }
            this.setSilence(true);
            var result = Backbone.Collection.prototype.remove.apply(this, [models, soptions]);
            this.setSilence(false);

            //remove model options
            for(var i=models.length; i>=0; i--){
                var md = models[i];
                if (this._modelOptions[md]){
                    delete this._modelOptions[md];
                }
            }
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
        },
        /**
         * A event triggered after finished to reset.
         * @event module:base/collection#reseted
         * @type {object}
         * @property {boolean} collection - this instance
         * @property {boolean} options - the options of set
         */
        /**
         * Get model's options 
         * A private method which can get one model bind options 
         *
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
        /**
         * Set model's options
         * A private method which can set one model bind options
         *
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
         * model in collection is visible or not
         *
         * @param model : the model instance or the id(you should set idattribute first)
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
                        me._setoptions(model, {"visible": visible});
                        me.trigger("change:visible", visible);
                        return model;
                    }
                }
            }
            return null;
        },
        hide: function(IdOrInstance){
            return this._setVisible(IdOrInstance, false);
        },
        show: function(IdOrInstance){
            return this._setVisible(IdOrInstance, true);
        },
        isVisibled: function(IdOrInstance){
            var options = this.getOptions(IdOrInstance);
            return options ? 
                (options.visible === false ? false : true):
                true;
        }
    });
    return exports;
}));
