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
		this.appName = chrome.runtime.getManifest().name;
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
				amountOfInvestment: null,
				investmentValue: null,
				capitalGain: null,
				overallGain: null
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
		if(this.financeData.value){
			this.userData.ws2016.investmentValue = this.financeData.value*this.userData.ws2016.numberOfSharesAcquired;
			this.userData.ws2016.capitalGain = (this.financeData.value - this.BUYING_PRICE)*this.userData.ws2016.numberOfSharesAcquired;
			this.userData.ws2016.overallGain = (this.financeData.value*this.userData.ws2016.numberOfSharesAcquired)-this.userData.ws2016.amountOfInvestment;
		}

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

			this.computeData();
			this.displayBadgeText();
			if( this._window!==null ){
				this.displayData(this._window);
			}

			
		});
	};

	_g.WeShareOp = WeShareOp;

})(this||window);

