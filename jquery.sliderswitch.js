(function($){
	$.fn.slideswitch = function(options) {
		var options = $.extend({
			width: 280,
			height: 80,
			sliderButtonWidth: 150,
			frameBorder: 0,
			frameClass: "slideswitch-frame",
			frameCSS: {
				padding: "10px",
				background: "url(slideswitch-frame.png) no-repeat"
			},
			sliderClass: "slideswitch-slider",
			sliderCSS: {
				background: "url(slideswitch-slider.png) no-repeat"
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
				.width(options.width)
				.height(options.height)
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

			var sliderPosition = 0;
			function updateSliderPosition(position) {
				sliderPosition = position || 0;
				slider.css({backgroundPosition: (sliderPosition + options.sliderButtonWidth - slider.width()) + "px 0"});
			}
			updateSliderPosition();

			var onmove = function(event) {
				var position = (event.clientX - sliderWrapper.offset().left) + event.data.initialPosition;
				position = Math.min(Math.max(position, 0), slider.width() - options.sliderButtonWidth);
				updateSliderPosition(position);
			};
			frame.bind("mousedown", function(event) {
				var x = event.clientX - sliderWrapper.offset().left;
				if(x > sliderPosition && x < sliderPosition + options.sliderButtonWidth) {
					frame.bind("mousemove", {initialPosition: sliderPosition - x}, onmove);
				}
				event.preventDefault();
			})
			$(document).bind("mouseup", function(event) {
				frame.unbind("mousemove", onmove);
				var w = slider.width() - options.sliderButtonWidth;
				if(sliderPosition >  w / 2) {
					updateSliderPosition(w);
				} else {
					updateSliderPosition(0);
				}
			});
		});
		return $(this);
	};
	$(function() {
		$(".slideswitch").slideswitch();
	});
})(jQuery);
