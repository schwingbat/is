# is.js

This is `is`. It's my attempt at simultaneously fixing JavaScript's awkward type checking and doing it with a nice, extendable and readable API. What's wrong with type checking in JS? Well... the `typeof` keyword returns `'object'` for both objects and arrays. So helpful. Thanks JavaScript. Determining whether that thing is in fact an array or object involves calling `Array.isArray(thing)`, checking if it has a `.length` property or some other such nonsense, and it will also simply return `'object'` for any custom "types" (particular object configurations, rather), which means an operator meant for checking types doesn't actually do its one and only job with enough specificity to be useful.

I've done my best to fix that, and I've also included some extra tools for things that start out annoying and become routine. Stuff like `!thing` returning `true` for either `null`, `undefined` or `0`. I almost never consider `0` to be falsy. I know it's a holdover from C, but JS has had a boolean type from the start. Not including `0` is as simple as `thing == null`, which is equivalent to `thing === null || thing === undefined`, which is something you'd likely never guess and is non-obvious at a glance. It's not the best. Already we're mixing unary operators, binary operators, function calls and duck typing just to manage some basic goddamn types.

## Try this instead:

```javascript
var object = {
  value: "Hello, I'm an object"
}

var array = ["Hello", "I'm", "an", "array"]

is.object(object) // returns true
is.object(array) // returns false
is.array(array) // returns true
is.number('not a number') // returns false

// You can also use it like typeof for built-in types instead of checking against a specific type

is(object) // returns 'object'
is(array) // returns 'array'
is(12345) // returns 'number'
is('what is this?') // returns 'string'
```

All of JavaScript's type annoyances are still there, but they're abstracted away where you don't even have to care that they exist. `is` itself is a function, which are actually callable objects that can have properties and methods attached. One of these is a function called `define` which you can use to define your own 'types'. For example, that `is.object` function above is implemented like this:

```javascript
is.define('object', function(val) {
  return typeof val === 'object'
    && !Array.isArray(val)
    && val !== null
})
```

It's super simple. You could write `is` yourself in a few minutes. Fortunately, I already did. `is` comes with all the basic types predefined, but you can also define whatever else you might find useful:

```javascript
is.define('vector3', function(val) {
  return is.array(val) && val.length === 3
})

var possibleVector3 = [25.3, 17, 992]

// Then just use it like this:
is.vector3(possibleVector3) // returns true!
```

...or even...

```javascript
is.define('is', function(val) {
  return val.hasOwnProperty('define') && is.func(val.define)
})

is.is(is) // indeed
```

It basically goes on like that. That's pretty much all there is to it. You can use `is` to validate pretty much anything you want because you can use functions to validate pretty much anything you want. `is` just groups them together and makes them look nice. Check out the `is.js` file for the full list of included types.

## Instances

Depending on your program, you might find you want to have multiple copies of `is` with their own separate definitions. Create a new instance like so:

```javascript
var instance = is.instance()

instance.define('hexColor', function(val) {
  return is.string(val) && val.length === 7 && val[0] === '#'
})

instance.hexColor('#ff0088') // true
is.hexColor('#ff0088') // TypeError: is.hexColor is not a function
```

You can define as many properties as you want on an instance and it won't pollute the global copy of `is`. In fact, if you wanted to you could nest instances inside the global `is`:

```javascript
is.color = is.instance()

is.color.define('hex', function(val) {
  return is.string(val) && val.length === 7 && val[0] === '#'
})

is.color.define('rgb', function(val) {
  return is.object(val) && val.r && val.g && val.b
})

is.color.hex('#ffffff') // true
is.color.rgb({ r: 128, g: 62, b: 232 }) // true
```

But I digress. Set it up however you want, or just use it out of the box. Hopefully you find it useful. Require it in Node, use a script tag in HTML. It should work just about anywhere. Have fun!

# Negation

