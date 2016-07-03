/**
 * @license
 * Copyright (c) 2016 Alexandre REMY
 *
 * https://github.com/8HoLoN/Extension-We-Share-Op
 * @version: 0.0.7 ( June 2016 )
 * @author 8HoLoN / https://github.com/8HoLoN/
 * < 8holon [at] gmail.com >
 */
(function(_g,WeShareOp){
	"use strict";

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
			_gEBI('wso-investmentValue').value = this.userData.ws2016.investmentValue.toFixed(2)+'€';
			_gEBI('wso-capitalGain').value = this.userData.ws2016.capitalGain.toFixed(2)+'€';
			_gEBI('wso-overallGain').value = this.userData.ws2016.overallGain.toFixed(2)+'€';
		}

		_gEBI("wso-numberOfSharesPurchased").value=this.userData.ws2016.numberOfSharesPurchased;
		_gEBI('wso-numberOfSharesAcquired').value=this.userData.ws2016.numberOfSharesAcquired;
		_gEBI('wso-amountOfInvestment').value=this.userData.ws2016.amountOfInvestment.toFixed(2)+'€';
		_gEBI('wso-showOverallGainOnBadge').checked = this.userData.options.showOverallGainOnBadge;
		_gEBI('wso-amundiLogin').value=this.userData.amundiAccount.login;
		_gEBI('wso-amundiPassword').value=this.userData.amundiAccount.pwd;

		// navigator.onLine
	};

	WeShareOp.prototype.displayBadgeText = function(){
		var _gain = this.userData.ws2016.capitalGain;

		if( this.userData.options.showOverallGainOnBadge === true ){
			_gain = this.userData.ws2016.overallGain;
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

})(this||window,WeShareOp);

