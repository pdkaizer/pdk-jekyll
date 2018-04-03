(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

/* Wait for DOM to be ready */
$(function() {
  
	// Detect resize event
	$(window).smartresize(function () {
		// Set photoset image size
		$('.photoset-row').each(function () {
			var $pi    = $(this).find('.photoset-item'),
				  cWidth = $(this).parent('.photoset').width();

			// Generate array containing all image aspect ratios
			var ratios = $pi.map(function () {
				return $(this).find('img').data('org-width') / $(this).find('img').data('org-height');
			}).get();

			// Get sum of widths
			var sumRatios = 0, sumMargins = 0,
          minRatio  = Math.min.apply(Math, ratios);
			for (var i = 0; i < $pi.length; i++) {
				sumRatios += ratios[i]/minRatio;
			};
      
      $pi.each(function (){
        sumMargins += parseInt($(this).css('margin-left')) + parseInt($(this).css('margin-right'));
      });

			// Calculate dimensions
			$pi.each(function (i) {
				var minWidth = (cWidth - sumMargins)/sumRatios;
				$(this).find('img')
          .height(Math.floor(minWidth/minRatio))
					.width(Math.floor(minWidth/minRatio) * ratios[i]);
			});
		});
	});
});

/* Wait for images to be loaded */
$(window).load(function () {

	// Store original image dimensions
	$('.photoset-item img').each(function () {
      $(this)
        .data('org-width', $(this)[0].naturalWidth)
        .data('org-height', $(this)[0].naturalHeight);
	});

  $(window).resize();
});
