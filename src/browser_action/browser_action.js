;(function(){
	"use strict";
	const w = chrome.extension.getBackgroundPage();
	const WeShareOp = w.WeShareOp;

	WeShareOp.browserAction(window,function(){

	});

	document.querySelector('#wso-amundiAccess').addEventListener('click',function(){
		WeShareOp.openNewAmundiTab();
	})

})();