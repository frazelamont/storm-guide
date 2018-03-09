# Storm Guide
[![npm version](https://badge.fury.io/js/storm-guide.svg)](https://badge.fury.io/js/storm-guide)

GDS-style guide pattern implementation

## Example
[https://stormid.github.io/storm-guide](https://stormid.github.io/storm-/guide)
    

## Usage
HTML
```
<div class="guide js-guide">
    <ol class="guide__navigation">
        <li class="guide__item"><a href="#section-1" class="js-guide__link guide__link">Section 1</a></li>
        <li class="guide__item"><a href="#section-2" class="js-guide__link guide__link">Section 2</a></li>
        <li class="guide__item"><a href="#section-3" class="js-guide__link guide__link">Section 3</a></li>
    </ol>
    <section id="section-1" class="tab js-guide__section guide__section">
        One
    </section>
    <section id="section-2" class="tab js-guide__section guide__section">
        Two
    </section>
    <section id="section-3" class="tab js-guide__section guide__section">
        Three
    </section>
    <div class="js-guide__incremental guide__incremental">
</div>
```

JS
```
npm i -S storm-guide
```
either using es6 import
```
import Guide from 'storm-guide';

Guide.init();
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-guide.standalone.js')
    .then(() => {
        StormGuide.init();
    });
```

## Options
```
    {
		linkClassName: '.js-guide__link',
		sectionClassName: '.js-guide__section',
		incrementalNavHolder: '.js-guide__incremental',
		activeClassName: 'active'
    }
```

e.g.
```
Guide.init({
    activeClassName: 'current'
});
```

## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

This module depends upon Object.assign available in all evergreen browsers. ie9+ is supported with polyfills, ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT