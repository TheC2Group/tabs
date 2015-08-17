var Tabs = (function ($) {
    'use strict';

    var defaults = {
        target: '.tab',
        panel: '.panel',
        prefix: 'Tabs-',
        firstActive: 0,
        mobileAccordion: true, 
        breakpoint: 750
    };

    var keys = {
        left: 37,
        right: 39,
        up: 38,
        down: 40
    };

    var activatePreviousTarget = function (index) {
        var previous = index - 1;
        if (previous < 0) {
            previous = this.$tab.length - 1;
        }
        activate.call(this, previous);
    };

    var activateNextTarget = function (index) {
        var next = index + 1;
        if (next >= this.$tab.length) {
            next = 0;
        }
        activate.call(this, next);
    };

    var panelKeyEvents = function (e, index) {
        var self = this;

        if (e.ctrlKey && e.which === keys.up) {
            self.$tab.eq(index).focus();
        }
    };

    var tabKeyEvents = function (e, index) {

        if (e.which === keys.left || e.which === keys.up) {
            e.preventDefault();
            activatePreviousTarget.call(this, index);
            return;
        }

        if (e.which === keys.right || e.which === keys.down) {
            e.preventDefault();
            activateNextTarget.call(this, index);
            return;
        }
    };

    var activate = function (index) {
        var $thisTab = this.$tab.eq(index);
        var id = $thisTab.attr('id');
        var $thisPanel = this.$panel.filter('[aria-labelledby="' + id + '"]');
        if ($thisTab.attr('aria-selected') === true) return;

        this.$tab.attr({
            'aria-selected': false,
            'tabindex': -1
        });

        this.$panel.attr({
            'aria-hidden': true,
            'tabindex': -1
        });

        $thisTab.attr({
            'aria-selected': true,
            'tabindex': 0
        });

        $thisPanel.attr({
            'aria-hidden': false,
            'tabindex': 0
        });

        $thisTab.focus();
    };

    var bindEvents = function () {
        var self = this;

        this.$tab.click(function () {
            activate.call(self, $(this).index());
        });

        this.$tab.keydown(function (e) {
            tabKeyEvents.call(self, e, $(this).index());
        });

        this.$panel.keydown(function (e) {
            var id = $(this).attr('aria-labelledby');
            var index = $('#' + id).index();
            panelKeyEvents.call(self, e, index);
        });

        matchMedia(this.mobileMaxWidth).addListener(function (mql) {
            if (mql.matches && self.opts.mobileAccordion) {
                if (self.accordion === undefined) {
                    self.accordion = new Accordion(self.$el, { 
                        allowMultiple: false,
                        prefix: self.opts.prefix 
                    });
                } 
                self.accordion.contractAll();
                self.accordion.activate(0);
            }
        });

        matchMedia(this.desktopMinWidth).addListener(function (mql) {
            if (mql.matches && self.opts.mobileAccordion) {
                activate.call(self, 0);
            }
        });
    };

    var addAriaAttributes = function () {
        var self = this;

        if (!this.$tablist.attr('role')) {
            this.$el.attr('role', 'tablist');
        }

        this.$tab.each(function (i) {
            $(this).attr({
                'role': 'tab',
                'tabindex': -1,
                'aria-selected': false,
                'id': self.opts.prefix + (i + 1)
            });
        });

        this.$panel.each(function (i) {
            $(this).attr({
                'role': 'tabpanel',
                'tabindex': -1,
                'aria-hidden': true,
                'aria-labelledby': self.opts.prefix + (i + 1)
            });
        });

        this.$tab.eq(this.opts.firstActive).attr({
            'tabindex': 0,
            'aria-selected': true
        });

        this.$panel.eq(this.opts.firstActive).attr({
            'tabindex': 0,
            'aria-hidden': false
        });
    };

    var tabs = function (el, options) {
        this.$el = $(el);
        this.$tablist = this.$el.find('.tablist');
        this.opts = $.extend({}, defaults, options);
        this.$tab = this.$el.find(this.opts.target);
        this.$panel = this.$el.find(this.opts.panel);
        this.mobileMaxWidth = 'screen and (max-width: ' + (this.opts.breakpoint - 1) + 'px)';
        this.desktopMinWidth = 'screen and (min-width: ' + (this.opts.breakpoint) + 'px)';
        addAriaAttributes.call(this);
        bindEvents.call(this);

        if (this.opts.mobileAccordion && matchMedia(this.mobileMaxWidth).matches) {
            this.accordion = new Accordion(this.$el, { 
                allowMultiple: false,
                prefix: this.opts.prefix
            });
            this.accordion.contractAll();
            this.accordion.activate(0);
        }
    };

    tabs.prototype.activate = activate;

    return tabs;

}(jQuery));