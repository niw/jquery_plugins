(function($){
	// jquery.backgroundPosition.js, Alexander Farkas, v.1.02
	if(typeof $.fx.step.backgroundPosition == "undefined") {
		function toArray(s){
			s = s.replace(/left|top/g,'0px');
			s = s.replace(/right|bottom/g,'100%');
			s = s.replace(/([0-9\.]+)(\s|\)|$)/g,"$1px$2");
			var m = s.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
			return [parseFloat(m[1],10), m[2], parseFloat(m[3],10), m[4]];
		}
		$.extend($.fx.step, {
			backgroundPosition: function(fx) {
				if (fx.state === 0 && typeof fx.end == 'string') {
					var start = $.curCSS(fx.elem, 'backgroundPosition');
					start = toArray(start);
					fx.start = [start[0], start[2]];
					var end = toArray(fx.end);
					fx.end = [end[0], end[2]];
					fx.unit = [end[1], end[3]];
				}
				var nowPosX = [];
				nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
				nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];           
				fx.elem.style.backgroundPosition = nowPosX[0]+' '+nowPosX[1];
				$(fx.elem).fixBackground();
			}
		});
	}

	$.browser.iphone = /Apple.*Mobile.*Safari/.test(navigator.userAgent);

	$.fn.fixBackground = function() {
		if($.browser.msie) {
			$(this).each(function() {
				var e = $(this);
				var m = e.css("backgroundImage").match(/url\(([^\)]+)\)/);
				var p = $.map(e.css("backgroundPosition").split(" "), function(a) {
					return parseFloat(a);
				});
				var bg = e.data("fixBackground");
				if(!bg) {
					if(!m) {
						return;
					}
					bg = $("<div/>");
					e.data("fixBackground", bg)
						.prepend(bg)
						.css({
							backgroundImage: "none",
							overflow: "hidden",
							position: (e.css("position") == "default") ? "relative" : e.css("position")
						});
				}
				bg.css({	
					position: "absolute",
					width: e.innerWidth() + "px",
					height: e.innerHeight() + "px",
					left: p[0] + "px",
					top: p[1] + "px",
					filter: m ? "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled='true', src='" + m[1] + "')" : bg.css("filter")
				});
			});
		}
		return $(this);
	};

	var script = $("script[src$='jquery.js']")[0];
	var images_path = script ? script.src.replace(/jquery.js/, '../images/') : 'images';
	$.fn.slideswitch = function(options) {
		var slideswitch = $($(this)[0]).data("slideswitch");
		if(slideswitch && typeof options == "boolean") {
			slideswitch.toggle(options);
			return $(this);
		} else {
			if(slideswitch) {
				return slideswitch.on;
			}

			var options = $.extend({
				on: false,
				leftSideOn: true,
				frameClass: "slideswitch-frame",
				frameCSS: {
					padding: "10px",
					width: "280px",
					height: "80px",
					background: "url(" + images_path + "slideswitch.png) no-repeat 0 0"
				},
				sliderClass: "slideswitch-slider",
				sliderCSS: {
					background: "url(" + images_path + "slideswitch.png) no-repeat -300px 0"
				},
				sliderButtonWidth: 150,
				animate: {
					duration: 300
				}
			}, options);

			$(this).each(function() {
				var placeholder = $(this)
					.css({position: "relative"});
				var sliderWrapper = $("<div/>")
					.css({width: "100%", height: "100%"});
				var frame = $("<div/>")
					.addClass(options.frameClass)
					.css(options.frameCSS)
					.css({position: "absolute", overflow: "hidden"})
					.append(sliderWrapper)
					.appendTo(placeholder)
					.fixBackground();
				var slider = $("<div/>")
					.addClass(options.sliderClass)
					.css(options.sliderCSS)
					.css({
						position: "absolute",
						overflow: "hidden",
						left: frame.css("paddingLeft"),
						top: frame.css("paddingTop")
					})
					.width(frame.width())
					.height(frame.height())
					.prependTo(placeholder)
					.fixBackground();

				var sliderPosition;
				var sliderAnimating = false;
				var initialSliderPosition = $.map(slider.css("backgroundPosition").split(" "), function(a) {
					return parseFloat(a);
				});
				function updateSliderPosition(position, animate) {
					if(sliderAnimating) {
						return false;
					}
					sliderPosition = position || 0;
					backgroundPosition = $.map([sliderPosition + options.sliderButtonWidth - slider.width(), 0], function(a, i) {
						return (a + initialSliderPosition[i]) + "px"
					}).join(" ");
					if(animate) {
						slider.animate({backgroundPosition: "(" + backgroundPosition + ")"}, $.extend({
							complete: function() {
								sliderAnimating = false;
							}
						}, options.animate));
						sliderAnimating = true;
					} else {
						slider.css({backgroundPosition: backgroundPosition});
						slider.fixBackground();
					}
				}

				var slideswitch = {
					frame: frame,
					slider: slider,
					sliderWrapper: sliderWrapper,
					on: false,
					toggle: function(b, animate) {
						if(typeof b == "undefined") {
							return on;
						}

						var x = slider.width() - options.sliderButtonWidth;
						if(b) {
							x = (options.leftSideOn) ? 0 : x;
							this.on = true;
							placeholder.trigger("on", [this]);
						} else {
							x = (options.leftSideOn) ? x : 0;
							this.on = false;
							placeholder.trigger("off", [this]);
						}
						updateSliderPosition(x, animate);
						return !!b;
					}
				};
				placeholder.data("slideswitch", slideswitch);

				slideswitch.toggle(options.on);

				var capture;
				var onmove = function(event) {
					if ($.browser.iphone && ((new Date()).getTime() - capture.time < 70)) {
						return;
					} else {
						capture.time = (new Date()).getTime();
					}
					var x = ($.browser.iphone ? event.originalEvent.touches[0].screenX : event.pageX) - $(this).offset().left;
					var delta = x - capture.x;
						$("#debug").text(delta);
					capture.x = x;
					capture.sigma_delta += Math.abs(delta);
					var position = Math.min(Math.max(sliderPosition + delta, 0), slider.width() - options.sliderButtonWidth)
					updateSliderPosition(position);
				};
				sliderWrapper.bind($.browser.iphone ? "touchstart" : "mousedown", function(event) {
					$("#debug").text("");
					var x = ($.browser.iphone ? event.originalEvent.touches[0].screenX : event.pageX) - $(this).offset().left;
					capture = {x: x, time: (new Date()).getTime(), sigma_delta: 0};
					if(x > sliderPosition && x < sliderPosition + options.sliderButtonWidth) {
						sliderWrapper.bind($.browser.iphone ? "touchmove" : "mousemove", onmove);
						event.preventDefault();
					}
				});
				$(document).bind($.browser.iphone ? "touchend" : "mouseup", function(event) {
					sliderWrapper.unbind($.browser.iphone ? "touchmove" : "mousemove", onmove);
					if(capture) {
						$("#debug").text(capture.sigma_delta);
						if(capture.sigma_delta > 10) {
							var x = (slider.width() - options.sliderButtonWidth) / 2;
							if(options.leftSideOn) {
								slideswitch.toggle(sliderPosition < x);
							} else {
								slideswitch.toggle(sliderPosition > x);
							}
							capture = false;
						} else {
							slideswitch.toggle(!slideswitch.on, true);
						}
					}
					capture = undefined;
				});
			});

			return $(this);
		}
	};
})(jQuery);
