/*!
 * c2-tabs
 * https://github.com/TheC2Group/tabs
 * @version 2.2.4
 * @license MIT (c) The C2 Group (c2experience.com)
 */
var Tabs = (function ($,eventHandler) { 'use strict';

    var count = 0;

    var defaults = {
        tablist: '.tablist',
        tab: '.tab',
        panel: '.panel',
        prefix: 'Tabs-',
        hashEnabled: false,
        direction: 'horizontal' // other option is 'vertical'
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
        if (e.which === keys.left && this.opts.direction === 'horizontal') {
            e.preventDefault();
            activatePrevious.call(this, index);
            return;
        }
        if (e.which === keys.right && this.opts.direction === 'horizontal') {
            e.preventDefault();
            activateNext.call(this, index);
            return;
        }
        if (e.which === keys.up && this.opts.direction === 'vertical') {
            e.preventDefault();
            activatePrevious.call(this, index);
            return;
        }
        if (e.which === keys.down && this.opts.direction === 'vertical') {
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
        var self = this;

        self.$tabs.on('click', function (e) {
            activate.call(self, self.$tabs.index(e.currentTarget));
        });

        self.$tabs.on('keydown', function (e) {
            keyEvents.call(self, e);
        });

        self.$panels.on('keydown', function (e) {
            if (!e.ctrlKey) return;
            keyEvents.call(self, e);
        });

        $(window).on('hashchange', function () {
            if (self.opts.hashEnabled && self._enabled) {
                checkHash.call(self);
            }
        });
    };

    var unbindEvents = function unbindEvents() {
        this.$tabs.off('click keydown');

        this.$panels.off('keydown');

        this._enabled = false;
    };

    var addAriaAttributes = function addAriaAttributes() {
        var _this = this;

        if (!this.$tablist.attr('role')) {
            this.$tablist.attr('role', 'tablist');
        }

        this.$tabs.each(function (i, tab) {
            var tabId = $(tab).attr('id');

            $(tab).attr({
                'role': 'tab',
                'tabindex': i === _this.index ? 0 : -1,
                'aria-selected': i === _this.index ? true : false
            });

            if (!tabId) {
                $(tab).attr({
                    'id': _this.opts.prefix + _this.count + '-' + (i + 1)
                });
            } else {
                $(tab).attr('data-original-id', true);
            }
        });

        this.$panels.each(function (i, panel) {
            var labelledBy = $(panel).attr('aria-labelledby');

            $(panel).attr({
                'role': 'tabpanel',
                'tabindex': i === _this.index ? 0 : -1,
                'aria-hidden': i === _this.index ? false : true
            });

            if (!labelledBy) {
                $(panel).attr({
                    'aria-labelledby': _this.opts.prefix + _this.count + '-' + (i + 1)
                });
            } else {
                $(panel).attr('data-original-labelledBy', true);
            }
        });
    };

    var removeAriaAttributes = function removeAriaAttributes() {
        this.$tablist.removeAttr('role');

        this.$tabs.each(function (i, tab) {
            var tabId = $(tab).attr('id');

            if (!$(tab).attr('data-original-id')) {
                $(tab).removeAttr('id');
            }

            $(tab).removeAttr('role tabindex aria-selected data-original-id');
        });

        this.$panels.each(function (i, panel) {
            var labelledBy = $(panel).attr('aria-labelledby');

            if (!$(panel).attr('data-original-labelledBy')) {
                $(panel).removeAttr('aria-labelledby');
            }

            $(panel).removeAttr('role tabindex aria-hidden data-original-labelledBy');
        });
    };

    var destroy = function destroy() {
        removeAriaAttributes.call(this);
        unbindEvents.call(this);
    };

    var checkHash = function checkHash() {
        var self = this;

        if (document.location.hash) {
            // find tab with that hash
            var hashKey = document.location.hash.split('#')[1];
            var $selectedTab = self.$tabs.filter('[data-hash="' + hashKey + '"]');

            // activate tab with that hash
            if ($selectedTab.length > 0) {
                activate.call(self, $selectedTab.index());
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
        this._enabled = true;

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
    Tabs.prototype.destroy = destroy;

    return Tabs;

})(jQuery,eventHandler);