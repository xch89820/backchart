/*********************************************************************************
 *     File Name           :     main.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-11 18:16]
 *     Last Modified       :     [2014-02-12 23:46]
 *     Description         :     Backchart AMD package load script
 **********************************************************************************/

(function(){
	var _create = function(model, collection, view){
		return {
			model : model,
			collection : collection,
			view : view,
			run : function(callback){
				return callback(model, collection, view);
			}   
		};   
	};
	define("backchart.base",
	   ['./base/model', './base/collection', './base/view'], _create);
	define("backchart.canvasjs",
	   ['./canvasjs/model', './canvasjs/collection', './canvasjs/view'], _create);
})();
