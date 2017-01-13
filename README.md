# Is.js

`is` is my attempt at unifying JavaScript's stupid type situation. Did you know the `typeof` keyword returns "object" for both objects... and arrays? Wow, so helpful. Thanks JavaScript.

## Try this instead:

```javascript
var object = {
	value: "Hello, I'm an object"
}

var array = ["Hello", "I'm", "an", "array"];

console.log(is.object(object)) // returns true
console.log(is.object(array)) // returns false
```

Much better.

`is` itself is an object with a method called `define` which you can use to define your own 'types'. For example:

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