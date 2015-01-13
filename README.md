Angular drag-and-drop
=====================

Declarative drag and drop with zero dependencies in Angular.js

Copyright (C) 2015, Geoff Goodman (https://github.com/ggoodman)



Installation
------------

Several installation options:
* Bower: `bower install ggoodman/angular-drag-drop --save`
* Download from github: [angular-drag-drop.min.js](https://raw.github.com/ggoodman/angular-drag-drop/master/dist/angular-drag-drop.min.js)



Demo
----

[Dragular](http://bit.ly/17E25d2) - Drag tiles around like the famous
[Sliding Puzzle](http://en.wikipedia.org/wiki/Sliding_puzzle) using angular drag and drop.

Usage
-----

Include angular-load.js in your application.

```html
<script src="bower_components/angular-drag-drop/angular-drag-drop.js"></script>
```

Add the module `filearts.dragDrop` as a dependency to your app module:

```js
var myapp = angular.module('myapp', ['filearts.dragDrop']);
```



### `drag-container`

Define a DOM element that will become draggable and determines what the data associated with the drag event is.

**Example**

```html
<div drag-container="model"
  mime-type="text/plain" <!-- optional -->
  on-drag-start="onDragStart($event, data)" <!-- optional -->
  on-drag-end="onDragEnd($event, data)" <!-- optional -->
></div>
```

Attribute | Required? | Description
----------|-----------|------------
`drag-container` | Yes | Set the scope model to associate with dragging the selected element
`mime-type` | No | Set the mime type of the model data being dragged

The following callbacks are optional. Each can allow you to inject two special objects, `$event` and `data`:
* `on-drag-start`
* `on-drag-end`



### `drop-container`

Define a DOM element that will accept draggable elements that match the acceptable mime types.

**Example**

```html
<div drop-container
  accepts="['text/plain']" <!-- optional -->
  on-drag-enter="onDragStartEnter($event, data)" <!-- optional -->
  on-drag-over="onDragOver($event, data)" <!-- optional -->
  on-drag-leave="onDragLeave($event, data)" <!-- optional -->
  on-drop="onDrop($event, data)" <!-- optional -->
></div>
```

Attribute | Required? | Description
----------|-----------|------------
`accepts` | No | Define an array of or single string representing acceptable mime-types to be dropped

The following callbacks are optional. Each can allow you to inject two special objects, `$event` and `data`:
* `on-drag-enter`
* `on-drag-over`
* `on-drag-leave`
* `on-drop`



### `drop-target`

Define a region of the parent `drop-container` that can independently accept drag and drop events.

**Must be a child of a `drop-container`**

**Example**

```html
<div drop-target="top-right"
  on-drag-enter="onDragStartEnter($event, data)" <!-- optional -->
  on-drag-over="onDragOver($event, data)" <!-- optional -->
  on-drag-leave="onDragLeave($event, data)" <!-- optional -->
  on-drop="onDrop($event, data)" <!-- optional -->
></div>
```

Attribute | Required? | Description
----------|-----------|------------
`drop-target` | Yes | Defines the region of the parent `drop-container` that will accept events. Can be one of: `center`, `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`, `top-left`

The following callbacks are optional. Each can allow you to inject two special objects, `$event` and `data`:
* `on-drag-enter`
* `on-drag-over`
* `on-drag-leave`
* `on-drop`



License
-------

Released under the terms of MIT License:

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
