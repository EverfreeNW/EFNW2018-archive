// Simple Image Lightbox
// By msguerra74
// https://codepen.io/msguerra74/pen/idoGp
(function($) {
  
  // Open Lightbox
  $('.open-lightbox').on('click', function(e) {
    e.preventDefault();
    var image = $(this).attr('href');
    $('html').addClass('no-scroll');
    $('body').append('<div class="lightbox-opened"><img src="' + image + '"></div>');
  });
  
  // Close Lightbox
    $('body').on('click', '.lightbox-opened', function() {
    $('html').removeClass('no-scroll');
    $('.lightbox-opened').remove();
  });
  
})(jQuery);
