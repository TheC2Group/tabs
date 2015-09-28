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
var Accordion = require('c2-tabs');
```

### Browser Global

```html
<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="standalone/tabs.js"></script>
```


Options
-------

| Option | Type | Default Value | Info |
| ------ | ---- | ------------- | ---- |
| target | string | '.tab' | refers to the class on the tabs |
| panel | string | '.panel' | refers to the class on the tab panels |
| prefix | string | 'Tabs-' | sets the prefix for the aria label |
| firstActive | number | 1 | sets the initial tab that is open |


API
---

```js
var tabs = new Tabs('.Tabs');

tabs.activate(0);    // activates tab with a specific index

```


Browser Compatibility
---------------------

Requires matchMedia polyfill for IE9 and below.


Accessibility
-------------

[http://www.w3.org/TR/wai-aria-practices/#tabpanel](http://www.w3.org/TR/wai-aria-practices/#tabpanel)

I left out the ctrl + pageup and ctrl + pagedown interactions, since those are already used to switch between browser tabs in Firefox and Chrome.


License
-------

MIT © [The C2 Group](https://c2experience.com)
