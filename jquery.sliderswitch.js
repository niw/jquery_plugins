(function($){
	$.fn.slideswitch = function(options) {
		var slideswitch = $($(this)[0]).data("slideswitch");
		if(slideswitch && typeof options == "boolean") {
			slideswitch.toggle(options);
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
				sliderButtonWidth: 150
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

				var sliderPosition;
				var initialSliderPosition = $.map(slider.css("backgroundPosition").split(" "), function(a) {
					return parseFloat(a);
				});
				function updateSliderPosition(position, animate) {
					sliderPosition = position || 0;
					slider.css({backgroundPosition: initialSliderPosition[0] + (sliderPosition + options.sliderButtonWidth - slider.width()) + "px " + initialSliderPosition[1] + "px"});
				}

				var slideswitch = {
					frame: frame,
					slider: slider,
					on: function() {
						return options.leftSideOn ? (sliderPosition == 0) : (sliderPosition != 0);
					},
					toggle: function(b) {
						var x = slider.width() - options.sliderButtonWidth;
						if(typeof b == "boolean" ? b : !this.on()) {
							x = (options.leftSideOn) ? 0 : x;
							placeholder.trigger("on", [this]);
						} else {
							x = (options.leftSideOn) ? x : 0;
							placeholder.trigger("off", [this]);
						}
						updateSliderPosition(x);
					}
				};
				placeholder.data("slideswitch", slideswitch);

				slideswitch.toggle(options.on);

				var capture = false;
				var onmove = function(event) {
					var position = (event.clientX - sliderWrapper.offset().left) + event.data.initialPosition;
					position = Math.min(Math.max(position, 0), slider.width() - options.sliderButtonWidth);
					updateSliderPosition(position);
				};
				frame.bind("mousedown", function(event) {
					var x = event.clientX - sliderWrapper.offset().left;
					if(x > sliderPosition && x < sliderPosition + options.sliderButtonWidth) {
						frame.bind("mousemove", {initialPosition: sliderPosition - x}, onmove);
						capture = true;
						event.preventDefault();
					}
				})
				frame.bind("click", function(event) {
					slideswitch.toggle();
				});
				$(document).bind("mouseup", function(event) {
					if(capture) {
						frame.unbind("mousemove", onmove);
						var x = (slider.width() - options.sliderButtonWidth) / 2;
						if(options.leftSideOn) {
							slideswitch.toggle(sliderPosition < x);
						} else {
							slideswitch.toggle(sliderPosition > x);
						}
						capture = false;
					}
				});
			});

			return $(this);
		}
	};
})(jQuery);
