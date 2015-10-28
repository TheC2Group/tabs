(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Tabs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * Tabs
 * https://github.com/TheC2Group/tabs
 * @version 1.0.0
 * @license MIT (c) The C2 Group (c2experience.com)
 */

'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);

var count = 0;

var defaults = {
    target: '.tab',
    panel: '.panel',
    prefix: 'Tabs-',
    firstActive: 1
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

var Tabs = function (el, options) {
    count += 1;
    this.count = count;

    this.$el = $(el);
    this.$tablist = this.$el.find('.tablist');
    this.opts = $.extend({}, defaults, options);
    this.$tab = this.$el.find(this.opts.target);
    this.$panel = this.$el.find(this.opts.panel);
    this.firstActive = this.opts.firstActive - 1; // setting it to zero-based
    addAriaAttributes.call(this);
    bindEvents.call(this);
};

Tabs.prototype.activate = activate;

module.exports = Tabs;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});