# is.js

```bash
$ npm i @schwingbat/is
```

Type checking in JS is stupid. `is` is also stupid, but it's more fun.

## Check it:

```javascript
var object = {
  value: "Hello, I'm an object"
}

var array = ["Hello", "I'm", "an", "array"]

is.object(object) // returns true
is.object(array) // returns false
is.array(array) // returns true
is.number('not a number') // returns false

// You can also use is.what() like typeof for built-in types instead of checking against a specific type

is.what(object) // returns 'object'
is.what(array) // returns 'array'
is.what(12345) // returns 'number'
is.what('what is this?') // returns 'string'
```

JavaScript's type annoyances are still there, but they're abstracted away where you don't have to care that they exist. `is` in an object with a couple of built in properties. One of these is a function called `define` which you can use to define your own 'types'. For example, that `is.object` function above is implemented like this:

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

Depending on your program, you might find you want to have multiple copies of `is` with their own separate definitions. An example in node might look like this:

```javascript
var is = require('@schwingbat/is').instance()
var is2 = require('@schwingbat/is').instance()

is.define('hexColor', function(val) {
  return is.string(val) && val.length === 7 && val[0] === '#'
})

is.hexColor('#ff0088') // true
is2.hexColor('#ff0088') // TypeError: is.hexColor is not a function
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