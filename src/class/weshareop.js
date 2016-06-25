/**
 * @license
 * Copyright (c) 2016 Alexandre REMY
 *
 * https://github.com/8HoLoN/Extension-We-Share-Op
 * @version: 0.0.7 ( June 2016 )
 * @author 8HoLoN / https://github.com/8HoLoN/
 * < 8holon [at] gmail.com >
 */
(function(_g){
	"use strict";

	function WeShareOp(){
		this.version = chrome.runtime.getManifest().version;
		this.appName = 'We Share Op.';
		this.alarmName = 'WeShareOp';
		this.updateDelayInSecond = 61;/* 10 600 */

		Object.defineProperty( this, 'BUYING_PRICE', {
			value: 101.62,
			writable: false,
			enumerable: true,
			configurable: true
		});

		this.userData = {
			ws2016 : {
				numberOfSharesPurchased: 1,
				numberOfSharesAcquired: null,
				amountOfInvestment: null
			},
			options:{
				showOverallGainOnBadge: false
			},
			amundiAccount: {
				login: '',
				pwd: ''
			}
		};

		this._window = null;

		this.googleHackFinanceProvider = 'https://www.google.fr/async/finance_price_updates?dfsl=1&async=lang:fr,country:fr,rmids:%2Fg%2F1hbvm6lxm,_fmt:jspb&ei=rM4LV9XhAcG6arSluYgO&yv=2';
		
		this.financeData = {
			shareName:'',
			date:'',
			value:'',
			changePoint:'',
			changePercent:''
		};

		// amundi
		this.amundiTabId = null;
		this.amundiHomeUrl = 'https://www.amundi-ee.com/part/home_login';
		this.amundiLoggingUrl = 'https://www.amundi-ee.com/part/home_priv_synth';

		// local language
		this.currentLocale = chrome.i18n.getMessage("@@ui_locale");
		console.log(this.currentLocale);
		//this.init();
	}

	WeShareOp.prototype.init = function(){
		//this.updateFinanceData();
		chrome.alarms.clearAll((_wasCleared)=>{
			chrome.alarms.onAlarm.addListener((_alarm)=>{
				if(_alarm.name===this.alarmName){
					this.updateFinanceData();
				}
			});
			chrome.alarms.create(this.alarmName, {periodInMinutes:this.updateDelayInSecond/60});
		});
		chrome.tabs.onRemoved.addListener((_tabId, _removeInfo)=>{
			if(this.amundiTabId===_tabId){
				this.amundiTabId=null;
			}
		});

		chrome.storage.local.set({wsoVersion:this.version},()=>{
			console.log(chrome.runtime.lastError);
			//chrome.runtime.id

			chrome.storage.local.get(['wsoUserData','wsoVersion'],(_items)=>{
				try{
					this.loadData(_items);
				}catch (e){
					console.log(e);
				}
				this.saveData();
				this.computeData();
				this.updateFinanceData();
			});
		});

	};

	/**
	 * Load user data from chrome local storage.
	 * @param {string} str - The string containing two comma-separated numbers.
	 * @return {undefined}
	 */
	WeShareOp.prototype.loadData = function(_items){
		console.log(_items);
		console.log(sjcl.decrypt("wso"+chrome.runtime.id,_items.wsoUserData));
		var _userData = JSON.parse(sjcl.decrypt("wso"+chrome.runtime.id,_items.wsoUserData));
		this.userData.ws2016.numberOfSharesPurchased = _userData.ws2016.numberOfSharesPurchased;
		this.userData.amundiAccount.login = _userData.amundiAccount.login;
		this.userData.amundiAccount.pwd = _userData.amundiAccount.pwd;
		this.userData.options.showOverallGainOnBadge = _userData.options.showOverallGainOnBadge;
	};

	WeShareOp.prototype.computeData = function(){
		this.userData.ws2016.numberOfSharesAcquired = this.userData.ws2016.numberOfSharesPurchased * 2;
		this.userData.ws2016.amountOfInvestment = this.userData.ws2016.numberOfSharesPurchased * this.BUYING_PRICE;
		if(this.currentLocale==='fr'){// csg/crds
			this.userData.ws2016.amountOfInvestment*=1.08;
		}
	};

	WeShareOp.prototype.displayI18n = function(_window){
		var _gEBI = _window.document.getElementById.bind(_window.document);
		var _gM = chrome.i18n.getMessage;

		_gEBI("wso-statsTabLabel").innerHTML = _gM("statsTabName");
		_gEBI("wso-sharesValueLabel").innerHTML = _gM("sharesValueLabel");
		_gEBI("wso-sharesValue").title = _gM("sharesValueTitle");
		_gEBI("wso-investmentValueLabel").innerHTML = _gM("investmentValueLabel");
		_gEBI("wso-investmentValue").title = _gM("investmentValueTitle");
		_gEBI("wso-capitalGainLabel").innerHTML = _gM("capitalGainLabel");
		_gEBI("wso-capitalGain").title = _gM("capitalGainTitle");
		_gEBI("wso-overallGainLabel").innerHTML = _gM("overallGainLabel");
		_gEBI("wso-overallGain").title = _gM("overallGainTitle");

		_gEBI("wso-sharesTabLabel").innerHTML = _gM("sharesTabLabel");
		_gEBI("wso-numberOfSharesPurchasedLabel").innerHTML = _gM("numberOfSharesPurchasedLabel");
		_gEBI("wso-numberOfSharesPurchased").title = _gM("numberOfSharesPurchasedTitle");
		_gEBI("wso-numberOfSharesAcquiredLabel").innerHTML = _gM("numberOfSharesAcquiredLabel");
		_gEBI("wso-numberOfSharesAcquired").title = _gM("numberOfSharesAcquiredTitle");
		_gEBI("wso-buyingPriceLabel").innerHTML = _gM("buyingPriceLabel");
		_gEBI("wso-buyingPrice").title = _gM("buyingPriceTitle");
		_gEBI("wso-amountOfInvestmentLabel").innerHTML = _gM("amountOfInvestmentLabel");
		_gEBI("wso-amountOfInvestment").title = _gM("amountOfInvestmentTitle");

		_gEBI("wso-optionsTabLabel").innerHTML = _gM("optionsTabLabel");
		_gEBI("wso-showOverallGainOnBadgeLabel").innerHTML = _gM("showOverallGainOnBadgeLabel");

		_gEBI("wso-amundiAccountTabLabel").innerHTML = _gM("amundiAccountTabLabel");
		_gEBI("wso-amundiLoginLabel").innerHTML = _gM("amundiLoginLabel");
		_gEBI("wso-amundiLogin").placeholder = _gM("amundiLoginPlaceholder");
		_gEBI("wso-amundiPasswordLabel").innerHTML = _gM("amundiPasswordLabel");
		_gEBI("wso-amundiPassword").placeholder = _gM("amundiPasswordPlaceholder");

		_gEBI("wso-amundiAccess").innerHTML = _gM("amundiAccess");
		
		_gEBI("wso-infoTabLabel").innerHTML = _gM("infoTabLabel");
		_gEBI("wso-openingLabel").innerHTML = _gM("openingLabel");
		_gEBI("wso-openingDays").innerHTML = _gM("openingDays");
		_gEBI("wso-schedulesLabel").innerHTML = _gM("schedulesLabel");
		_gEBI("wso-preopeningLabel").innerHTML = _gM("preopeningLabel");
		_gEBI("wso-sessionLabel").innerHTML = _gM("sessionLabel");
		_gEBI("wso-preclosingLabel").innerHTML = _gM("preclosingLabel");
		_gEBI("wso-exceptLabel").innerHTML = _gM("exceptLabel");
		_gEBI("wso-goodFriday").innerHTML = _gM("goodFriday");
		_gEBI("wso-easterMonday").innerHTML = _gM("easterMonday");
		_gEBI("wso-1stMay").innerHTML = _gM("1stMay");
		_gEBI("wso-25thDecember").innerHTML = _gM("25thDecember");
		_gEBI("wso-26thDecember").innerHTML = _gM("26thDecember");
		
		_gEBI("wso-aboutTabLabel").innerHTML = _gM("aboutTabLabel");
		
		//_gEBI("wso-feedback").href = "mailto:"+"8holon"+"@"+"gmail.com?Subject=Feedback";
		//_gEBI("wso-feedback").innerHTML = "8holon"+"&#64;"+"gmail.com";
		_gEBI("wso-feedback").href = "mailto:"+"alexandre.remy.contact"+"@"+"gmail.com?Subject=Feedback";
		_gEBI("wso-feedback").innerHTML = "alexandre.remy.contact"+"&#64;"+"gmail.com";

		_gEBI("wso-version").innerHTML = this.version;

		_gEBI("wso-versionLabel").innerHTML = _gM("versionLabel");
		_gEBI("wso-links").innerHTML = _gM("links");
		_gEBI("wso-reviews").innerHTML = _gM("reviews");
		_gEBI("wso-feedbackLabel").innerHTML = _gM("feedbackLabel");
		
		_gEBI("wso-loading").innerHTML = _gM("loading");
		_gEBI("wso-closeModal").innerHTML = _gM("closeModal");

	};

	WeShareOp.prototype.displayData = function(_window){// todo move compute to the right method
		var _gEBI = _window.document.getElementById.bind(_window.document);
		if(this.financeData.value){
			//_gEBI('wso-statsDate').innerHTML = '('+this.financeData.date.toISOString()+')';
			_gEBI('wso-statsDate').innerHTML = '('+
				moment(this.financeData.date)
					.local()
					.locale(this.currentLocale)
					.format('LLLL')
				+')';
			_gEBI('wso-sharesValue').value = this.financeData.value.toFixed(2)+'€';
			_gEBI('wso-investmentValue').value = (this.financeData.value*this.userData.ws2016.numberOfSharesAcquired).toFixed(2)+'€';
			_gEBI('wso-capitalGain').value = ((this.financeData.value - this.BUYING_PRICE)*this.userData.ws2016.numberOfSharesAcquired).toFixed(2)+'€';
			_gEBI('wso-overallGain').value = ((this.financeData.value*this.userData.ws2016.numberOfSharesAcquired)-this.userData.ws2016.amountOfInvestment).toFixed(2)+'€';
		}

		_gEBI("wso-numberOfSharesPurchased").value=this.userData.ws2016.numberOfSharesPurchased;
		_gEBI('wso-numberOfSharesAcquired').value=this.userData.ws2016.numberOfSharesAcquired;
		_gEBI('wso-amountOfInvestment').value=this.userData.ws2016.amountOfInvestment.toFixed(2)+'€';
		_gEBI('wso-showOverallGainOnBadge').checked = this.userData.options.showOverallGainOnBadge;
		_gEBI('wso-amundiLogin').value=this.userData.amundiAccount.login;
		_gEBI('wso-amundiPassword').value=this.userData.amundiAccount.pwd;

		// navigator.onLine
	};

	/**
	 * Save user data to chrome local storage.
	 * @return {undefined}
	 */
	WeShareOp.prototype.saveData = function(){
		chrome.storage.local.set({wsoUserData:sjcl.encrypt("wso"+chrome.runtime.id,JSON.stringify(this.userData),{ks:256})}, function (){
			console.log('saveError',chrome.runtime.lastError);
			//chrome.runtime.id
		});
	};

	WeShareOp.prototype.browserAction = function(_window){
		//_window.close();
		var that=this;
		console.log("browserAction");
		this._window = _window;

		_window.addEventListener("unload", function(){
			that._window = null;
		});

		this.displayI18n(_window);
		this.displayData(_window);
		this.updateFinanceData();

		var _gEBI = _window.document.getElementById.bind(_window.document);
		var _gM = chrome.i18n.getMessage;
		_gEBI('wso-amundiLogin').addEventListener('keyup',function(){
			that.userData.amundiAccount.login = this.value;
			that.saveData();
		});
		_gEBI('wso-amundiPassword').addEventListener('keyup',function(){
			that.userData.amundiAccount.pwd = this.value;
			that.saveData();
		});
		_gEBI('wso-numberOfSharesPurchased').addEventListener('change',function(){
			that.userData.ws2016.numberOfSharesPurchased = +this.options[this.selectedIndex].value;
			that.computeData();
			that.saveData();
			that.displayData(_window);
			that.displayBadgeText();
		});
		_gEBI('wso-showOverallGainOnBadge').addEventListener('change',function(){
			that.userData.options.showOverallGainOnBadge = this.checked;
			that.saveData();
			that.displayBadgeText();
		});


		this.getNumberOfUsers()
			.then(_numberOfUsers=>{
				if(_numberOfUsers!==null){
					_gEBI('wso-numberOfUsers').innerHTML = _gM('numberOfUsers',_numberOfUsers);
				}
			});
	};

	WeShareOp.prototype.loginOnAmundiTab = function(){
		chrome.tabs.executeScript(this.amundiTabId, {
			runAt:'document_end',
			code: ';(function(){'+
				redirect.toString()+
				"redirect('"+this.amundiLoggingUrl+"',{"+
					"method:'POST',"+
					"target:'_self',"+
					"data:{"+
					"	mail:"+this.userData.amundiAccount.login+","+
					"	password:"+this.userData.amundiAccount.pwd+","+
					"	connection:''"+
					"}"+
				"});"+
				"return 0xff08;"+
			"})();"}, function(_res){
			// _res[0]===0xff08
			// console.log('test',_res);
		});
	};

	WeShareOp.prototype.openNewAmundiTab = function(){
		var that = this;

		if( this.amundiTabId === null ){
			chrome.tabs.create({ url: this.amundiHomeUrl },(_tab)=>{
				this.amundiTabId = _tab.id;
				this.loginOnAmundiTab();
				console.log(that.amundiTabId);

			});
		}else{// TODO check last error in chrome callback (ie close before execute script)
			/*
			chrome.tabs.get(this.amundiTabId, function(_tab){
			if (chrome.runtime.lastError) {
			console.log(chrome.runtime.lastError.message);
			} else {
				// Tab exists
			}
				console.log('tab_',_tab);
			});
			//*/

			chrome.tabs.get(this.amundiTabId, (tab)=>{
				chrome.windows.update(tab.windowId, {focused:true}, (_window)=>{

				});
				console.log(tab);
				chrome.tabs.update(that.amundiTabId, {url:this.amundiHomeUrl,highlighted:true}, (_tab)=>{
					this.loginOnAmundiTab();
				});

			});

		}


	};

	/**
	 * Perform an ajax call.
	 *
	 * @param {string} _url The desired url to reach.
	 * @returns {Promise.<XMLHttpRequest>} The promise handling the XMLHttpRequest
	 */
	WeShareOp.prototype.send = function(_url, options) {
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
		return this.send('https://chrome.google.com/webstore/detail/nobbmhfbgoapjobjbipoagpahklgkpch')
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
		return this.send('https://finance.google.com/finance/info?client=ig&q=EPA:SOP')
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

	WeShareOp.prototype.getPriceUpdates = function(_callback){
		var that = this;

		this.getRealTimeFinancialData()
			.then(_financialData=>{
				console.log(_financialData);
				that.financeData.shareName = _financialData.t;
				//that.financeData.date = new Date(_financialData.lt_dts);
				that.financeData.date = moment.tz(_financialData.lt_dts.slice(0,-1),"Europe/Paris").format();
				that.financeData.value = +_financialData.l;
				that.financeData.changePoint = _financialData.c;
				that.financeData.changePercent = _financialData.cp;
				_callback();
			})
			.catch((_e)=>{
				console.log('error : parse realtime financial data',_e);
				return null;
			});
		/*
		this.getFinanceData(function(_financeData){
			//console.log(that);
			that.financeData.shareName = _financeData.PriceUpdates[0][0][2];
			that.financeData.date = _financeData.PriceUpdates[0][0][3];
			//that.financeData.value = _financeData.PriceUpdates[0][0][1][0];
			that.financeData.value = _financeData.PriceUpdates[0][0][1][8][1];
			that.financeData.changePoint = _financeData.PriceUpdates[0][0][1][1];
			that.financeData.changePercent = _financeData.PriceUpdates[0][0][1][2];
			

			// console.log(_financeData);
			// console.log('valeur',_financeData.PriceUpdates[0][0][1][0]);// valeur
			// console.log('variation',_financeData.PriceUpdates[0][0][1][1]);// différence (variation en point) depuis la dernière ouverture
			// console.log('variation%',_financeData.PriceUpdates[0][0][1][2]);// derivée (variation en %) depuis la dernière ouverture
			// console.log('sens',_financeData.PriceUpdates[0][0][1][3]);// 1 positive / 0 negative
			// console.log('name',_financeData.PriceUpdates[0][0][2]);// action name
			// console.log('date',_financeData.PriceUpdates[0][0][3]);// date
            //
			// console.log('accurateValue',_financeData.PriceUpdates[0][0][1][8][1]);// valeur
			// console.log('accurateVariation',_financeData.PriceUpdates[0][0][1][9][1]);// différence (variation en point) depuis la dernière ouverture
			// console.log('accurateVariation%',_financeData.PriceUpdates[0][0][1][10][1]);// derivée (variation en %) depuis la dernière ouverture

			_callback();
		});
		//*/
	};

	// http://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-context-inside-a-callback
	WeShareOp.prototype.updateFinanceData = function(_callback){
		this.getPriceUpdates(()=>{
			console.log('priceUpdate',new Date());

			this.displayBadgeText();
			if( this._window!==null ){
				this.displayData(this._window);
			}

			
		});
	};

	WeShareOp.prototype.displayBadgeText = function(){
		var _gain = (this.financeData.value - this.BUYING_PRICE)*this.userData.ws2016.numberOfSharesAcquired;

		if( this.userData.options.showOverallGainOnBadge === true ){
			_gain = (this.financeData.value*this.userData.ws2016.numberOfSharesAcquired)-this.userData.ws2016.amountOfInvestment;
		}

		var _sign = '-';
		if( _gain > 0 ){
			_sign = '+';
			chrome.browserAction.setBadgeBackgroundColor({color:'#05bb05'});
		}else{
			chrome.browserAction.setBadgeBackgroundColor({color:'#881111'});
		}
		_gain = Math.abs(_gain);
		// ok for this.financeData.value [0;274]
		//var _badgeText = Math.abs(_gain).toFixed(0)+' €';
		var _badgeText = Math.abs(_gain).toFixed( Math.max(3-_gain.toFixed(2).split('.')[0].length,0) );
		chrome.browserAction.setBadgeText({text:''+ _badgeText });

		chrome.browserAction.setTitle({title : this.appName+' ('+_sign+_gain.toFixed(2)+'€)' });
	};

	_g.WeShareOp = new WeShareOp();

})(this||window);

