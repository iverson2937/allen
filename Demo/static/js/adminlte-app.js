/*!
 * Author: Abdullah A Almsaeed
 * Date: 4 Jan 2014
 * Description:
 *      This file should be included in all pages
 !**/

/*
 * Global variables. If you change any of these vars, don't forget 
 * to change the values in the less files!
 */
var left_side_width = 220; //Sidebar width in pixels

$(function () {
    "use strict";

    //Enable sidebar toggle
    $("[data-toggle='offcanvas']").click(function (e) {
        e.preventDefault();

        //If window is small enough, enable sidebar push menu
        if ($(window).width() <= 992) {
            $('.row-offcanvas').toggleClass('active');
            $('.left-side').removeClass("collapse-left");
            $(".right-side").removeClass("strech");
            $('.row-offcanvas').toggleClass("relative");
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
    });

    //Add hover support for touch devices
    $('.btn').bind('touchstart', function () {
        $(this).addClass('hover');
    }).bind('touchend', function () {
        $(this).removeClass('hover');
    });

    //Activate tooltips
    $("[data-toggle='tooltip']").tooltip({html: true});

    /*
     * Add collapse and remove events to boxes
     */
    $("[data-widget='collapse']").click(function () {
        //Find the box parent        
        var box = $(this).parents(".box").first();
        //Find the body and the footer
        var bf = box.find(".box-body, .box-footer");
        if (!box.hasClass("collapsed-box")) {
            box.addClass("collapsed-box");
            //Convert minus into plus
            $(this).children(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
            bf.slideUp();
        } else {
            box.removeClass("collapsed-box");
            //Convert plus into minus
            $(this).children(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
            bf.slideDown();
        }
    });

    /*
     * ADD SLIMSCROLL TO THE TOP NAV DROPDOWNS
     * ---------------------------------------
     */
    $(".navbar .menu").slimscroll({
        height: "200px",
        alwaysVisible: false,
        size: "3px"
    }).css("width", "100%");

    /*
     * INITIALIZE BUTTON TOGGLE
     * ------------------------
     */
    $('.btn-group[data-toggle="btn-toggle"]').each(function () {
        var group = $(this);
        $(this).find(".btn").click(function (e) {
            group.find(".btn.active").removeClass("active");
            $(this).addClass("active");
            e.preventDefault();
        });

    });

    $("[data-widget='remove']").click(function () {
        //Find the box parent        
        var box = $(this).parents(".box").first();
        box.slideUp();
    });

    /* Sidebar tree view */
    $(".sidebar .treeview").tree();

    /* 
     * Make sure that the sidebar is streched full height
     * ---------------------------------------------
     * We are gonna assign a min-height value every time the
     * wrapper gets resized and upon page load. We will use
     * Ben Alman's method for detecting the resize event.
     * 
     **/
    function _fix() {
        //Get window height and the wrapper height
        var height = $(window).height() - $("body > .header").height() - ($("body > .footer").outerHeight() || 0);
        $(".wrapper").css("min-height", height + "px");
        var content = $(".wrapper").height();
        //If the wrapper height is greater than the window
        if (content > height)
        //then set sidebar height to the wrapper
            $(".left-side, html, body").css("min-height", content + "px");
        else {
            //Otherwise, set the sidebar to the height of the window
            $(".left-side, html, body").css("min-height", height + "px");
        }
    }

    //Fire upon load
    _fix();
    //Fire when wrapper is resized
    $(".wrapper").resize(function () {
        _fix();
        fix_sidebar();
    });

    //Fix the fixed layout sidebar scroll bug
    fix_sidebar();

    /*
     * We are gonna initialize all checkbox and radio inputs to 
     * iCheck plugin in.
     * You can find the documentation at http://fronteed.com/iCheck/
     */

    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        var that = this;
        $(document).on('focusin.modal', function (e) {
            // Fix bug modal not working with select2
        });
    };

    $(document.body).on('show.bs.modal', function () {
        $(window.document).find('html').addClass('modal-open');
    });

    $(document.body).on('hidden.bs.modal', function () {
        if ($('.modal').length == 0) {
            $(window.document).find('html').removeClass('modal-open');
        }
    });

    $('[data-toggle="wysihtml5"]').each(function (index, el) {
        var $this = $(el);
        $this.wysihtml5();
        $this.data("wysihtml5").editor.setValue($this.text());
    });

    var goldcap_init = function () {
        $('[data-action="delete-item-row"]').each(function (index, el) {
            var $this = $(el),
                val = $this.data('value'),
                target = $($this.data('target')),
                this_tr = $($this.parents('tr:first'));
            if (val) {
                $(this_tr).addClass('hidden');
            }
        });


        if ($.fn.bootstrapSwitch) {
            $("input[data-toggle=switch]").bootstrapSwitch({});
        }

        $("input[type='checkbox']:not(.simple, [data-toggle=switch]), input.icheck[type=radio]").iCheck({
            checkboxClass: 'icheckbox_minimal',
            radioClass: 'iradio_minimal'
        });

        if ($.fn.select2) {
            $('[data-toggle=select2]').select2();
        }

        if ($.fn.datepicker) {
            $('.dateinput').datepicker({
                todayBtn: true,
                format: "yyyy-mm-dd",
                forceParse: false,
                autoclose: true,
                todayHighlight: true
            });
        }

        if ($.fn.editable) {
            $.fn.editable.defaults.mode = 'inline';
            $.fn.editable.defaults.error = function () {
                return "Server Error";
            };

            $.fn.editable.defaults.success = function (response, newValue) {
                if (response.status == 'error') return response.error;
            };

            $.fn.editable.defaults.select2 = {
                inputclass: 'input-sm',
                width: 200,
                placeholder: 'Select User',
                allowClear: true
            };

            $('[data-xeditable=xeditable]').editable();

            $('[data-xeditable-auto-open]').on('hidden', function (e, reason) {
                if (reason === 'save' || reason === 'nochange') {
                    var $next = $(this).closest('tr').next().find('[data-xeditable-auto-open]');
                    setTimeout(function () {
                        $next.editable('show');
                    }, 300);
                }
            });

            $('[data-xeditable=xeditable]').on('shown', function (e, reason) {
                $('[data-wysihtml5-command="Indent"]').remove();
                $('[data-wysihtml5-command="Outdent"]').remove();
            });
        }

        var set_goldcap_phase_list_height = function () {
            $('.goldcap-same-height').css('height', 'auto');
            var goldcap_phase_list_height = Math.max.apply(null, $(".goldcap-same-height").map(function () {
                return $(this).height();
            }).get());
            $('.goldcap-same-height').css('height', goldcap_phase_list_height);
        };

        set_goldcap_phase_list_height();


    }

    $(document).on("fm.success", function (event, obj) {
        if (obj.data.redirect) {
            window.location = obj.data.message;
        }
    });


    $(document).on('change', '[data-toggle="reload-phase"]', function () {
        var $this = $(this),
            selected = $this.val(),
            url = $this.data('source'),
            confirm = $this.data('confirm');

        if (confirm) {
            $.confirm({
                confirmButton: '<i class="fa fa-check"></i> Yes',
                cancelButton: '<i class="fa fa-close"></i> No',
                text: confirm,
                confirm: function () {
                    $.get(url, {from_id: $this.val()}, function (res) {
                        $this.parents('.modal-body').find('#div_phase_list_content').html($(res).find('#div_phase_list_content').html());
                    })
                },
                cancel: function () {
                    $this.val($.data($this, 'current'));
                }
            });
        } else {
            $.get(url, {from_id: $this.val()}, function (res) {
                $this.parents('.modal-body').find('#div_phase_list_content').html($(res).find('#div_phase_list_content').html());
            })
        }

    });

    $(document).on('click', '[data-action="change-order"]', function () {
        var $this = $(this),
            this_tr = $($this.parents('tr:first')),
            next_tr = this_tr.next(),
            next_tr_len = next_tr.length,
            prev_tr = this_tr.prev(),
            prev_tr_len = prev_tr.length,
            next_order_value, this_order_value;
        if ($this.data('direction') == 'down') {
            if (next_tr_len > 0) {
                next_order_value = $(next_tr).find('[data-toggle=data-order-value]').val();
                this_order_value = $(this_tr).find('[data-toggle=data-order-value]').val();
                $(next_tr).find('[data-toggle=data-order-value]').val(this_order_value);
                $(this_tr).find('[data-toggle=data-order-value]').val(next_order_value);
                $(this_tr).before($(next_tr));
            }
        } else {
            if (prev_tr_len > 0) {
                next_order_value = $(prev_tr).find('[data-toggle=data-order-value]').val();
                this_order_value = $(this_tr).find('[data-toggle=data-order-value]').val();
                $(prev_tr).find('[data-toggle=data-order-value]').val(this_order_value);
                $(this_tr).find('[data-toggle=data-order-value]').val(next_order_value);
                $(this_tr).after($(prev_tr));
            }
        }
        $(this_tr).effect("highlight", {}, 1000);
    });


    $(document).on('click', '[data-action="delete-item-row"]', function () {
        var $this = $(this),
            target = $($this.data('target')),
            this_tr = $($this.parents('tr:first')),
            tip = $this.data('tip');
        if (tip && $.confirm) {
            $.confirm({
                text: tip,
                confirmButton: '<i class="fa fa-check"></i> Yes',
                cancelButton: '<i class="fa fa-close"></i> No',
                confirm: function () {
                    $(target).val('1');
                    $(this_tr).addClass('hidden');
                }
            });
        } else {
            $(target).val('1');
            $(this_tr).addClass('hidden');
        }
    });

    goldcap_init();

    $(document).on('show.bs.dropdown', '.dropdown', function (event) {
        var $this = $(event.currentTarget),
            source = $this.data('source');
        if (source) {
            $.get(source, function (html) {
                $this.find('.dropdown-menu').html(html)
            })
        }
    });

    $(document).ajaxComplete(function () {
        goldcap_init();
        $("[data-toggle='tooltip']").tooltip({html: true});

        // Avoid trigger multi times.
        $('[data-toggle="wysihtml5"]').each(function (index, el) {
            var $this = $(el);
            if ($this.next().attr('name') != '_wysihtml5_mode') {
                $this.wysihtml5();
            }
        });

    });

    $(document).on('click ifChanged switchChange.bootstrapSwitch', '[data-action="ajax-post-data"]', function () {
        var $this = $(this),
            params = {
                url: $this.data('url'),
                type: 'POST',
                dataType: "json",
                data: {
                    value: $this.val(),
                }
            };

        $.ajax(params).success(function (data) {
            if (data.status === 'ok') {
                var callback = $this.data('callback'),
                    target = $this.data('target');

                if (!callback) {
                    $.noop();
                } else if (callback === 'reload') {
                    window.location.reload();
                } else if (callback === 'redirect') {
                    window.location = target;
                } else if (callback === 'remove' || callback === 'delete') {
                    $(target).remove();
                } else if (callback === 'append') {
                    $(target).append(data.message);
                } else if (callback === 'prepend') {
                    $(target).prepend(data.message);
                } else if (callback === 'replace') {
                    $(target).replaceWith(data.message);
                }
            }
            return false;
        });
    });

    $(document).on('submit', '[data-toggle="ajax-form"]', function (event) {
        event.preventDefault();

        var $this = $(this),
            form_data = new FormData($this);

        $.ajax({
            url: $this.attr('action'),
            type: "POST",
            data: form_data,
            success: function (data) {
                $this.replaceWith(data['message']);
            },
            error: function () {
                $this.find('.error-message').show()
            }
        });
    });
});
function fix_sidebar() {
    //Make sure the body tag has the .fixed class
    if (!$("body").hasClass("fixed")) {
        return;
    }

    //Add slimscroll
    $(".sidebar").slimscroll({
        height: ($(window).height() - $(".header").height()) + "px",
        color: "rgba(0,0,0,0.2)"
    });
}


/*
 * BOX REFRESH BUTTON
 * ------------------
 * This is a custom plugin to use with the compenet BOX. It allows you to add
 * a refresh button to the box. It converts the box's state to a loading state.
 *
 * USAGE:
 *  $("#box-widget").boxRefresh( options );
 * */
(function ($) {
    "use strict";

    $.fn.boxRefresh = function (options) {

        // Render options
        var settings = $.extend({
            //Refressh button selector
            trigger: ".refresh-btn",
            //File source to be loaded (e.g: ajax/src.php)
            source: "",
            //Callbacks
            onLoadStart: function (box) {
            }, //Right after the button has been clicked
            onLoadDone: function (box) {
            } //When the source has been loaded

        }, options);

        //The overlay
        var overlay = $('<div class="overlay"></div><div class="loading-img"></div>');

        return this.each(function () {
            //if a source is specified
            if (settings.source === "") {
                if (console) {
                    console.log("Please specify a source first - boxRefresh()");
                }
                return;
            }
            //the box
            var box = $(this);
            //the button
            var rBtn = box.find(settings.trigger).first();

            //On trigger click
            rBtn.click(function (e) {
                e.preventDefault();
                //Add loading overlay
                start(box);

                //Perform ajax call
                box.find(".box-body").load(settings.source, function () {
                    done(box);
                });


            });

        });

        function start(box) {
            //Add overlay and loading img
            box.append(overlay);

            settings.onLoadStart.call(box);
        }

        function done(box) {
            //Remove overlay and loading img
            box.find(overlay).remove();

            settings.onLoadDone.call(box);
        }

    };

})(jQuery);

/*
 * SIDEBAR MENU
 * ------------
 * This is a custom plugin for the sidebar menu. It provides a tree view.
 *
 * Usage:
 * $(".sidebar).tree();
 *
 * Note: This plugin does not accept any options. Instead, it only requires a class
 *       added to the element that contains a sub-menu.
 *
 * When used with the sidebar, for example, it would look something like this:
 * <ul class='sidebar-menu'>
 *      <li class="treeview active">
 *          <a href="#>Menu</a>
 *          <ul class='treeview-menu'>
 *              <li class='active'><a href=#>Level 1</a></li>
 *          </ul>
 *      </li>
 * </ul>
 *
 * Add .active class to <li> elements if you want the menu to be open automatically
 * on page load. See above for an example.
 */
(function ($) {
    "use strict";

    $.fn.tree = function () {

        return this.each(function () {
            var btn = $(this).children("a").first();
            var menu = $(this).children(".treeview-menu").first();
            var isActive = $(this).hasClass('active');

            //initialize already active menus
            if (isActive) {
                menu.show();
                btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
                btn.children(".fa-angle-double-right").first().removeClass("fa-angle-double-right").addClass("fa-angle-double-down");
            }
            //Slide open or close the menu on link click
            btn.click(function (e) {
                e.preventDefault();
                if (isActive) {
                    //Slide up to close menu
                    menu.slideUp();
                    isActive = false;
                    btn.children(".fa-angle-down").first().removeClass("fa-angle-down").addClass("fa-angle-left");
                    btn.children(".fa-angle-double-down").first().removeClass("fa-angle-double-down").addClass("fa-angle-double-right");
                    btn.parent("li").removeClass("active");
                } else {
                    //Slide down to open menu
                    menu.slideDown();
                    isActive = true;
                    btn.children(".fa-angle-left").first().removeClass("fa-angle-left").addClass("fa-angle-down");
                    btn.children(".fa-angle-double-right").first().removeClass("fa-angle-double-right").addClass("fa-angle-double-down");
                    btn.parent("li").addClass("active");
                }
            });

            /* Add margins to submenu elements to give it a tree look */
            menu.find("li > a").each(function () {
                var pad = parseInt($(this).css("margin-left")) + 10;

                $(this).css({"margin-left": pad + "px"});
            });

        });

    };


}(jQuery));

/*
 * TODO LIST CUSTOM PLUGIN
 * -----------------------
 * This plugin depends on iCheck plugin for checkbox and radio inputs
 */
(function ($) {
    "use strict";

    $.fn.todolist = function (options) {
        // Render options
        var settings = $.extend({
            //When the user checks the input
            onCheck: function (ele) {
            },
            //When the user unchecks the input
            onUncheck: function (ele) {
            }
        }, options);

        return this.each(function () {
            $('input', this).on('ifChecked', function (event) {
                var ele = $(this).parents("li").first();
                ele.toggleClass("done");
                settings.onCheck.call(ele);
            });

            $('input', this).on('ifUnchecked', function (event) {
                var ele = $(this).parents("li").first();
                ele.toggleClass("done");
                settings.onUncheck.call(ele);
            });
        });
    };

}(jQuery));

/* CENTER ELEMENTS */
(function ($) {
    "use strict";
    jQuery.fn.center = function (parent) {
        if (parent) {
            parent = this.parent();
        } else {
            parent = window;
        }
        this.css({
            "position": "absolute",
            "top": ((($(parent).height() - this.outerHeight()) / 2) + $(parent).scrollTop() + "px"),
            "left": ((($(parent).width() - this.outerWidth()) / 2) + $(parent).scrollLeft() + "px")
        });
        return this;
    }
}(jQuery));

/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function ($, h, c) {
    var a = $([]), e = $.resize = $.extend($.resize, {}), i, k = "setTimeout", j = "resize", d = j + "-special-event", b = "delay", f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function () {
            if (!e[f] && this[k]) {
                return false;
            }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, {w: l.width(), h: l.height()});
            if (a.length === 1) {
                g();
            }
        }, teardown: function () {
            if (!e[f] && this[k]) {
                return false
            }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) {
                clearTimeout(i);
            }
        }, add: function (l) {
            if (!e[f] && this[k]) {
                return false
            }
            var n;

            function m(s, o, p) {
                var q = $(this), r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments)
            }

            if ($.isFunction(l)) {
                n = l;
                return m
            } else {
                n = l.handler;
                l.handler = m
            }
        }
    };
    function g() {
        i = h[k](function () {
            a.each(function () {
                var n = $(this), m = n.width(), l = n.height(), o = $.data(this, d);
                if (m !== o.w || l !== o.h) {
                    n.trigger(j, [o.w = m, o.h = l])
                }
            });
            g()
        }, e[b])
    }
})(jQuery, this);

