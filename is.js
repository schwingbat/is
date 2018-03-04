(function makeIs(instance) {
  var is = function(val) {
    // Instead of returning true or false, this function returns a string containing the type.
    // Kind of like typeof, but less bad.
    // This technique is borrowed from the blog of Angus Croll.
    // https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/

    return ({}).toString.call(val).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  // Aliases: is.an.integer(5), is.a.string('test')

  is.a = is
  is.an = is
  
  // Some tricksy negation.

  is.not = {}
  is.not.a = is.not
  is.not.an = is.not

  // The actual "library"...

  is.define = function(name, test) {
    if (name === 'define') {
      throw new Error('Cannot redefine `is.define`')
    }
    is[name] = test
    is.not[name] = function(val) {
      return !test(val)
    }
  }

  is.instance = function() {
    return makeIs(true)
  }

  // Standard types
  
  is.define('object', function(val) {
    return typeof val === 'object'
      && !Array.isArray(val)
      && val !== null
  })
  
  is.define('func', function(val) {
    return typeof val === 'function'
  })
  
  is.define('array', function(val) {
    return Array.isArray(val)
  })
  
  is.define('string', function(val) {
    return typeof val === 'string'
  })
  
  is.define('number', function(val) {
    return typeof val === 'number' && !isNaN(val)
  })

  is.define('integer', function(val) {
    return is.number(val) && val % 1 === 0
  })

  is.define('decimal', function(val) {
    return is.number(val) && val % 1 !== 0
  })
  
  is.define('boolean', function(val) {
    return val === true || val === false
  })
  
  is.define('null', function(val) {
    return val === null
  })
  
  is.define('undefined', function(val) {
    return val === undefined
  })

  is.define('defined', function(val) {
    return val !== undefined
  })
  
  is.define('true', function(val) {
    return val === true
  })
  
  is.define('false', function(val) {
    return val === false
  })

  is.define('nan', function(val) {
    return isNaN(val)
  })
  
  // Handy non-standard/utility types
  
  is.define('what', is) // If you prefer is.what(thing) instead of is(thing)
  is.define('wat', is)
  is.define('co', is)
  is.define('stupid', function(val) {
    return val.toLowerCase() === 'morgan'
  })

  is.define('nil', function(val) {
    // Either null or undefined, but not 0.
    return val == null
  })
  
  is.define('equal', function(one, two) {
    // All-purpose recursive equality-by-value checker.

    // Don't bother checking values if identity is equal.
    if (one === two) {
      return true
    }

    // Make sure they're at least the same type.
    if (is(one) === is(two)) {
      var type = is(one)

      if (type === 'object') {
        // Compare key counts, then recursively compare values if that passes.
        if (Object.keys(one).length !== Object.keys(two).length) {
          return false
        }

        // Same number of keys. Compare each.
        for (var key in one) {
          if (!is.equal(one[key], two[key])) {
            return false
          }
        }
      } else if (type === 'array') {
        // Compare lengths, then compare index by index.
        if (one.length !== two.length) {
          return false
        }

        for (let i = 0; i < one.length; i++) {
          if (!is.equal(one[i], two[i])) {
            return false
          }
        }
      } else {
        // Otherwise just do a regular strict equality check.
        if (one !== two) {
          return false
        }
      }
    } else {
      return false
    }

    // If the function hasn't returned false by now, that means our values share a type,
    // if objects or arrays, have the same number of keys, and all have passed a recursive
    // equality check. If not objects or arrays, both have passed a strict equality check.
    return true
  })
  
  // Module/Window export depending on environment.
  // Determines what your definition of "is" is.
  if (instance) {
    return is
  } else if (!is.nil(module)) {
    module.exports = is
  } else if (!is.nil(window)) {
    window.is = is
  } else if (!is.nil(global)) {
    global.is = is
  }
})(false);