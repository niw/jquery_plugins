(function($) {
	$.throbber = function(state, options) {
		var script = $("script[src$='jquery.js']")[0];
		var base_options = $.extend({
			zIndex: 100,
			path: script ? script.src.replace(/jquery.js/, '../images/') : 'images',
			nImages: 12
		}, options || {});
		var tag = $("<div/>")
			.css($.extend({
				width: "50px",
				height: "50px",
				position: "absolute",
				zIndex: base_options.zIndex
			}, base_options.css || {}))
			.hide();
		$(document.body).append(tag);
		var images = [], spinning;
		for(var i=0; i<base_options.nImages; i++) {
			var img = new Image();
			img.src = base_options.path + "/throbber_" + (i+1) + ".png";
			images[i] = img;
		}
		$.throbber = function(state, options) {
			var options = $.extend({
				speed: 0.1
			}, options || {});
			if(typeof state == "undefined") {
				return !!spinning;
			}
			if(!spinning && state) {
				var i = 0;
				spinning = setInterval(function() {
					// TODO make sure Image#copmlete is OK in IE, Firefox and Safari
					if(images[i].complete) {
						var url = base_options.path + "/throbber_" + (i+1) + ".png";
						if($.browser.msie) {
							tag.css("filter", "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', sizingMethod='scale', src='" + url + "')");
						} else {
							tag.css("background", "url(" + url + ")");
						}
						if(++i >= images.length) {
							i = 0;
						}
					}
				}, options.speed * 1000);
				// TODO adjusting the position when resizing window
				tag.css({
						left: ($(window).scrollLeft() + ($(window).width() - tag.width()) / 2) + "px",
						top: ($(window).scrollTop() + ($(window).height() - tag.height()) / 2) + "px"
					})
					.show();
			} else if(spinning && !state) {
				clearInterval(spinning);
				spinning = undefined;
				tag.hide();
			}
			return tag;
		};
		return $.throbber(state, options);
	};
})(jQuery);
