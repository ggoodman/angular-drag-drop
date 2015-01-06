# Angular drag-and-drop

[DEMO](https://rawgit.com/ggoodman/angular-drag-drop/master/example/index.html)

The idea of this directive is that often you might want to define different
behaviour when you drop an element on a different *part* of the target. You
might, for example, want to insert the item above or below the target in a
list if it is on the top or bottom of the target element. However, if the
drop happens near the middle of the target element, you might want the item
being dropped to become a child of the target. These directives allow you to
define that behaviour in a declarative way.

Angular drag and drop defines a set of three `attribute` directives to 
facilitate creating drag and drop systems.

In the basic case, three things are needed:

1. Mark draggable content with the directive `drag-container`.
2. Mark a droppable area with the directive `drop-container`.
3. Add at least one child of the `drop-container`
   with the directive `drop-target`. This directive accepts the
   `on-drop` handler.

### `drag-container`

Any element with this attribute will become draggable.

TODO: Add a system to allow the container to define the type(s) and data
to attach to drag events.

### `drop-container`

Add this attribute to a container element that should receive drop events. This
directive is not enough to operate alone. It exists to encapsulate drop
*target(s)* to define the area over which dropping is permitted and to form
the basis for calculating which specific drop *target* is activated.

### `drop-target`

**Note: Must be a child of a `drop-container`**

Defines a *target* region of the parent `drop-container` that can receive
drop events. The allowed targets are:

* center
* top
* top-right
* right
* bottom-right
* bottom
* bottom-left
* left
* top-left

If a `drop-target` does not indicate a *target* via the `target`
attribute, the default, `center` target is used.

You can define a callback handler using the `on-drop` attribute. The `$event`
and `target` can be injected into this handler.

