/*!
 * tabs
 * version: 1.0.0
 * https://stash.c2mpg.com:8443/projects/C2/repos/tabs
 */

/* global Accordion */
/* exported Tabs */

var Tabs = (function ($) {
    'use strict';

    var count = 0;

    var defaults = {
        target: '.tab',
        panel: '.panel',
        prefix: 'Tabs-',
        firstActive: 1,
        breakpoint: 0
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

    var activateAccordion = function () {
        if (this.accordion === undefined) {
            this.accordion = new Accordion(this.$el, {
                allowMultiple: false,
                prefix: this.opts.prefix
            });
        }
        this.accordion.activate(0);
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

        if (this.desktopMql) {

            this.desktopMql.addListener(function (mql) {
                if (mql.matches) {
                    activate.call(self, 0);
                } else {
                    activateAccordion.call(self);
                }
            });
        }
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
                'id': self.opts.prefix + self.count + '-' + (i + 1)
            });
        });

        this.$panel.each(function (i) {
            $(this).attr({
                'role': 'tabpanel',
                'tabindex': -1,
                'aria-hidden': true,
                'aria-labelledby': self.opts.prefix + self.count + '-' + (i + 1)
            });
        });

        this.$tab.eq(this.firstActive).attr({
            'tabindex': 0,
            'aria-selected': true
        });

        this.$panel.eq(this.firstActive).attr({
            'tabindex': 0,
            'aria-hidden': false
        });
    };

    var tabs = function (el, options) {
        count += 1;
        this.count = count;

        this.$el = $(el);
        this.$tablist = this.$el.find('.tablist');
        this.opts = $.extend({}, defaults, options);
        this.$tab = this.$el.find(this.opts.target);
        this.$panel = this.$el.find(this.opts.panel);
        this.firstActive = this.opts.firstActive - 1; // setting it to zero-based
        this.desktopMql = (this.opts.breakpoint > 0) ? matchMedia('screen and (min-width: ' + (this.opts.breakpoint) + 'px)') : null;
        addAriaAttributes.call(this);
        bindEvents.call(this);

        if (this.desktopMql && !this.desktopMql.matches) {
            activateAccordion.call(this);
        }
    };

    tabs.prototype.activate = activate;

    return tabs;

}(jQuery));
