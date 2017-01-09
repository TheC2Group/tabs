/*!
 * c2-tabs
 * https://github.com/TheC2Group/tabs
 * @version 2.0.0
 * @license MIT (c) The C2 Group (c2experience.com)
 */
var Tabs = (function ($,eventHandler) { 'use strict';

    var count = 0;

    var defaults = {
        tablist: '.tablist',
        tab: '.tab',
        panel: '.panel',
        prefix: 'Tabs-',
        hashEnabled: false
    };

    var keys = {
        left: 37,
        right: 39,
        up: 38,
        down: 40
    };

    var activatePrevious = function activatePrevious() {
        var previous = this.index - 1;
        if (previous < 0) {
            previous = this.len - 1;
        }
        activate.call(this, previous);
    };

    var activateNext = function activateNext() {
        var next = this.index + 1;
        if (next >= this.len) {
            next = 0;
        }
        activate.call(this, next);
    };

    var keyEvents = function keyEvents(e, index) {
        if (e.which === keys.left || e.which === keys.up) {
            e.preventDefault();
            activatePrevious.call(this, index);
            return;
        }
        if (e.which === keys.right || e.which === keys.down) {
            e.preventDefault();
            activateNext.call(this, index);
            return;
        }
    };

    var activate = function activate(index) {
        if (index === this.index) return;
        var previous = this.index;
        this.index = index;

        this.$tabs.eq(previous).attr({
            'aria-selected': false,
            'tabindex': -1
        });

        this.$panels.eq(previous).attr({
            'aria-hidden': true,
            'tabindex': -1
        });

        this.$tabs.eq(index).attr({
            'aria-selected': true,
            'tabindex': 0
        })[0].focus();

        this.$panels.eq(index).attr({
            'aria-hidden': false,
            'tabindex': 0
        });

        this.emit('update', index);
    };

    var bindEvents = function bindEvents() {
        var _this = this;

        this.$tabs.on('click', function (e) {
            activate.call(_this, _this.$tabs.index(e.currentTarget));
        });
        this.$tabs.on('keydown', function (e) {
            keyEvents.call(_this, e);
        });
        this.$panels.on('keydown', function (e) {
            if (!e.ctrlKey) return;
            keyEvents.call(_this, e);
        });
        if (this.opts.hashEnabled) {
            $(window).on('hashchange', function () {
                checkHash.call(_this);
            });
        }
    };

    var addAriaAttributes = function addAriaAttributes() {
        var _this2 = this;

        if (!this.$tablist.attr('role')) {
            this.$tablist.attr('role', 'tablist');
        }

        this.$tabs.each(function (i, tab) {
            $(tab).attr({
                'role': 'tab',
                'tabindex': i === _this2.index ? 0 : -1,
                'aria-selected': i === _this2.index ? true : false,
                'id': _this2.opts.prefix + _this2.count + '-' + (i + 1)
            });
        });

        this.$panels.each(function (i, panel) {
            $(panel).attr({
                'role': 'tabpanel',
                'tabindex': i === _this2.index ? 0 : -1,
                'aria-hidden': i === _this2.index ? false : true,
                'aria-labelledby': _this2.opts.prefix + _this2.count + '-' + (i + 1)
            });
        });
    };

    var checkHash = function checkHash() {
        var _this2 = this;

        if (document.location.hash) {
            // find tab with that hash
            var hashKey = document.location.hash.split('#')[1];
            var $selectedTab = this.$tabs.filter('[data-hash="'+hashKey+'"]');

            // activate tab with that hash
            if ($selectedTab.length > 0) {
                activate.call(_this2, $selectedTab.index());
            }
        }
    };

    var Tabs = function Tabs(el, options) {
        count += 1;
        this.count = count;

        this.opts = $.extend({}, defaults, options);

        this.$el = $(el);
        this.$tablist = this.$el.find(this.opts.tablist);
        this.$tabs = this.$el.find(this.opts.tab);
        this.$panels = this.$el.find(this.opts.panel);

        this.len = this.$tabs.length;
        this.index = 0;

        addAriaAttributes.call(this);
        bindEvents.call(this);
        if (this.opts.hashEnabled) {
            checkHash.call(this);
        }
    };

    eventHandler(Tabs);

    Tabs.prototype.activate = activate;
    Tabs.prototype.activateNext = activateNext;
    Tabs.prototype.activatePrevious = activatePrevious;

    return Tabs;

})(jQuery,eventHandler);
