'use strict';

import * as $ from 'jquery';
import * as eventHandler from 'c2-event-handler';

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

var activatePrevious = function () {
    let previous = this.index - 1;
    if (previous < 0) {
        previous = this.len - 1;
    }
    activate.call(this, previous);
};

var activateNext = function () {
    let next = this.index + 1;
    if (next >= this.len) {
        next = 0;
    }
    activate.call(this, next);
};

var keyEvents = function (e, index) {
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

var activate = function (index) {
    if (index === this.index) return;
    const previous = this.index;
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

var bindEvents = function () {
    var _this = this;

    this.$tabs.on('click', e => {
        activate.call(this, this.$tabs.index(e.currentTarget));
    });
    this.$tabs.on('keydown', e => {
        keyEvents.call(this, e);
    });
    this.$panels.on('keydown', e => {
        if (!e.ctrlKey) return;
        keyEvents.call(this, e);
    });
    if (this.opts.hashEnabled) {
        $(window).on('hashchange', function () {
            checkHash.call(_this);
        });
    }
};

var addAriaAttributes = function () {
    if (!this.$tablist.attr('role')) {
        this.$tablist.attr('role', 'tablist');
    }

    this.$tabs.each((i, tab) => {
		var tabId = $(tab).attr('id');
		
        $(tab).attr({
            'role': 'tab',
            'tabindex': (i === this.index) ? 0 : -1,
            'aria-selected': (i === this.index) ? true : false,
        });
		
		if (!tabId) {
			$(tab).attr({
				'id': this.opts.prefix + this.count + '-' + (i + 1)
			});
		}
    });

    this.$panels.each((i, panel) => {
		var labelledBy = $(panel).attr('aria-labelledby');
		
        $(panel).attr({
            'role': 'tabpanel',
            'tabindex': (i === this.index) ? 0 : -1,
            'aria-hidden': (i === this.index) ? false : true,
        });
		
		if (!labelledBy) {
			$(panel).attr({
				'aria-labelledby': this.opts.prefix + this.count + '-' + (i + 1)
			});
		}
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

var Tabs = function (el, options) {
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

export default Tabs;
