var $ = require('jquery');
var Tabs = require('../../cjs/tabs.js');

var basicTabs = new Tabs('#Example1');
basicTabs.on('update', function (i) {
    console.log(i);
});

var hashTabs = new Tabs('#Example2', {
    hashEnabled: true,
    firstOpen: 2
});

$('button.destroy').click(function() {
    basicTabs.destroy();
});

$('button.enable').click(function() {
    basicTabs = new Tabs('#Example1');
});
