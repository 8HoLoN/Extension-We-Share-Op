/**
 * @license
 * Copyright (c) 2016 Alexandre REMY
 *
 * https://github.com/8HoLoN/Extension-We-Share-Op
 * @version: 0.0.7 ( June 2016 )
 * @author 8HoLoN / https://github.com/8HoLoN/
 * < 8holon [at] gmail.com >
 */
(function(WeShareOp){
	"use strict";

	/**
	 * Perform an ajax call.
	 *
	 * @param {string} _url The desired url to reach.
	 * @returns {Promise.<XMLHttpRequest>} The promise handling the XMLHttpRequest
	 */
	WeShareOp.prototype.asyncSend = function(_url, options) {
		var _promise = new Promise( function (_resolve, _reject) {
			var _xhr = new XMLHttpRequest();
			_xhr.open("GET", _url, true);
			_xhr.onreadystatechange = function() {
				if (this.readyState == 4) {
					if( this.status >= 200 && this.status < 300 ){
						_resolve(this);
					}else{
						_reject(this);
					}
				}
			};
			_xhr.send();
		});
		return _promise;
	};

	WeShareOp.prototype.getNumberOfUsers = function(){
		return this.asyncSend('https://chrome.google.com/webstore/detail/nobbmhfbgoapjobjbipoagpahklgkpch')
			.then(_xhr=>{
				var _numberOfUsers = _xhr.responseText.match(/UserDownloads:([0-9]*)/)[1];
				//console.log(_numberOfUsers);
				return _numberOfUsers;
			})
			.catch((_e)=>{
				console.log('error : numberOfUsers',_e);
				return null;
			});
	};

	WeShareOp.prototype.getRealTimeFinancialData = function(){
		return this.asyncSend('https://finance.google.com/finance/info?client=ig&q=EPA:SOP')
			.then(_xhr=>{
				var _realTimeFinancialData = _xhr.responseText.substr(4);
				_realTimeFinancialData = JSON.parse(_realTimeFinancialData)[0];
				//console.log(_realTimeFinancialData);
				return _realTimeFinancialData;
			})
			.catch((_e)=>{
				console.log('error : realtime financial data',_e);
				return null;
			});
	};

	WeShareOp.prototype.getFinanceData = function(_ok){
		var that = this;
		
		var xhr = new XMLHttpRequest();
		xhr.open("GET", this.googleHackFinanceProvider, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4  ) {
				if( xhr.status == 200 ){
					var _json = xhr.responseText.match(/{"PriceUpdates":[\s\S]*}/);
					if( _json!==null ){
						console.log(_json[0]);
						var _priceUpdates = JSON.parse(_json[0]);
						_ok(_priceUpdates);
					}else{
						console.log("Google Finance Error");
					}
				}else{
					console.log("Google Error");
				}
			}
		};
		xhr.send();
	};
	
})(WeShareOp);

