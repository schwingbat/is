;(function makeIs(instance) {
  var is = function(val) {
    // Instead of returning true or false, this function returns a string containing the type.
    // Kind of like typeof, but less bad.
    // This technique is borrowed from the blog of Angus Croll.
    // https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/

    return ({}).toString.call(val).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }
  
  // The actual "library"...

  is.define = function(name, test) {
    if (name === 'define') {
      throw new Error('Cannot redefine `is.define`')
    }
    is[name] = test
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
    return typeof val === 'number'
  })

  is.define('integer', function(val) {
    return is.number(val) && val.toString().indexOf('.') === -1
  })

  is.define('decimal', function(val) {
    return is.number(val) && !is.integer(val)
  })
  
  is.define('boolean', function(val) {
    return typeof val === 'boolean'
  })
  
  is.define('null', function(val) {
    return val === null
  })
  
  is.define('undefined', function(val) {
    return typeof val === 'undefined'
  })
  
  is.define('true', function(val) {
    return val === true
  })
  
  is.define('false', function(val) {
    return val === false
  })
  
  // Handy non-standard/utility types
  
  is.define('nil', function(val) {
    // Either null or undefined, but not 0.
    return val == null
  })
  
  is.define('equal', function(val1, val2) {
    // All-purpose equality-by-value checker.

    if (typeof val1 === typeof val2) {
      if (is.object(val1) && is.object(val2)) {
        // Both values are objects.
        if (Object.keys(val1).length !== Object.keys(val2).length) {
          // The objects have different numbers of values. Not equal.
          return false
        }

        // Both are objects with the same number of values.
        // Run through each one and compare them.
        for (var key in val1) {
          if (!is.equal(val1[key], val2[key])) {
            return false
          }
        }
      } else {
        // Otherwise just do a regular strict equality check.
        if (val1 !== val2) {
          return false
        }
      }
    } else {
      return false
    }

    // If the function hasn't returned false by now, that means our values,
    // if objects, have the same number of keys, and all have equal values,
    // and if not objects, they have passed a strict equality check.
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
})(false)