(function($){
	var tag_serial = 0;
	$.here = function(f) {
		var id = "location_tag_" + tag_serial++;
		document.write('<div id="' + id + '"></div>');
		$(function() {
			var tag = $("#" + id);
			f.call(tag);
			tag.remove();
		});
	};
})(jQuery);
