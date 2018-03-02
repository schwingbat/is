# is.js

`is` is my attempt at simultaneously fixing JavaScript's awkward type checking and doing it with a nice, extendable and readable API. What's wrong with type checking in JS? The `typeof` keyword returns `"object"` for both objects and arrays. Wow, so helpful. Thanks JavaScript. Determining whether that thing is in fact an array or object involves calling `Array.isArray(thing)`, checking if it has a `.length` property or some other such nonsense, and it will also simply return `"object"` for any custom "types" (particular object configurations), which means an operator meant for checking types doesn't actually do its one and only job with enough specificity to be useful. `!thing` returns `true` for either `null`, `undefined` or `0`. I almost never consider `0` to be falsy. I know it's a holdover from C, but JS has had a boolean type from the start. Not including `0` is a simple as `thing == null`, which is equivalent to `thing === null || thing === undefined`, which is something you'd likely never guess and is non-obvious at a glance. Already we're mixing unary operators, binary operators, function calls and duck typing just to manage some basic goddamn types.

## Try this instead:

```javascript
var object = {
	value: "Hello, I'm an object"
}

var array = ["Hello", "I'm", "an", "array"];

console.log(is.object(object)) // returns true
console.log(is.object(array)) // returns false
```

Much better, but how does `is` know the difference between the two? It runs this function on the value:

```javascript
function(val) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && val !== null;
}
```

All of JavaScript's type annoyances are still there, but they're abstracted away where you don't even have to care that they exist. `is` itself is an object with a method called `define` which you can use to define your own 'types'. For example, that object function above is implemented like this:

```javascript
is.define('object', function(val) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && val !== null;
});
```

You don't even have to use `define` if you don't want to. `is` is literally just a regular object.

```javascript
is.object = function(val) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && val !== null;
}
```

You could write `is` yourself in 5 seconds. Fortunately, I already did. `is` comes with all the basic types predefined, but you can also define whatever else you might find useful:

```javascript
is.define("vector3", function(val) {
	return is.array(val) && val.length === 3;
});

var possibleVector3 = [25.3, 17, 992];

// Then just use it like this:
console.log(is.vector3(possibleVector3)) // returns true!
```

...or even...

```javascript
is.define("is", function(val) {
	return val.hasOwnProperty("define") && is.func(val.define);
});

console.log(is.is(is)) // sure, why not?
```

It basically goes on like that. That's all there is to it. You can use `is` to validate pretty much anything you want. Check out the `is.js` file for a bunch more included types.