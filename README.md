tabs
=====

Accessible tabs, where aria states are automatically added. Depends on jQuery and possibly the C2 Accordion widget.

Options
-------

| Option | Type | Default Value | Info |
| ------ | ---- | ------------- | ---- |
| target | string | '.tab' | refers to the class on the tabs |
| panel | string | '.panel' | refers to the class on the tab panels |
| prefix | string | 'Tabs-' | sets the prefix for the aria label |
| firstActive | number | 1 | sets the initial tab that is open |
| breakpoint | number | 0 | converts the tabs to an accordion widget below breakpoint |

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
