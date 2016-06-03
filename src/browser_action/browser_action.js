;(function(){
	"use strict";
	const w = chrome.extension.getBackgroundPage();
	const WeShareOp = w.WeShareOp;

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
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			var target = $(e.target).attr("href") // activated tab
			$('input:disabled, button:disabled').map(function (_k,_v) {
				$(_v).next().width($(_v).outerWidth());
			});
		});
		$('input:disabled, button:disabled').after(function (e) {
			var d = $("<div>");
			var i = $(this);

			d.css({
				height: i.outerHeight(),
				width: i.outerWidth(),
				position: "absolute",
				top: 0
			});

			//d.css(i.offset());
			d.attr("title", i.attr("title"));
			d.attr("data-placement", i.attr("data-placement"));
			d.tooltip();
			return d;
		});

		// show modal
		$('#wso-modal').on('show.bs.modal', function (e) {
			console.log("show");

			var quandlDataSources = toPromise($.getJSON(quandlUrl, null))
				.then(function(_data){
					//console.log(_data);
					var highStockJson = _data.dataset.data.map(function(d) {
						return [new Date(d[0]).getTime(), d[1],d[2],d[3],d[4]]
					});
					//console.log(highStockJson);
					createStockChart(highStockJson);
				});
			/*
			var target = $(e.target).attr("href") // activated tab
			$('input:disabled, button:disabled').map(function (_k,_v) {
				$(_v).next().width($(_v).outerWidth());
			});
			//*/
		});
		// hide modal
		$('#wso-modal').on('hidden.bs.modal', function (e) {
			console.log("hide");
		});

	});

	document.querySelector('#wso-amundiAccess').addEventListener('click',function(){
		WeShareOp.openNewAmundiTab();
	});

	// stock quotes
	var toPromise = function ($promise) {
		return new Promise(function (resolve, reject) {
			$promise.then(resolve, reject);
		});
	};

	//var stockQuotes = Array.apply(null,{length: 2000-2000+1}).map(function(_v,_k) { return 2000+_k; });
	//var dataSources = stockQuotes.map(x=>getOneYearHistoricalData(x))
	//	.map(x=>toPromise($.getJSON(x, null)));

	//console.log(dataSources);

	var quandlUrl = "https://www.quandl.com/api/v3/datasets/YAHOO/PA_SOP.json?start_date=2000-01-01&end_date=2017-12-31&order=asc&collapse=none&api_key=GRfcs7vGMfgM95sGTqzH";


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
				//turboThreshold:0
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