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
		$('[data-toggle="tooltip"]:not(:disabled)').tooltip();

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
	});

	document.querySelector('#wso-amundiAccess').addEventListener('click',function(){
		WeShareOp.openNewAmundiTab();
	})

})();