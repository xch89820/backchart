/*********************************************************************************
 *     File Name           :     backchart_test.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-12 13:18]
 *     Last Modified       :     [2014-04-09 06:42]
 *     Description         :     Test module
 **********************************************************************************/

(function(root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        /** dist **/ 
        require(['jquery',"AmCharts.theme.light",'AmCharts.language.zh-CN','backamcharts','backutils'], function($, base) {
            require(["backchart.amcharts"], function(chart){
                factory($, chart.model, chart.collection, chart.view);
            });
        });
        /** debug*/
        /*require(['jquery','backchart.amcharts',"AmCharts.theme.light",'AmCharts.language.zh-CN'], function($, chart) {
            factory($, chart.model, chart.collection, chart.view);
        });*/
    }else{
        factory($,
                root.backchart.amcharts.model, 
                root.backchart.amcharts.collection,
                root.backchart.amcharts.view);
    }
}(this,  function($, _model, _collection, _view) {
    $(function(){
        module("base.module", {
            setup: function() {
                ok( true, "Begin..." );
            }, teardown: function() {
                ok( true, "End.." );
            }
        });

        function generateChartData(categoryField, valueField, number) {
            number = number || 500;
            var chartData = [];
            var firstDate = new Date();
            firstDate.setDate(firstDate.getDate() - 500);

            for (var i = 0; i < number; i++) {
                var newDate = new Date(firstDate);
                newDate.setDate(newDate.getDate() + i);

                var visits = Math.round(Math.random() * 40) - 20;

                var tmpData = {};
                tmpData[categoryField] = newDate;
                tmpData[valueField] = visits;

                chartData.push(tmpData);
            }
            return chartData;
        }


        /*
         * line chart
         */
        /*test mutli-model*/
        var testLineModel = _model.extend({
            categoryField : "date",
            valueField: "value"
        });
        var testLineCollection = new (_collection.extend({
            model: testLineModel 
        }));

        var testLine2Model = _model.extend({
            categoryField : "time",
            valueField: "value"
        });
        var testLine2Collection = new (_collection.extend({
            model:testLine2Model 
        }));

        var testColumnCollection = new (_collection.extend({
            model: testLineModel 
        }));

        var testView = new (_view.extend({
            container : document.getElementById("chart"),
            height : 500
        }))({
            theme:"light",
            "pathToImages": "../libs/charts/amcharts/images/",
            "exportConfig":{
                menuRight: '20px',
                menuBottom: '30px',
                menuItems: [{
                    icon: '../libs/charts/amcharts/images/export.png',
                    format: 'png'  

                }]  
            },
            "categoryAxis": {
                "parseDates": true
            },
            "chartCursor": {
                "cursorPosition": "mouse"
            },
            "chartScrollbar": {
            },
            "legend": {
                "markertype": "circle",
                "position": "bottom",
                textClickEnabled : true
            }
        });
        testView.onCollection(testLineCollection,{
            graph : {
                title : "line1",
                "bullet": "round",
                lineThickness: 2,
                "hideBulletsCount": 50,
                "useLineColorForBulletBorder":true
            }
        });
        testView.onCollection(testLine2Collection,{
            graph : {
                title : "line2",
                "bullet": "round",
                "bulletSize": 6,
                "lineColor": "#d1655d",
                "lineThickness": 2,
                "negativeLineColor": "#637bb6",
                "type": "smoothedLine",
                "hideBulletsCount": 50,
                "useLineColorForBulletBorder":true
            }   
        });
        testView.onCollection(testColumnCollection,{
            graph:{
                "title": "distance",
                "type": "column",
                "fillAlphas":0.8,
                "negativeFillColors": "#637bb6",
                "negativeLineColor": "#637bb6"
            }   
        })
        testView.on("rendered", function(view, el, chart){
            chart.addListener("rendered", function(){
                chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
            });
        })

        testLineCollection.set(generateChartData("date","value"));
        testLine2Collection.set(generateChartData("time", "value"));
        testColumnCollection.set(generateChartData("date","value",300));

        var PCPIModel = _model.extend({
            categoryField : "GeoName",
            valueField : "DataValue",
            titleField : "GeoName",
            parse:function(respo){
                return {
                    GeoName : respo.GeoName,
                    DataValue: parseInt(respo.DataValue,10)
                }
            }
        });

        var PCPICollection = new (_collection.extend({
            model: PCPIModel,
            url: "http://www.bea.gov/api/data",
            parse : function(respo){
                if (respo.BEAAPI){
                    var data = respo.BEAAPI.Results.Data;
                    data.shift();
                    return data;
                }else{
                    return [];
                }
            }
            //comparator : 'DataValue'
        }));

        var PCPIView = new (_view.extend({
            container : document.getElementById("chart2"),
            height : 800
        }))({
            startDuration:-1,
            "type": "pie",
            "theme": "light",
            "legend": {
                "markerType": "circle",
                "position": "bottom"
            },
            "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
            "exportConfig": {
                "menuTop":"0px",
                "menuItems": [{
                    icon: '../libs/charts/amcharts/images/export.png',
                    "format": 'png'
                }]
            }
        });
        PCPIView.onCollection(PCPICollection);

        var PCPIViewColumn = new (_view.extend({
            container : document.getElementById("chart3"),
            height : 800
        }))({
            theme:"light",
            "categoryAxis": {
                "gridPosition": "start"
            },
            rotate : true
        });
        PCPIViewColumn.onCollection(PCPICollection,{
            graph :{
                "type": "column",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2
            }
        });

        PCPICollection.fetch({
            type: "post",
            dataType: "jsonp",
            jsonp:"jsonp",
            data: {
                UserID : "2A28DB6F-5FE7-4A05-8899-D6F4B72C5102",
                method : "GetData",
                datasetname : "RegionalData",
                KeyCode : "POP_SI",
                GeoFIPS : "STATE",
                Year : "2010",
                ResultFormat : "json"
            }
        });

        /*test util*/
        var utilsModel = _model.extend({
            categoryField: "name",
            valueField: "age",  
            parse : function(data){
                return {           
                    name : data.name,
                    age : parseInt(data.age, 10) 
                }   
            }                      
        });
        var utilsCollection = new (_collection.extend({
            model: utilsModel,          
            url: "../datas/test.csv"
        }));

        var utilsView = new (_view.extend({
            container : document.getElementById("chartCSV")
        }))({                      
            theme:"light",
            legend: {              
                markertype: "circle",
                position:"bottom",
                textClickEnabled : true
            },                     
            categoryAxis: {        
               gridPosition: "start",
               axisColor: "#DADADA"
            }                      
        });                        

        utilsView.onCollection(utilsCollection, {
            graph : {              
                "title": "load data from CSV file",    
                "type": "column",
                "fillAlphas":0.8,
                "negativeFillColors": "#637bb6",
                "negativeLineColor": "#637bb6"
            }                      
        });
        utilsCollection.fetch();

        var utilsCollectionTSV = new (_collection.extend({
            model: utilsModel,          
            url: "../datas/test.tsv"
        }));

        var utilsViewTSV = new (_view.extend({
            container : document.getElementById("chartTSV")

        }))({                      
            theme:"light",
            legend: {              
                markertype: "circle",
                position:"bottom",
                textClickEnabled : true
            },                     
            categoryAxis: {        
               gridPosition: "start",
               axisColor: "#DADADA"
            }                      
        });                        

        utilsViewTSV.onCollection(utilsCollectionTSV, {
            graph : {              
                "title": "load data from TSV file",    
                "type": "column",
                "fillAlphas":0.8,
                "negativeFillColors": "#a188bd",
                "negativeLineColor": "#D9C8EC"
            }                      
        });
        utilsCollectionTSV.fetch();
    })
}));
