(function ($) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxPrefilter(function (settings, originalsettings, jqXHR) {
        var request_method = settings['type'].toLowerCase();
        if ((request_method === "post" || request_method === "delete") && sameOrigin(settings.url)) {
            jqXHR.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        }
    });


    function extract_modal_settings(element, action) {
        return {
            url: element.attr('href'),
            action: action,
            modal_head: element.attr('data-fm-head'),
            modal_callback: element.attr('data-fm-callback'),
            modal_target: element.attr('data-fm-target')
        };
    }

    function submit_form(form, settings, $modal) {
        var params = {
            url: settings.url,
            type: form.attr('method').toUpperCase(),
            dataType: "json"
        };

        var data;
        if (!window.FormData) {
            // for old browsers - do not support forms with file input fields.
            data = form.serialize();
        } else {
            data = new FormData(form[0]);
            params['processData'] = false;
            params['contentType'] = false;
        }
        params['data'] = data;
        disable_modal_buttons($modal);
        $.ajax(params).success(function (data) {
            process_response_data(data, settings, $modal);
        }).error(function () {
            enable_modal_buttons($modal);
            $modal.find('.modal-body-fm').html(settings.modal_load_error);
        });
        return false;
    }


    function disable_modal_buttons($modal) {
        $modal.find('[type="submit"]').attr('disabled', true);
    }

    function enable_modal_buttons($modal) {
        $modal.find('[type="submit"]').attr('disabled', false);
    }

    function process_response_data(data, settings, $modal) {
        if (data.status === 'ok') {
            $modal.modal("hide");
            if (settings.modal_callback === null || settings.modal_callback === undefined) {
                $.noop();
            } else if (settings.modal_callback === 'reload') {
                window.location.reload();
            } else if (settings.modal_callback === 'redirect') {
                window.location = settings.modal_target;
            } else if (settings.modal_callback === 'remove' || settings.modal_callback === 'delete') {
                $(settings.modal_target).remove();
            } else if (settings.modal_callback === 'append') {
                $(settings.modal_target).append(data.message);
            } else if (settings.modal_callback === 'append-value') {
                $(settings.modal_target).append(data.message.html);
                $(settings.modal_target).val(data.message.value);
                $(settings.modal_target).trigger('change');
            } else if (settings.modal_callback === 'prepend') {
                $(settings.modal_target).prepend(data.message);
            } else if (settings.modal_callback === 'replace') {
                $(settings.modal_target).replaceWith(data.message);
            } else if (settings.modal_callback === 'trigger') {
                $('body').trigger('fm.success', {
                    data: data,
                    options: settings
                });
            } else {
                //debug("unknown action " + data.action);
            }
        } else {
            $modal.find('.modal-body-fm').html(data.message);
            // Also reinstate bindings on submit buttons (in case a
            // form is invalid, subsequent invalid submissions should
            // keep the user on the form):
            var form = $modal.find('form');
            $modal.find('.modal-buttons [type="submit"]').unbind('click').bind("click", function () {
                var form = $modal.find('form');
                submit_form(form, settings, $modal);
            });
            form.on('submit', function () {
                submit_form(form, settings, $modal);
                return false;
            });
            // and set event ready:
            $modal.trigger('fm.ready');
        }
        enable_modal_buttons($modal);
    }

    var methods = {
        init: function (options) {
            return this.each(function () {
                var $this = $(this),
                    settings = $.extend({}, $.fn.modal_fm.defaults, options),
                    $modal = methods.show($(this), settings);
                methods.load_content($this, $modal, settings);
            });
        },
        show: function ($this, settings) {
            settings.modal_css = $this.data('modal-css') || settings.modal_css;
            var modalHTML =
                    '<div role="dialog" aria-hidden="true" class="fm-modal modal">' +
                    '<div class="modal-loader"  data-dismiss="modal">' +
                    '<img class="modal-loader-img" src="/static/fm/img/loading-bars.svg">' +
                    '</div>' +
                    '<div class="modal-dialog modal-content ' + settings.modal_css + '">' +
                    '<div class="modal-wrapper"  >' +
                    '<div class="modal-header" style="display: none;">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                    '<span aria-hidden="true">×</span>' +
                    '</button>' +
                    '<h3 class="modal-title modal-head modal-head-fm">' +
                    '</h3>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-body-fm"></div>' +
                    '</div>' +
                    '</div>',
                $modal = $(modalHTML);

            $modal.on('shown.bs.modal', function () {
                $modal.find(".btn-primary:first").focus();
            });
            $modal.on('hidden.bs.modal', function () {
                $modal.remove();
            });

            // Show the modal
            $('body').append($modal);
            $modal.modal('show');
            return $modal;
        },
        load_content: function ($this, $modal, settings) {

            var settings = extract_modal_settings($this, 'update');
            if (!settings.url) {
                //debug("no URL found to load data from");
                return;
            }
            $.ajax({
                url: settings.url,
                type: "GET",
                dataType: "html",
                error: function () {
                    //debug("error occurred while loading modal body from URL");
                    $modal.find('.modal-body-fm').html(settings.modal_load_error);
                },
                success: function (data) {
                    $modal.find('.modal-body-fm').html(data);
                    var form = $modal.find('form');
                    var modal_buttons = $modal.find('.modal-buttons');
                    modal_buttons.find('[type="submit"]').unbind('click').bind("click", function () {
                        var form = $modal.find('form');
                        submit_form(form, settings, $modal);
                    });
                    form.on('submit', function () {
                        submit_form(form, settings, $modal);
                        return false;
                    });
                    $modal.trigger('fm.ready');
                }
            }).done(function () {
                $modal.find('.modal-head').html(settings.modal_head);
                $modal.find('.modal-header').show();
                $modal.find('.modal-loader').hide();
            });
        },
        update: function (content) {
            // !!!
        }
    };
    $.fn.modal_fm = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.modal_fm');
        }
    };

    $.fn.modal_fm.defaults = {
        modal_css: 'modal-lg',
        modal_wrapper_selector: '.modal-wrapper',
        modal_buttons_selector: '.modal-buttons',
        modal_loader_selector: '.modal-loader',
        modal_load_error: "<div class='modal-body'>Error occurred while loading</div>",
        delegate_target: 'body',
        trigger_event_name: 'fm.success',
        ready_event_name: 'fm.ready'
    };

})(jQuery);

$(function () {
    $(document).on("fm.ready", function (event, obj) {
        $('.modal-body-fm input[type=text]:first').focus();
    });

    $(document).on('click', '.fm-click', function () {
        $(this).modal_fm({
            modal_head_selector: '.modal-head-fm',
            modal_body_selector: '.modal-body-fm'
        });
        return false;
    });
});
