/**
 * X-Editable Radiolist extension for Bootstrap 3
 * @requires X-Editable, jquery, etc.
 * @example:

 $('.editable-earn-method').editable({
            name: 'earn_method',
            source: [
                {value: 'swipes', text: 'Number of swipes'},
                {value: 'spend', text: 'Spend Amount ($USD)'}
            ]
        });
 *
 * Adapted by Tomanow
 */
(function ($) {
    var Radiolist = function (options) {
        this.init('radiolist', options, Radiolist.defaults);
    };
    $.fn.editableutils.inherit(Radiolist, $.fn.editabletypes.list);

    $.extend(Radiolist.prototype, {
        renderList: function () {
            var $label;
            this.$tpl.empty();
            if (!$.isArray(this.sourceData)) {
                return;
            }

            for (var i = 0; i < this.sourceData.length; i++) {
                var name = this.options.name || 'default_name';
                $label = $('<label>').append($('<input>', {
                                           type: 'radio',
                                            name: name,
                                           value: this.sourceData[i].value
                                     }))
                                     .append($('<span>').text(' '+this.sourceData[i].text));

                $('<div class="">').append($label).appendTo(this.$tpl);
            }

            this.$input = this.$tpl.find('input[type="radio"]');
            this.setClass();
        },

        value2str: function (value) {
            return $.isArray(value) ? value.sort().join($.trim(this.options.separator)) : value;
        },

        //parse separated string
        str2value: function (str) {
            var reg, value = null;
            if (typeof str === 'string' && str.length) {
                reg = new RegExp('\\s*' + $.trim(this.options.separator) + '\\s*');
                value = str.split(reg);
            } else if ($.isArray(str)) {
                value = str;
            }
            return value;
        },

        //set checked on required radio buttons
        value2input: function (value) {
            this.$input.prop('checked', false);

            if ($.isArray(value) && value.length) {
                this.$input.each(function (i, el) {
                    var $el = $(el);
                    // cannot use $.inArray as it performs strict comparison
                    $.each(value, function (j, val) {
                        if ($el.val() == val) {
                            $el.prop('checked', true);
                        }
                    });
                });
            }
        },

        input2value: function () {
            return this.$input.filter(':checked').val();
        },

        //collect text of checked boxes
        value2htmlFinal: function (value, element) {
            var html = [],
                checked = $.fn.editableutils.itemsByValue(value, this.sourceData),
                escape = this.options.escape;
            if (checked.length) {
                $.each(checked, function (i, v) {
                    var text = escape ? $.fn.editableutils.escape(v.text) : v.text;
                    html.push(text);
                });
                $(element).html(html.join('<br>'));
            } else {
                $(element).empty();
            }
        },

        value2submit: function (value) {
            return value;
        },

        activate: function () {
            this.$input.first().focus();
        }
    });

    Radiolist.defaults = $.extend({}, $.fn.editabletypes.list.defaults, {
        /**
         @property tpl
         @default <div></div>
         **/
        tpl: '<div class="editable-checklist"></div>',

        /**
         @property inputclass
         @type string
         @default null
         **/
        inputclass: '',

        /**
         Separator of values when reading from `data-value` attribute

         @property separator
         @type string
         @default ','
         **/
        separator: ',',

        name: 'defaultname'
    });

    $.fn.editabletypes.radiolist = Radiolist;


}(window.jQuery));


(function ($) {
    "use strict";

    var Checklist = function (options) {
        this.init('checklist2', options, Checklist.defaults);
    };

    $.fn.editableutils.inherit(Checklist, $.fn.editabletypes.list);

    $.extend(Checklist.prototype, {
        renderList: function () {
            var $label, $div;

            this.$tpl.empty();

            if (!$.isArray(this.sourceData)) {
                return;
            }

            for (var i = 0; i < this.sourceData.length; i++) {
                $label = $('<label>').append($('<input>', {
                        type: 'checkbox',
                        value: this.sourceData[i].value
                    }))
                    .append($('<span>').text(' ' + this.sourceData[i].text));

                $('<div>').append($label).appendTo(this.$tpl);
            }

            this.$input = this.$tpl.find('input[type="checkbox"]');
            this.setClass();
        },

        value2str: function (value) {
            return $.isArray(value) ? value.sort().join($.trim(this.options.separator)) : '';
        },

        //parse separated string
        str2value: function (str) {
            var reg, value = null;
            if (typeof str === 'string' && str.length) {
                reg = new RegExp('\\s*' + $.trim(this.options.separator) + '\\s*');
                value = str.split(reg);
            } else if ($.isArray(str)) {
                value = str;
            } else {
                value = str;
            }
            return value;
        },

        //set checked on required checkboxes
        value2input: function (value) {
            this.$input.prop('checked', false);
            this.$input.each(function (i, el) {
                var $el = $(el);
                value = value + '';
                // cannot use $.inArray as it performs strict comparison
                if ($el.val() == value) {
                    /*jslint eqeq: false*/
                    $el.prop('checked', true);
                }
            });
        },

        input2value: function () {
            var checked = [];
            this.$input.filter(':checked').each(function (i, el) {
                checked.push($(el).val());
            });
            return checked;
        },

        //collect text of checked boxes
        value2htmlFinal: function (value, element) {
            var html = [],
                checked = $.fn.editableutils.itemsByValue(value, this.sourceData),
                escape = this.options.escape;

            if (checked.length) {
                $.each(checked, function (i, v) {
                    var text = escape ? $.fn.editableutils.escape(v.text) : v.text;
                    html.push(text);
                });
                $(element).html(html.join('<br>'));
            } else {
                $(element).empty();
            }
        },

        value2submit: function (value) {
            if (value.length > 0) {
                return true;
            } else {
                return false;
            }
        },

        activate: function () {
            this.$input.first().focus();
        },

        autosubmit: function () {
            this.$input.on('keydown', function (e) {
                if (e.which === 13) {
                    $(this).closest('form').submit();
                }
            });
        }
    });

    Checklist.defaults = $.extend({}, $.fn.editabletypes.list.defaults, {
        /**
         @property tpl
         @default <div></div>
         **/
        tpl: '<div class="editable-checklist"></div>',

        /**
         @property inputclass
         @type string
         @default null
         **/
        inputclass: null,

        /**
         Separator of values when reading from `data-value` attribute

         @property separator
         @type string
         @default ','
         **/
        separator: ','
    });

    $.fn.editabletypes.checklist2 = Checklist;

}(window.jQuery));

