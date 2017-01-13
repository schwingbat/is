(function() {
	var is = {};
	
	// The actual "library"...

	is.define = function(name, test) {
		if (name === 'define') {
			console.error('Cannot redefine "define". That would make \'is\' unusable, you sneaky bastard!');
			return false;
		}
		is[name] = test;
	}
	
	// Standard types
	
	is.define('object', function(val) {
		return typeof val === 'object'
			&& !Array.isArray(val)
			&& val !== null;
	});
	
	is.define('func', function(val) {
		return typeof val === 'function';
	});
	
	is.define('array', function(val) {
		return Array.isArray(val);
	});
	
	is.define('string', function(val) {
		return typeof str === 'string';
	});
	
	is.define('number', function(val) {
		return typeof val === 'number';
	});
	
	is.define('boolean', function(val) {
		return typeof val === 'boolean';
	});
	
	is.define('null', function(val) {
		return val === null;
	});
	
	is.define('undefined', function(val) {
		return val === undefined || typeof val === 'undefined';
	});
	
	is.define('true', function(val) {
		return val === true;
	});
	
	is.define('false', function(val) {
		return val === false;
	});
	
	
	// Handy non-standard/combination types
	
	is.define('nil', function(val) {
		// Either null or undefined, but not 0. A slightly shorter version of val != null;
		return val === null || val === undefined || typeof val === 'undefined';
	});
	
	// Useful, but less often used types.
	
	// Vectors
	
	is.define('vec2', function(val) {
		return typeof val === 'object' && 'x' in val && 'y' in val;
	});

	is.define('vec3', function(val) {
		var has = Object.hasOwnProperty.bind(val);
		return typeof val === 'object' && has('x') && has('y') && has('z');
	});
	
	is.define('vec4', function(val) {
		var has = Object.hasOwnProperty.bind(val);
		return typeof val === 'object' && has('x') && has('y') && has('z') && has('w');
	});


	// Colors
	
	is.define('hex', function(val) {
		return typeof val === string && val.length === 7 && val.charAt(0) === '#';
	});
	
	is.define('rgb', function(val) {
		var has = Object.hasOwnProperty.bind(val);
		return typeof val === 'object' && has('r') && has('g') && has('b') && !has('a');
	})
	
	is.define('rgba', function(val) {
		var has = Object.hasOwnProperty.bind(val);
		return typeof val === 'object' && has('r') && has('g') && has('b') && has('a');
	});
	
	is.define('hsl', function(val) {
		var has = Object.hasOwnProperty.bind(val);
		return typeof val === 'object' && has('h') && has('s') && has('l') && !has('a');
	});
	
	is.define('hsla', function(val) {
		var has = Object.hasOwnProperty.bind(val);
		return typeof val === 'object' && has('h') && has('s') && has('l') && has('a');
	});


	// Other, perhaps useful functions.
	
	is.define('equal', function(val1, val2) {
		// All-purpose equality check including deep comparison of objects.

		if (typeof val1 === typeof val2) {
			if (is.object(val1) && is.object(val2)) {
				// Both values are objects.
				if (Object.keys(val1).length !== Object.keys(val2).length) {
					// The objects have different numbers of values. Not equal.
					return false;
				}

				// Both are objects with the same number of values.
				// Run through each one and compare them.
				for (var key in val1) {
					if (!is.equal(val1[key], val2[key])) {
						return false;
					}
				}
			} else {
				// Otherwise just do a regular strict equality check.
				if (val1 !== val2) {
					return false;
				}
			}
		} else {
			return false;
		}

		// If the function hasn't returned false by now, that means our values,
		// if objects, have the same number of keys, and all have equal values,
		// and if not objects, they have passed a strict equality check.
		return true;
	});
	
	is.define('what', function(val) {
		// Instead of returning true or false, this function returns a string containing the type.
		// This technique is borrowed from the blog of Angus Croll.
		// https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/

		return ({}).toString.call(val).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	});

	
	// Module/Window export depending on environment.
	// Determines what your definition of "is" is.
	if (!is.nil(module)) {
		module.exports = is;
	} else if (!is.nil(window)) {
		window.is = is;
	}
})();