/**
 * Created by charlie on 16-1-11.
 */
(function ($) {
    "use strict";

    var Date2 = function (options) {
        this.init('date2', options, Date2.defaults);
    };

    $.fn.editableutils.inherit(Date2, $.fn.editabletypes.abstractinput);

    $.extend(Date2.prototype, {
        render: function () {
            this.renderClear();
            this.setClass();
            this.setAttr('placeholder');
        },

        activate: function () {
            if (this.$input.is(':visible')) {

                this.$input.datepicker({
                    todayBtn: true,
                    format: "yyyy-mm-dd",
                    forceParse: false,
                    autoclose: true,
                    todayHighlight: true
                });

                this.$input.focus();
                $.fn.editableutils.setCursorPosition(this.$input.get(0), this.$input.val().length);
                if (this.toggleClear) {
                    this.toggleClear();
                }
            }
        },

        //render clear button
        renderClear: function () {
            if (this.options.clear) {
                this.$clear = $('<span class="editable-clear-x"></span>');
                this.$input.after(this.$clear)
                    .css('padding-right', 24)
                    .keyup($.proxy(function (e) {
                        //arrows, enter, tab, etc
                        if (~$.inArray(e.keyCode, [40, 38, 9, 13, 27])) {
                            return;
                        }

                        clearTimeout(this.t);
                        var that = this;
                        this.t = setTimeout(function () {
                            that.toggleClear(e);
                        }, 100);

                    }, this))
                    .parent().css('position', 'relative');

                this.$clear.click($.proxy(this.clear, this));
            }
        },

        postrender: function () {
            /*
             //now `clear` is positioned via css
             if(this.$clear) {
             //can position clear button only here, when form is shown and height can be calculated
             //                var h = this.$input.outerHeight(true) || 20,
             var h = this.$clear.parent().height(),
             delta = (h - this.$clear.height()) / 2;

             //this.$clear.css({bottom: delta, right: delta});
             }
             */
        },

        //show / hide clear button
        toggleClear: function (e) {
            if (!this.$clear) {
                return;
            }

            var len = this.$input.val().length,
                visible = this.$clear.is(':visible');

            if (len && !visible) {
                this.$clear.show();
            }

            if (!len && visible) {
                this.$clear.hide();
            }
        },

        clear: function () {
            this.$clear.hide();
            this.$input.val('').focus();
        }
    });

    Date2.defaults = $.extend({}, $.fn.editabletypes.abstractinput.defaults, {
        /**
         @property tpl
         @default <input type="text">
         **/
        tpl: '<input type="text" class="form-control input-sm">',
        /**
         Placeholder attribute of input. Shown when input is empty.

         @property placeholder
         @type string
         @default null
         **/
        placeholder: null,

        /**
         Whether to show `clear` button

         @property clear
         @type boolean
         @default true
         **/
        clear: true
    });

    $.fn.editabletypes.date2 = Date2;

}(window.jQuery));