/*!
 * SlimScroll https://github.com/rochal/jQuery-slimScroll
 * =======================================================
 *
 * Copyright (c) 2011 Piotr Rochala (http://rocha.la) Dual licensed under the MIT
 */
(function (f) {
    jQuery.fn.extend({
        slimScroll: function (h) {
            var a = f.extend({
                width: "auto",
                height: "250px",
                size: "7px",
                color: "#000",
                position: "right",
                distance: "1px",
                start: "top",
                opacity: 0.4,
                alwaysVisible: !1,
                disableFadeOut: !1,
                railVisible: !1,
                railColor: "#333",
                railOpacity: 0.2,
                railDraggable: !0,
                railClass: "slimScrollRail",
                barClass: "slimScrollBar",
                wrapperClass: "slimScrollDiv",
                allowPageScroll: !1,
                wheelStep: 20,
                touchScrollStep: 200,
                borderRadius: "0px",
                railBorderRadius: "0px"
            }, h);
            this.each(function () {
                function r(d) {
                    if (s) {
                        d = d ||
                            window.event;
                        var c = 0;
                        d.wheelDelta && (c = -d.wheelDelta / 120);
                        d.detail && (c = d.detail / 3);
                        f(d.target || d.srcTarget || d.srcElement).closest("." + a.wrapperClass).is(b.parent()) && m(c, !0);
                        d.preventDefault && !k && d.preventDefault();
                        k || (d.returnValue = !1)
                    }
                }

                function m(d, f, h) {
                    k = !1;
                    var e = d, g = b.outerHeight() - c.outerHeight();
                    f && (e = parseInt(c.css("top")) + d * parseInt(a.wheelStep) / 100 * c.outerHeight(), e = Math.min(Math.max(e, 0), g), e = 0 < d ? Math.ceil(e) : Math.floor(e), c.css({top: e + "px"}));
                    l = parseInt(c.css("top")) / (b.outerHeight() - c.outerHeight());
                    e = l * (b[0].scrollHeight - b.outerHeight());
                    h && (e = d, d = e / b[0].scrollHeight * b.outerHeight(), d = Math.min(Math.max(d, 0), g), c.css({top: d + "px"}));
                    b.scrollTop(e);
                    b.trigger("slimscrolling", ~~e);
                    v();
                    p()
                }

                function C() {
                    window.addEventListener ? (this.addEventListener("DOMMouseScroll", r, !1), this.addEventListener("mousewheel", r, !1), this.addEventListener("MozMousePixelScroll", r, !1)) : document.attachEvent("onmousewheel", r)
                }

                function w() {
                    u = Math.max(b.outerHeight() / b[0].scrollHeight * b.outerHeight(), D);
                    c.css({height: u + "px"});
                    var a = u == b.outerHeight() ? "none" : "block";
                    c.css({display: a})
                }

                function v() {
                    w();
                    clearTimeout(A);
                    l == ~~l ? (k = a.allowPageScroll, B != l && b.trigger("slimscroll", 0 == ~~l ? "top" : "bottom")) : k = !1;
                    B = l;
                    u >= b.outerHeight() ? k = !0 : (c.stop(!0, !0).fadeIn("fast"), a.railVisible && g.stop(!0, !0).fadeIn("fast"))
                }

                function p() {
                    a.alwaysVisible || (A = setTimeout(function () {
                        a.disableFadeOut && s || (x || y) || (c.fadeOut("slow"), g.fadeOut("slow"))
                    }, 1E3))
                }

                var s, x, y, A, z, u, l, B, D = 30, k = !1, b = f(this);
                if (b.parent().hasClass(a.wrapperClass)) {
                    var n = b.scrollTop(),
                        c = b.parent().find("." + a.barClass), g = b.parent().find("." + a.railClass);
                    w();
                    if (f.isPlainObject(h)) {
                        if ("height" in h && "auto" == h.height) {
                            b.parent().css("height", "auto");
                            b.css("height", "auto");
                            var q = b.parent().parent().height();
                            b.parent().css("height", q);
                            b.css("height", q)
                        }
                        if ("scrollTo" in h)
                            n = parseInt(a.scrollTo);
                        else if ("scrollBy" in h)
                            n += parseInt(a.scrollBy);
                        else if ("destroy" in h) {
                            c.remove();
                            g.remove();
                            b.unwrap();
                            return
                        }
                        m(n, !1, !0)
                    }
                } else {
                    a.height = "auto" == a.height ? b.parent().height() : a.height;
                    n = f("<div></div>").addClass(a.wrapperClass).css({
                        position: "relative",
                        overflow: "hidden", width: a.width, height: a.height
                    });
                    b.css({overflow: "hidden", width: a.width, height: a.height});
                    var g = f("<div></div>").addClass(a.railClass).css({
                        width: a.size,
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        display: a.alwaysVisible && a.railVisible ? "block" : "none",
                        "border-radius": a.railBorderRadius,
                        background: a.railColor,
                        opacity: a.railOpacity,
                        zIndex: 90
                    }), c = f("<div></div>").addClass(a.barClass).css({
                        background: a.color,
                        width: a.size,
                        position: "absolute",
                        top: 0,
                        opacity: a.opacity,
                        display: a.alwaysVisible ?
                            "block" : "none",
                        "border-radius": a.borderRadius,
                        BorderRadius: a.borderRadius,
                        MozBorderRadius: a.borderRadius,
                        WebkitBorderRadius: a.borderRadius,
                        zIndex: 99
                    }), q = "right" == a.position ? {right: a.distance} : {left: a.distance};
                    g.css(q);
                    c.css(q);
                    b.wrap(n);
                    b.parent().append(c);
                    b.parent().append(g);
                    a.railDraggable && c.bind("mousedown", function (a) {
                        var b = f(document);
                        y = !0;
                        t = parseFloat(c.css("top"));
                        pageY = a.pageY;
                        b.bind("mousemove.slimscroll", function (a) {
                            currTop = t + a.pageY - pageY;
                            c.css("top", currTop);
                            m(0, c.position().top, !1)
                        });
                        b.bind("mouseup.slimscroll", function (a) {
                            y = !1;
                            p();
                            b.unbind(".slimscroll")
                        });
                        return !1
                    }).bind("selectstart.slimscroll", function (a) {
                        a.stopPropagation();
                        a.preventDefault();
                        return !1
                    });
                    g.hover(function () {
                        v()
                    }, function () {
                        p()
                    });
                    c.hover(function () {
                        x = !0
                    }, function () {
                        x = !1
                    });
                    b.hover(function () {
                        s = !0;
                        v();
                        p()
                    }, function () {
                        s = !1;
                        p()
                    });
                    b.bind("touchstart", function (a, b) {
                        a.originalEvent.touches.length && (z = a.originalEvent.touches[0].pageY)
                    });
                    b.bind("touchmove", function (b) {
                        k || b.originalEvent.preventDefault();
                        b.originalEvent.touches.length &&
                        (m((z - b.originalEvent.touches[0].pageY) / a.touchScrollStep, !0), z = b.originalEvent.touches[0].pageY)
                    });
                    w();
                    "bottom" === a.start ? (c.css({top: b.outerHeight() - c.outerHeight()}), m(0, !0)) : "top" !== a.start && (m(f(a.start).position().top, null, !0), a.alwaysVisible || c.hide());
                    C()
                }
            });
            return this
        }
    });
    jQuery.fn.extend({slimscroll: jQuery.fn.slimScroll})
})(jQuery);

