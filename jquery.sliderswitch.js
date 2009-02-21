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
			}
		});
	}

	$.fn.slideswitch = function(options) {
		var slideswitch = $($(this)[0]).data("slideswitch");
		if(slideswitch && typeof options == "boolean") {
			slideswitch.on(options);
			return $(this);
		} else {
			if(slideswitch) {
				return slideswitch.on();
			}

			var options = $.extend({
				on: false,
				leftSideOn: true,
				frameClass: "slideswitch-frame",
				frameCSS: {
					padding: "10px",
					width: "280px",
					height: "80px",
					background: "url(slideswitch.png) no-repeat 0 0"
				},
				sliderClass: "slideswitch-slider",
				sliderCSS: {
					background: "url(slideswitch.png) no-repeat -300px 0"
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
					.css({position: "absolute"})
					.append(sliderWrapper)
					.appendTo(placeholder);
				var slider = $("<div/>")
					.addClass(options.sliderClass)
					.css(options.sliderCSS)
					.css({
						position: "absolute",
						left: frame.css("paddingLeft"),
						top: frame.css("paddingTop")
					})
					.width(frame.width())
					.height(frame.height())
					.prependTo(placeholder);

				var sliderPosition, sliderAnimating = false;
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
					}
				}

				var slideswitch = {
					frame: frame,
					slider: slider,
					sliderWrapper: sliderWrapper,
					on: function(b, animate) {
						if(typeof b == "undefined") {
							return options.leftSideOn ? (sliderPosition == 0) : (sliderPosition != 0);
						}

						var x = slider.width() - options.sliderButtonWidth;
						if(b) {
							x = (options.leftSideOn) ? 0 : x;
							placeholder.trigger("on", [this]);
						} else {
							x = (options.leftSideOn) ? x : 0;
							placeholder.trigger("off", [this]);
						}
						updateSliderPosition(x, animate);
						return !!b;
					}
				};
				placeholder.data("slideswitch", slideswitch);

				slideswitch.on(options.on);

				var captureStatus = 0;
				var onmove = function(event) {
					var position = (event.clientX - $(this).offset().left) + event.data.initialPosition;
					position = Math.min(Math.max(position, 0), slider.width() - options.sliderButtonWidth);
					updateSliderPosition(position);
					captureStatus = 2;
				};
				sliderWrapper.bind("mousedown", function(event) {
					var x = event.clientX - $(this).offset().left;
					if(x > sliderPosition && x < sliderPosition + options.sliderButtonWidth) {
						sliderWrapper.bind("mousemove", {initialPosition: sliderPosition - x}, onmove);
						event.preventDefault();
					}
					captureStatus = 1;
				})
				$(document).bind("mouseup", function(event) {
					sliderWrapper.unbind("mousemove", onmove);
					if(captureStatus > 1) {
						var x = (slider.width() - options.sliderButtonWidth) / 2;
						if(options.leftSideOn) {
							slideswitch.on(sliderPosition < x);
						} else {
							slideswitch.on(sliderPosition > x);
						}
						capture = false;
					} else if(captureStatus > 0) {
						slideswitch.on(!slideswitch.on(), true);
					}
					captureStatus = 0;
				});
			});

			return $(this);
		}
	};
})(jQuery);
