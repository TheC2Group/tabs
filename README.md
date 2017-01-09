tabs
====

> Accessible tabs, where aria states are automatically added.


To get Started
--------------

### CommonJS

```
$ npm install c2-tabs
```

```js
var Tabs = require('c2-tabs');
```

### Browser Global

```html
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="iife/tabs.js"></script>
```


Options
-------

| Option | Type | Default Value | Info |
| ------ | ---- | ------------- | ---- |
| tablist | string | '.tablist' | refers to the selector on the tablist |
| target | string | '.tab' | refers to the selector on the tabs |
| panel | string | '.panel' | refers to the selector on the tab panels |
| prefix | string | 'Tabs-' | sets the prefix for the aria label |
| hashEnabled | boolean | false | activates tabs based on URL hash (also requires 'data-hash' attribute on each tab) |


API
---

```js
var tabs = new Tabs('.Tabs');

tabs.on('update', i => {
    console.log('index', i); // index 0, index 1, index 0
});

tabs.activate(0); // activates tab with a specific index
tabs.activateNext();
tabs.activatePrevious();
```


Accessibility
-------------

[http://www.w3.org/TR/wai-aria-practices/#tabpanel](http://www.w3.org/TR/wai-aria-practices/#tabpanel)

I left out the ctrl + pageup and ctrl + pagedown interactions, since those are already used to switch between browser tabs in Firefox and Chrome.


License
-------

MIT © [The C2 Group](https://c2experience.com)
