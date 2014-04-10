/*********************************************************************************
 *     File Name           :     backchart_test.js
 *     Created By          :     Jone Casper
 *     Creation Date       :     [2014-02-12 13:18]
 *     Last Modified       :     [2014-04-10 04:47]
 *     Description         :     Test module
 **********************************************************************************/

(function(root, factory) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        /** dist **/ 
        require(['jquery',
            'echarts',
            'echarts/chart/line',
            'echarts/chart/bar',
            'echarts/chart/pie',
            'echarts/chart/radar',
            'echarts/chart/scatter',
            'echarts/chart/k',
            'backecharts',
            'backutils'], function($) {
            require(["backchart.echarts"], function(chart){
                factory($, chart.model, chart.collection, chart.view);
            });
        });
        /** debug*/
        /*require(['jquery',
                'echarts',
                'backchart.echarts',
                'echarts/chart/line',
                'echarts/chart/bar',
                'echarts/chart/pie',
                'echarts/chart/radar',
                'echarts/chart/scatter',
                'echarts/chart/k'], function($, echarts, chart) {
            factory($, chart.model, chart.collection, chart.view);
        });*/
    }else{
        factory($,
                root.backchart.echarts.model, 
                root.backchart.echarts.collection,
                root.backchart.echarts.view);
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

                var visits = Math.round(Math.random() * 1000);

                var tmpData = {};
                tmpData[categoryField] = newDate.getFullYear() + "-" + (newDate.getMonth()+1) + "-" + newDate.getDate();
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
        var testLineModel2 = _model.extend({
            //categoryField : "time",
            //valueField: "val"
        });
        var testLineCollection = new (_collection.extend({
            model: testLineModel 
        }));
        var testLineCollection2 = new (_collection.extend({
            model: testLineModel2 
        }));

        var testView = new (_view.extend({
            container : document.getElementById("chart"),
            height : 500
            //multiValueAxes: true
        }))({
            title: {
                text: 'Test View'
            }
        });
        testView.onCollection(testLineCollection,{
            type: 'line',
            name: "测试"
        });
        testView.onCollection(testLineCollection2,{
            type: 'line',
            name: "测试2",
            categoryField : "time",
            valueField: "val"
        });
        testLineCollection.set(generateChartData("date","value",90));
        testLineCollection2.set(generateChartData("time","val",90));

        /*test pie*/
        var testPieModel = _model.extend({
            categoryField : "name",
            valueField: "value"
        });
        var testPieCollection = new (_collection.extend({
            model: testPieModel 
        }));
        var testPieView = new (_view.extend({
            container : document.getElementById("chart2")
        }))({
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            title: {
                text: 'Test Pie View'
            }
        });
        testPieView.onCollection(testPieCollection, {
            type: "pie",
            name: "饼图",
            radius : '55%'
        });
        testPieCollection.set(generateChartData("name", "value", 10));

        /*test bar*/
        var testBarCollection = new (_collection.extend({
            model: testPieModel 
        }));
        var testBarCollection2 = new (_collection.extend({
            model: testPieModel 
        }));
        var testBarView = new (_view.extend({
            container : document.getElementById("chart3")
        }))({
            title: {
                text: 'Test Bar View'
            }
        });
        testBarView.onCollection(testBarCollection, {
            type: "bar",
            name: "柱状图1"
        });
        testBarView.onCollection(testBarCollection2, {
            type: "bar",
            name: "柱状图2"
        });
        testBarCollection.set(generateChartData("name", "value", 10));
        testBarCollection2.set(generateChartData("name", "value", 10));

        /*test radar*/
        var testRadarModel = _model.extend({});
        var testRadarCollection = new (_collection.extend({
            model: testRadarModel 
        }));
        var testRadarCollection2 = new (_collection.extend({
            model: testRadarModel 
        }));
        var testRadarView = new (_view.extend({
            container : document.getElementById("chartCSV")
        }))({
            title: {
                text: 'Test Radar View'
            }
        });
        testRadarView.onCollection(testRadarCollection, {
            type: "radar",
            name: "放射图1"
        });
        testRadarView.onCollection(testRadarCollection2, {
            type: "radar",
            name: "放射图2"
        });
        testRadarCollection.set([
             { design: 10 },
             { code: 45 },
             { test: 10 },
             { review: 30 }
        ]);
        testRadarCollection2.set([
             { design: 120 },
             { code: 300 },
             { test: 20 },
             { review: 200 }
        ]);




    })
}));
