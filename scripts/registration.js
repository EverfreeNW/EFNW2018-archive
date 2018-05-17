(function ($) {

    window.parseQuery = function parseQuery() {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        var queryParms = {};
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            queryParms[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return queryParms;
    };


    function updateBadgePreview(real_name, fan_name, badge_layout, target) {
        var top_line = '';
        var bottom_line = '';

        if (badge_layout == 'fan_name_on_top') {
            top_line = fan_name;
            bottom_line = real_name;
        } else if (badge_layout == 'real_name_on_top') {
            top_line = real_name;
            bottom_line = fan_name;
        } else if (badge_layout == 'real_name_only') {
            top_line = real_name;
        } else if (badge_layout == 'fan_name_only') {
            top_line = fan_name;
        }

        $('#top_line_preview', target).text(jQuery.trim(top_line));
        $('#bottom_line_preview', target).text(jQuery.trim(bottom_line));
    }

    function checkMissing(form) {
        form = $(form);
        var anyMissing = false;
        var missingTag = $('.missingInputNotice', form);
        $('.required:visible input, .required:visible select', form).each(function (idx, elem) {
            elem = $(elem);
            if (elem.hasClass('select2-search__field')) {
                return;
            }
            if (elem.is('input[type="checkbox"]')) {
                if (!elem.is(':checked')) {
                    elem.addClass('r-attention');
                    elem.focus(function () {
                        $(this).removeClass('r-attention');
                        missingTag.hide();
                    });
                    anyMissing = true;
                }
            } else {
                var val = elem.val();
                if (val == '' || (elem.attr('name') == 'email' && (val.indexOf('@') == -1 || val.indexOf(' ') != -1))) {
                    elem.addClass('r-attention');
                    elem.focus(function () {
                        $(this).removeClass('r-attention');
                        missingTag.hide();
                    });
                    anyMissing = true;
                }
            }
        });
        if (anyMissing) {
            missingTag.show();
            return false;
        }
        missingTag.hide();
        return true;
    }

    function setupAjaxForm(form, ajaxDest, loadingCallback, ajaxCallback) {
        form = $(form);
        form.submit(function () {
            if (!checkMissing(form)) {
                return false;
            }

            var data = new FormData();
            $('input, select, textarea', form).each(function (idx, elem) {
                elem = $(elem);
                if (elem.hasClass('select2-search__field')) {
                    return;
                }

                var name = elem.attr('name');
                if (!name) {
                    return;
                }

                var val = elem.val();
                if (elem.is('input[type="checkbox"]')) {
                    val = elem.is(':checked');
                } else if (elem.is('input[type="file"]')) {
                    val = elem[0].files[0];
                }
                data.append(elem.attr('name'), val);
            });
            var queryParms = window.parseQuery();
            if (queryParms.sandbox == "1") {
                data.append('sandbox', 1);
            }

            if (loadingCallback) {
                loadingCallback();
            }

            $.ajax(ajaxDest, {
                method: 'POST',
                data: data,
                contentType: false,
                processData: false,
                success: ajaxCallback
            });

            return false;
        });
    }

    $(document).ready(function () {
        var queryParms = window.parseQuery();

        if (queryParms['error']) {
            $('.main .badgeTypesPanel, .main .regNowPanel, .main .at-the-door').addClass('hidden');
            $('.main #errorMsg').show();
            $(window).scrollTop($('.main #errorMsg').offset().top);
        } else if (queryParms['confirm']) {
            $('.main .badgeTypesPanel, .main .regNowPanel, .main .at-the-door').addClass('hidden');
            $('.main #confirmDialog').show();
            $('.main #confirmDialog form input[name="uuid"]').val(queryParms['uuid']);
            $(window).scrollTop($('.main #confirmDialog').offset().top);
            $.ajax('/registration/api/getInvoice.ajax.php?uuid=' + queryParms['uuid']).then(function (data) {
                var total = 0.0;
                for (var i = 0; i < data.length; i++) {
                    var lineItem = document.createElement('div');
                    lineItem.className = 'lineitem';
                    var item = document.createElement('div');
                    item.appendChild(document.createTextNode(data[i][0]));
                    lineItem.appendChild(item);
                    var cost = document.createElement('div');
                    cost.appendChild(document.createTextNode('$' + data[i][1].toFixed(2)));
                    total += data[i][1];
                    lineItem.appendChild(cost);
                    $('#confirmDialog #invoice').append(lineItem);
                }
                var totalLine = document.createElement('div');
                totalLine.className = 'totalLineitem';
                var item = document.createElement('div');
                item.appendChild(document.createTextNode('Total'));
                totalLine.appendChild(item);
                var cost = document.createElement('div');
                cost.appendChild(document.createTextNode('$' + total.toFixed(2)));
                totalLine.appendChild(cost);
                $('#confirmDialog #invoice').append(totalLine);
            });
        } else if (queryParms['success']) {
            $('.main .badgeTypesPanel, .main .regNowPanel, .main .at-the-door').addClass('hidden');
            $('.main #successMsg').show();
            $(window).scrollTop($('.main #successMsg').offset().top);
        }

        setupAjaxForm(document.querySelector('#purchaseBadgeForm'), '/registration/api/createPayment.ajax.php', function () {
            document.querySelector('#purchaseBadgeForm .paypal').className = 'paypal hidden';
            document.querySelector('#purchaseBadgeForm .paypal-loading').className = 'paypal-loading';
        }, function (data) {
            if (data['status'] != 'OK') {
                alert(data['error']);
                document.querySelector('#purchaseBadgeForm .paypal').className = 'paypal';
                document.querySelector('#purchaseBadgeForm .paypal-loading').className = 'paypal-loading hidden';
                return;
            }

            if (data.data.redirect[0] == '#') {
                document.querySelector('#purchaseBadgeForm .paypal').className = 'paypal';
                document.querySelector('#purchaseBadgeForm .paypal-loading').className = 'paypal-loading hidden';
            }
            window.location = data.data.redirect;
        });
        $('#purchaseBadgeForm .paypal').click(function () {
            $('#purchaseBadgeForm').submit();
        });
        $('select[name="badge_type"]').change(function () {
            var val = $(this).val();
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
        });
        $('input[name="purchase_friendship_badge"]').change(function () {
            if (this.checked) {
                $('#friendship_badge_entry').slideDown(400);
            } else {
                $('#friendship_badge_entry').slideUp(400);
            }
        });

        var updateBadgePrev = function () {
            var real_name = $('input[name="first_name"]').val() + ' ' + $('input[name="last_name"]').val();
            var fan_name = $('input[name="fan_name"]').val();
            var badge_layout = $('select[name="badge_layout"]').val();
            updateBadgePreview(real_name, fan_name, badge_layout, $('#badge_preview'));
        };
        document.querySelector('select[name="badge_layout"]').onchange = updateBadgePrev;
        document.querySelector('input[name="first_name"],input[name="last_name"]').onkeyup = updateBadgePrev;
        document.querySelector('input[name="fan_name"]').onkeyup = updateBadgePrev;

        var updateFriendBadgePrev = function () {
            var real_name = $('input[name="fb_first_name"]').val() + ' ' + $('input[name="fb_last_name"]').val();
            var fan_name = $('input[name="fb_fan_name"]').val();
            var badge_layout = $('select[name="fb_badge_layout"]').val();
            updateBadgePreview(real_name, fan_name, badge_layout, $('#fb_badge_preview'));
        };
        document.querySelector('select[name="fb_badge_layout"]').onchange = updateFriendBadgePrev;
        document.querySelector('input[name="fb_first_name"],input[name="fb_last_name"]').onkeyup = updateFriendBadgePrev;
        document.querySelector('input[name="fb_fan_name"]').onkeyup = updateFriendBadgePrev;

    });

})
(jQuery);