/*! iCheck v1.0.1 by Damir Sultanov, http://git.io/arlzeA, MIT Licensed */
(function (h) {
    function F(a, b, d) {
        var c = a[0], e = /er/.test(d) ? m : /bl/.test(d) ? s : l, f = d == H ? {
            checked: c[l],
            disabled: c[s],
            indeterminate: "true" == a.attr(m) || "false" == a.attr(w)
        } : c[e];
        if (/^(ch|di|in)/.test(d) && !f)
            D(a, e);
        else if (/^(un|en|de)/.test(d) && f)
            t(a, e);
        else if (d == H)
            for (e in f)
                f[e] ? D(a, e, !0) : t(a, e, !0);
        else if (!b || "toggle" == d) {
            if (!b)
                a[p]("ifClicked");
            f ? c[n] !== u && t(a, e) : D(a, e)
        }
    }

    function D(a, b, d) {
        var c = a[0], e = a.parent(), f = b == l, A = b == m, B = b == s, K = A ? w : f ? E : "enabled", p = k(a, K + x(c[n])), N = k(a, b + x(c[n]));
        if (!0 !== c[b]) {
            if (!d &&
                b == l && c[n] == u && c.name) {
                var C = a.closest("form"), r = 'input[name="' + c.name + '"]', r = C.length ? C.find(r) : h(r);
                r.each(function () {
                    this !== c && h(this).data(q) && t(h(this), b)
                })
            }
            A ? (c[b] = !0, c[l] && t(a, l, "force")) : (d || (c[b] = !0), f && c[m] && t(a, m, !1));
            L(a, f, b, d)
        }
        c[s] && k(a, y, !0) && e.find("." + I).css(y, "default");
        e[v](N || k(a, b) || "");
        B ? e.attr("aria-disabled", "true") : e.attr("aria-checked", A ? "mixed" : "true");
        e[z](p || k(a, K) || "")
    }

    function t(a, b, d) {
        var c = a[0], e = a.parent(), f = b == l, h = b == m, q = b == s, p = h ? w : f ? E : "enabled", t = k(a, p + x(c[n])),
            u = k(a, b + x(c[n]));
        if (!1 !== c[b]) {
            if (h || !d || "force" == d)
                c[b] = !1;
            L(a, f, p, d)
        }
        !c[s] && k(a, y, !0) && e.find("." + I).css(y, "pointer");
        e[z](u || k(a, b) || "");
        q ? e.attr("aria-disabled", "false") : e.attr("aria-checked", "false");
        e[v](t || k(a, p) || "")
    }

    function M(a, b) {
        if (a.data(q)) {
            a.parent().html(a.attr("style", a.data(q).s || ""));
            if (b)
                a[p](b);
            a.off(".i").unwrap();
            h(G + '[for="' + a[0].id + '"]').add(a.closest(G)).off(".i")
        }
    }

    function k(a, b, d) {
        if (a.data(q))
            return a.data(q).o[b + (d ? "" : "Class")]
    }

    function x(a) {
        return a.charAt(0).toUpperCase() +
            a.slice(1)
    }

    function L(a, b, d, c) {
        if (!c) {
            if (b)
                a[p]("ifToggled");
            a[p]("ifChanged")[p]("if" + x(d))
        }
    }

    var q = "iCheck", I = q + "-helper", u = "radio", l = "checked", E = "un" + l, s = "disabled", w = "determinate", m = "in" + w, H = "update", n = "type", v = "addClass", z = "removeClass", p = "trigger", G = "label", y = "cursor", J = /ipad|iphone|ipod|android|blackberry|windows phone|opera mini|silk/i.test(navigator.userAgent);
    h.fn[q] = function (a, b) {
        var d = 'input[type="checkbox"], input[type="' + u + '"]', c = h(), e = function (a) {
            a.each(function () {
                var a = h(this);
                c = a.is(d) ?
                    c.add(a) : c.add(a.find(d))
            })
        };
        if (/^(check|uncheck|toggle|indeterminate|determinate|disable|enable|update|destroy)$/i.test(a))
            return a = a.toLowerCase(), e(this), c.each(function () {
                var c = h(this);
                "destroy" == a ? M(c, "ifDestroyed") : F(c, !0, a);
                h.isFunction(b) && b()
            });
        if ("object" != typeof a && a)
            return this;
        var f = h.extend({
            checkedClass: l,
            disabledClass: s,
            indeterminateClass: m,
            labelHover: !0,
            aria: !1
        }, a), k = f.handle, B = f.hoverClass || "hover", x = f.focusClass || "focus", w = f.activeClass || "active", y = !!f.labelHover, C = f.labelHoverClass ||
            "hover", r = ("" + f.increaseArea).replace("%", "") | 0;
        if ("checkbox" == k || k == u)
            d = 'input[type="' + k + '"]';
        -50 > r && (r = -50);
        e(this);
        return c.each(function () {
            var a = h(this);
            M(a);
            var c = this, b = c.id, e = -r + "%", d = 100 + 2 * r + "%", d = {
                    position: "absolute",
                    top: e,
                    left: e,
                    display: "block",
                    width: d,
                    height: d,
                    margin: 0,
                    padding: 0,
                    background: "#fff",
                    border: 0,
                    opacity: 0
                }, e = J ? {position: "absolute", visibility: "hidden"} : r ? d : {
                    position: "absolute",
                    opacity: 0
                }, k = "checkbox" == c[n] ? f.checkboxClass || "icheckbox" : f.radioClass || "i" + u, m = h(G + '[for="' + b + '"]').add(a.closest(G)),
                A = !!f.aria, E = q + "-" + Math.random().toString(36).replace("0.", ""), g = '<div class="' + k + '" ' + (A ? 'role="' + c[n] + '" ' : "");
            m.length && A && m.each(function () {
                g += 'aria-labelledby="';
                this.id ? g += this.id : (this.id = E, g += E);
                g += '"'
            });
            g = a.wrap(g + "/>")[p]("ifCreated").parent().append(f.insert);
            d = h('<ins class="' + I + '"/>').css(d).appendTo(g);
            a.data(q, {o: f, s: a.attr("style")}).css(e);
            f.inheritClass && g[v](c.className || "");
            f.inheritID && b && g.attr("id", q + "-" + b);
            "static" == g.css("position") && g.css("position", "relative");
            F(a, !0, H);
            if (m.length)
                m.on("click.i mouseover.i mouseout.i touchbegin.i touchend.i", function (b) {
                    var d = b[n], e = h(this);
                    if (!c[s]) {
                        if ("click" == d) {
                            if (h(b.target).is("a"))
                                return;
                            F(a, !1, !0)
                        } else
                            y && (/ut|nd/.test(d) ? (g[z](B), e[z](C)) : (g[v](B), e[v](C)));
                        if (J)
                            b.stopPropagation();
                        else
                            return !1
                    }
                });
            a.on("click.i focus.i blur.i keyup.i keydown.i keypress.i", function (b) {
                var d = b[n];
                b = b.keyCode;
                if ("click" == d)
                    return !1;
                if ("keydown" == d && 32 == b)
                    return c[n] == u && c[l] || (c[l] ? t(a, l) : D(a, l)), !1;
                if ("keyup" == d && c[n] == u)
                    !c[l] && D(a, l);
                else if (/us|ur/.test(d))
                    g["blur" ==
                    d ? z : v](x)
            });
            d.on("click mousedown mouseup mouseover mouseout touchbegin.i touchend.i", function (b) {
                var d = b[n], e = /wn|up/.test(d) ? w : B;
                if (!c[s]) {
                    if ("click" == d)
                        F(a, !1, !0);
                    else {
                        if (/wn|er|in/.test(d))
                            g[v](e);
                        else
                            g[z](e + " " + w);
                        if (m.length && y && e == B)
                            m[/ut|nd/.test(d) ? z : v](C)
                    }
                    if (J)
                        b.stopPropagation();
                    else
                        return !1
                }
            })
        })
    }
})(window.jQuery || window.Zepto);

$.fn.serializeObject = function () {
    "use strict";
    var o = {},
        a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};