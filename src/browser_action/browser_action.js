;(function(){
	"use strict";
	const w = chrome.extension.getBackgroundPage();
	const WeShareOp = w.WeShareOp;

	// https://chrome.google.com/webstore/detail/we-share-op/nobbmhfbgoapjobjbipoagpahklgkpch 301
	// financedata blocking
	WeShareOp.browserAction(window,function(){

	});

	$.fn.getHiddenOffsetWidth = function () {
		// save a reference to a cloned element that can be measured
		var $hiddenElement = $(this).clone().appendTo('body');

		// calculate the width of the clone
		var width = $hiddenElement.outerWidth();

		// remove the clone from the DOM
		$hiddenElement.remove();

		return width;
	};

	$(document).ready(function(){
		// activate tooltips for all unless disabled element
		$('[data-toggle="tooltip"]:not(:disabled)').tooltip();

		// tooltip for disabled elements
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (_e) {
			//var target = $(_e.target).attr("href");// activated tab
			$('input:disabled, button:disabled').map(function (_k,_v) {
				$(_v).next().width($(_v).outerWidth());
			});
		});
		$('input:disabled, button:disabled').after(function (_e) {
			var _div = $("<div>");
			var _input = $(this);

			_div.css({
				height: _input.outerHeight(),
				width: _input.outerWidth(),
				position: "absolute",
				top: 0
			});

			//_div.css(_input.offset());
			_div.attr("title", _input.attr("title"));
			_div.attr("data-placement", _input.attr("data-placement"));
			_div.tooltip();
			return _div;
		});

		// show modal
		var _wsoModal = $('#wso-modal');
		_wsoModal.on('show.bs.modal', function (e) {
			console.log("show");
			WeShareOp.getHistoricalFinancialData()
				.then(function (_data) {
					var _highStockJson = _data.dataset.data.map(function(d) {
						return [new Date(d[0]).getTime(), d[1],d[2],d[3],d[4]]
					});
					createStockChart(_highStockJson);
			});
		});
		// hide modal
		_wsoModal.on('hidden.bs.modal', function (e) {
			console.log("hide");
		});

		// desable click bubble for year select
		$('select.input-xs').click(function(e){
            e.stopPropagation();
		});

	});

	document.querySelector('#wso-amundiAccess').addEventListener('click',function(){
		WeShareOp.openNewAmundiTab();
	});

	// stock quotes
	/*
	var toPromise = function ($promise) {
		return new Promise(function (resolve, reject) {
			$promise.then(resolve, reject);
		});
	};
	//*/

	//var stockQuotes = Array.apply(null,{length: 2000-2000+1}).map(function(_v,_k) { return 2000+_k; });
	//var dataSources = stockQuotes.map(x=>getOneYearHistoricalData(x))
	//	.map(x=>toPromise($.getJSON(x, null)));

	//console.log(dataSources);

	function getOneYearHistoricalData(_year){
		var sort = '| sort(field="Date", descending="false")';
		var where = 'startDate="'+_year+'-01-01" and endDate="'+_year+'-12-31" and symbol="SOP.PA"';
		var query = 'select * from yahoo.finance.historicaldata where '+where+sort;

		var d2014 = 'http://query.yahooapis.com/v1/public/yql?env=http://datatables.org/alltables.env&format=json&q='+query;
		return d2014;
	}

	function createStockChart(_data){
		/*
		Highcharts.setOptions({
			lang: {
				decimalPoint: ',',
				loading: 'Chargement',
				rangeSelectorFrom: 'Du',
				rangeSelectorTo: 'au',
				months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
				shortMonths: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
				weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
			}
		});
		//*/
		// create the chart
		$('#wso-highchartsContainer').highcharts('StockChart', {
			credits: {
				enabled: false
			},
			exporting: {
				enabled: false
			},
			title: {
				text: ''
			},
			rangeSelector: {
				selected: 1
			},
			series : [{
				name : 'EPA: SOP',
				type: 'candlestick',
				data : _data,
				tooltip: {
					valueDecimals: 2
				},
                id : 'dataseries'
				//turboThreshold:0
			},{
                type : 'flags',
                data : [{
                    x : Date.UTC(2016, 5, 24),
                    title : 'B',
                    text : 'Brexit: UK votes to leave the EU.'
                }, {
                    x : Date.UTC(2016, 4, 18),
                    title : 'S',
                    text : 'Start of the 5 years operation until 2021-05-18.'
                }],
                color: Highcharts.getOptions().colors[0], // same as onSeries
                fillColor: Highcharts.getOptions().colors[0],
                onSeries : 'dataseries',
                shape : 'circlepin',
                width : 16
			}]
		});
	}
	/*
	Promise.all([quandlDataSources]).then(function(_data) {
		//console.log(_data); // [3, 1337, "toto"]
		//_data = _data.map(x=>x.query.results.quote)
		//	.reduce((_p,_c)=>_p.concat(_c));

		console.log(_data);



	});
	//*/

})();