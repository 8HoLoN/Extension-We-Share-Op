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

	WeShareOp.prototype.displayI18n = function(_window){
		var _gEBI = _window.document.getElementById.bind(_window.document);
		var _qSA = _window.document.querySelectorAll.bind(_window.document);
		var _gM = chrome.i18n.getMessage;

		var _i18n = ['innerHTML','title','placeholder'];
		_i18n = _i18n.map((_v,_k)=>
			[].concat(_v,_k?['-'+_v,_v[0].toUpperCase()+_v.slice(1)]:['',''])
		);

		_i18n.map((_v,_k)=>{
			Array.from(_qSA('[data-i18n'+_v[1]+']')).map(_el =>{
				_el[_v[0]] = _gM(_el.getAttribute('data-i18n'+_v[1]));
				delete _el.dataset['i18n'+_v[2]];
			});
		});

		//_gEBI("wso-feedback").href = "mailto:"+"8holon"+"@"+"gmail.com?Subject=Feedback";
		//_gEBI("wso-feedback").innerHTML = "8holon"+"&#64;"+"gmail.com";
		_gEBI("wso-feedback").href = "mailto:"+"alexandre.remy.contact"+"@"+"gmail.com?Subject=Feedback";
		_gEBI("wso-feedback").innerHTML = "alexandre.remy.contact"+"&#64;"+"gmail.com";

		_gEBI("wso-version").innerHTML = this.version;
	};

	WeShareOp.prototype.displayData = function(_window){
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
			_gEBI('wso-investmentValue').value = (this.userData["ws2016"].investmentValue+this.userData["ws2017"].investmentValue).toFixed(2)+'€';
			_gEBI('wso-capitalGain').value = (this.userData["ws2016"].capitalGain+this.userData["ws2017"].capitalGain).toFixed(2)+'€';
			_gEBI('wso-overallGain').value = (this.userData["ws2016"].overallGain+this.userData["ws2017"].overallGain).toFixed(2)+'€';
		}

        _gEBI("wso-operationYear").value=this.operationYear;
        _gEBI("wso-numberOfSharesPurchased").innerHTML="";
		for(var _i=0 ; _i<=this.userData["ws"+this.operationYear].numberMaxOfAvailableShares ; _i++){
            var _option = document.createElement("option");
            _option.text = _i;
            _gEBI("wso-numberOfSharesPurchased").add(_option);
		}
		_gEBI("wso-numberOfSharesPurchased").value=this.userData["ws"+this.operationYear].numberOfSharesPurchased;
		_gEBI('wso-numberOfSharesAcquired').value=this.userData["ws"+this.operationYear].numberOfSharesAcquired;
        _gEBI('wso-buyingPrice').value=this.userData["ws"+this.operationYear].buyingPrice.toFixed(2)+'€';
		_gEBI('wso-amountOfInvestment').value=this.userData["ws"+this.operationYear].amountOfInvestment.toFixed(2)+'€';
		_gEBI('wso-showOverallGainOnBadge').checked = this.userData.options.showOverallGainOnBadge;
		_gEBI('wso-amundiLogin').value=this.userData.amundiAccount.login;
		_gEBI('wso-amundiPassword').value=this.userData.amundiAccount.pwd;

		// navigator.onLine
	};

	WeShareOp.prototype.displayBadgeText = function(){
		var _gain = this.userData["ws2016"].capitalGain+this.userData["ws2017"].capitalGain;

		if( this.userData.options.showOverallGainOnBadge === true ){
			_gain = this.userData["ws2016"].overallGain+this.userData["ws2017"].overallGain;
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

})(WeShareOp);

