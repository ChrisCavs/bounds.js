# bounds.js

[![bounds.js on NPM](https://img.shields.io/npm/v/bounds.js.svg?style=flat-square)](https://www.npmjs.com/package/bounds.js)

Asynchronous boundary detection.

Demo coming soon.

### Why

There are many cases where we need to know the relative visibility of 2 elements - whether you're lazy-loading images, implementing an infinitely scrolling website, or creating an animation.  

Historically, implementing this detection required a mix of event handlers, loops, and calls to [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect).  Since all of these operations run on the main thread, performance would often suffer in the process.

bounds.js defies these expectations.  It detects intersections between elements asynchronously, keeping complex features off the main thread and improving performance.

## Usage

Follow these steps to get started:

1. [Install](#install)
2. [How to Use](#howtouse)
3. [Options](#options)
4. [API](#api)
5. [Browser Support](#browsersupport)

## Install

Using NPM, install bounds.js, and save it to your `package.json` dependencies.

```bash
$ npm install bounds.js --save
```

Then, import bounds.js, naming it according to your preference.

```es6
import bounds from 'bounds.js'
```

## How to Use

The first step is to create a new boundary using bounds.js.  To do so, call bounds.js, passing in your desired options.  Each option and its default is explained in the [options](#options) section below.

```es6
const boundary = bounds(options)
```

The second step is to have your new boundary [watch](#watch) for certain elements on you webpage.  When these elements intersect with the boundary, a callback is executed.  See an example below:

```es6
const image = document.querySelector('img')
const whenImageEnters = (ratio) => {
  // change color
}
const whenImageLeaves = (ratio) => {
  // reset color
}

boundary.watch(image, whenImageEnters, whenImageLeaves)
```

Now that we've covered the basic use case for bounds.js, lets delve into the [options](#options) and [API](#api).

## Options

You are not required to pass any options during boundary creation.  All options come with sensible defaults, shown below:

```es6
// default options
{
  root: window,       // the top-level document's viewport
  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  threshold: 0.0,
  onEmit: () => {}    // no-op
}
```

Explanation of each option follows:

* [root](#root)
* [margins](#margins)
* [threshold](#threshold)
* [onEmit](#onEmit)

### root

Accepts a `DOM node`.

The root is the element for which we are creating the boundary.  Events will be emitted whenever a watched element enters/exits the root element.

### margins

Accepts a `mapping`, where values are stated in `pixels`.

You can specify a `top`, `right`, `bottom`, or `left` margin to add to the root's [bounding box](https://developer.mozilla.org/en-US/docs/Glossary/bounding_box). *This affects detection, NOT style* on the root element.  For example:

```es6
const boundary = bounds({
  margins: {
    bottom: 100,
  }
})
```

The above boundary will fire a callback for any watched element that gets within 100px of its bottom border.

### threshold

Accepts a `number` between `0.0` and `1.0`.

The ratio of intersecting area required before a callback is made.  A threshold of `0.0` means that if even a single pixel of a watched element enters the boundary, a callback is made.  A threshold of `1.0` means that every pixel of a watched element must be inside the boundary before a callback is made.

### onEmit

Accepts a `function` or anonymous function.

The provided callback will be executed whenever any watched element enters or exits the boundary, *once all individual callbacks have executed*.  This is a useful option if you'd like some action to take place no matter what element enters/exits your boundary.  Here is an example of how it can be used:

```es6
const boundary = bounds({
  onEmit: (actions) => {
    if (actions.some(action => action.inside)) {
      console.log('At least one element is inside my boundary')
    }
  }
})
```

As seen above, the `onEmit` callback will be passed an argument `actions`, which is an array of objects representing the actions taken directly beforehand.  Each object in `actions` has the following detail:

```es6
{
  el,       // DOM node
  inside,   // boolean
  outside,  // boolean
  ratio     // floating number
}
```

## API

When you create a new boundary with bounds.js, an object with a set of methods will be returned.  Those methods are:

* [watch](#watch)
* [unWatch](#unwatch)
* [check](#check)
* [clear](#clear)

Additionally, the bounds.js import object has a static property:

* [checkCompatibility](#checkcompatibility)

### watch(el [, onEnter, onLeave])

Calling `watch` will instruct your boundary to watch the desired element.  When the specified element enters your boundary, the `onEnter` callback will be executed.  When the specified element leaves your boundary, the `onLeave` callback will be executed.  When a callback is executed, it is

```es6
const boundary = bounds()

const img = document.querySelector('img')
const onImgEnter = () => {
  console.log('the img is inside the boundary')
}
const onImgLeave = () => {
  console.log('the img is outside the boundary')
}

boundary.watch(img, onImgEnter, onImgLeave)
```

The `watch` method *will return a data object with the assigned properties*.  These properties can be mutated.  For exmaple, assuming we had the same methods as above:

```es6
// you can choose to not initially provide callbacks
const imgOptions = boundary.watch(img)

// later, you can assign new callbacks
imgOptions.onEnter = onImgEnter
imgOptions.onLeave = onImgLeave
```

### unWatch(el)

The `unWatch` method will instruct your boundary to stop watching a certain element.  Callbacks for that element will no longer be executed.  The boundary instance will be returned.

### check(el)

The `check` method will return a `boolean`, indicating if the provided element is currently inside the boundary.

### clear()

The `clear` method will effectively `unWatch` all elements for the boundary, destroy all history for the elements the boundary was watching, and ensure that no events are emitted by the boundary going forward.

## Browser Support

bounds.js depends on the following browser APIs:

* [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)

Consequently, it supports the following natively:

* Chrome 51+
* Firefox 55+
* Safari 12.1+
* Edge 15+
* iOS Safari 12.2+
* Chrome for Android 51+
* Opera - Supported
* IE - No Support

For browsers that do not currently support `IntersectionObserver`, consider a popular [polyfill](https://www.npmjs.com/package/intersection-observer) that has great browser support.

## License

[MIT](https://opensource.org/licenses/MIT). © 2019 Christopher Cavalea