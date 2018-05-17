// Site scripts go here!

// Smooth Scroll (https://css-tricks.com/snippets/jquery/smooth-scrolling/)
$(function() {
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});

// Toggle nav menu
$(".toggle-menu").click(function() {
  $("body").toggleClass("nav-open");
});

// Toggle card bio
function toggleBio(id) {
  $(id).toggleClass("card-bio-visible");
}

// Toggle nav menu dropdown
$(".nav-dropdown > ul > li").click(function () {
    $(".nav-dropdown > ul > li").removeClass("dropdown-is-open");
    $(this).toggleClass("dropdown-is-open");
});

// Set reg value
function setBadgeType(value) {
  $("[name=badge_type]").val(value);

    // lazily copied from register.js
    var val = value;
    if (val == 'foal_prereg') {
        $('#parentInfo').slideDown(400);
    } else {
        $('#parentInfo').slideUp(400);
    }

    if (val == 'sponsor' || val == 'silver' || val == 'gold' || val == 'diamond' || val == 'tree_of_friendship' || val == 'spirit_large' || val == 'spirit_large_intl') {
        $('#shirt_size').slideDown(400);
    } else {
        $('#shirt_size').slideUp(400);
    }

    if (val == 'gold') {
        $('#hotel_nights').slideDown(400);
    } else {
        $('#hotel_nights').slideUp(400);
    }

    if (val == 'silver' || val == 'gold' || val == 'diamond') {
        $('#hotel_size').slideDown(400);
        $('#friendship_badge').slideDown(400);
        $('input[name="purchase_friendship_badge"]').prop('checked', false).prop('disabled', false);
        $('#friendship_badge_entry').slideUp(400);
        $('#purchase_friendship_badge_label, #friendship_badge_desc, #fb_entry_title').show();
        $('#purchase_fim_badge_label, #fim_badge_desc, #fim_entry_label').hide();
    } else if (val == 'tree_of_friendship') {
        $('#hotel_size').slideDown(400);
        $('#friendship_badge').slideDown(400);
        $('input[name="purchase_friendship_badge"]').prop('checked', true).prop('disabled', true);
        $('#friendship_badge_entry').slideDown(400);
        $('#purchase_friendship_badge_label, #friendship_badge_desc, #fb_entry_title').hide();
        $('#purchase_fim_badge_label, #fim_badge_desc, #fim_entry_label').show();
    } else {
        $('#hotel_size').slideUp(400);
        $('#friendship_badge').slideUp(400);
    }
    if (val == 'spirit_small' || val == 'spirit_medium' || val == 'spirit_large' ) {
        $('#shipInfo').slideDown(400);
        $('#ship_state_us').slideDown(400);
        $('#ship_state_exus').slideUp(400);
        $('#ship_state_select').prop('name', 'ship_state');
        $('#ship_state_text').prop('name', '');
    }
    else if (val == 'spirit_large_intl') {
        $('#shipInfo').slideDown(400);
        $('#ship_state_exus').slideDown(400);
        $('#ship_state_us').slideUp(400);
        $('#ship_state_text').prop('name', 'ship_state');
        $('#ship_state_select').prop('name', '');
    }
    else {
        $('#shipInfo').slideUp(400);
        $('#ship_state_select').prop('name', '');
        $('#ship_state_text').prop('name', '');
    }
}