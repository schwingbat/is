const is = require('./is')

describe('is', function() {
  it('is a function', function() {
    expect(typeof is).toBe('function')
  })

  it('correctly identifies basic types when called as a function', function() {
    expect(is('string')).toBe('string')
    expect(is(5)).toBe('number')
    expect(is({})).toBe('object')
    expect(is([1, 2, 3])).toBe('array')
    expect(is(null)).toBe('null')
    expect(is(undefined)).toBe('undefined')
    expect(is(is)).toBe('function')
  })
})

describe('is.define', function() {
  it('is a function', function() {
    expect(typeof is.define).toBe('function')
  })

  it('defines a named function on the `is` object', function() {
    is.define('testThing', function() {
      return true
    })

    expect(typeof is.testThing).toBe('function')
    expect(is.testThing()).toBe(true)
  })

  it('does not allow redefining of itself', function() {
    expect(function() {
      is.define('define', function() {
        return 'NOPE'
      })
    }).toThrow()
  })
})

describe('is.instance', function() {
  it('is a function', function() {
    expect(typeof is.instance).toBe('function')
  })

  it('creates a new instance of `is`', function() {
    const instance = is.instance()

    expect(typeof instance.define).toBe('function')
  })

  it('should not pollute the global `is` when properties are added to an instance', function() {
    const instance = is.instance()

    instance.define('test1', function() {
      return true
    })

    instance.define('test2', function() {
      return true
    })

    expect(typeof instance.test1).toBe('function')
    expect(typeof instance.test2).toBe('function')

    expect(typeof is.test1).toBe('undefined')
    expect(typeof is.test2).toBe('undefined')
  })
})

describe('is.object', function() {
  it('correctly identifies objects and rejects non-objects', function() {
    expect(is.object({})).toBe(true)
    expect(is.object({ text: 'Hello, I am indeed an object' }))
    expect(is.object([1, 2, 3])).toBe(false)
    expect(is.object(5)).toBe(false)
    expect(is.object('a string')).toBe(false)
    expect(is.object(null)).toBe(false)
    expect(is.object(undefined)).toBe(false)
  })
})

describe('is.number', function() {
  it('is a function', function() {
    expect(typeof is.number).toBe('function')
  })
})

describe('is.integer', function() {
  it('is a function', function() {
    expect(typeof is.integer).toBe('function')
  })

  it('identifies numbers with no fractional component as an integer', function() {
    expect(is.integer(1)).toBe(true)
    expect(is.integer(15)).toBe(true)
    expect(is.integer(908429038402934)).toBe(true)
    expect(is.integer(-51)).toBe(true)
    expect(is.integer(-[])).toBe(true) // Yeah, that's -0
  })

  it('rejects numbers with a fractional component', function() {
    expect(is.integer(1.5)).toBe(false)
    expect(is.integer(.12)).toBe(false)
    expect(is.integer(-1923.1)).toBe(false)
  })

  it('rejects non-numbers', function() {
    expect(is.integer('wow')).toBe(false)
    expect(is.integer({})).toBe(false)
    expect(is.integer([1, 2, 3])).toBe(false)
    expect(is.integer("15")).toBe(false)
  })
})

describe('is.decimal', function() {
  it('is a function', function() {
    expect(typeof is.decimal).toBe('function')
  })

  it('identifies numbers with a fractional component as a decimal', function() {

  })

  it('rejects numbers with no fractional component', function() {

  })
})

describe('is.equal', function() {
  it('is a function', function() {
    expect(typeof is.equal).toBe('function')
  })

  it('compares numbers', function() {
    expect(is.equal(1, 1)).toBe(true)
    expect(is.equal(5, 17)).toBe(false)
  })

  it('compares strings', function() {
    expect(is.equal('one', 'one')).toBe(true)
    expect(is.equal('Jon Snow', 'Tyrion Lannister')).toBe(false)
  })

  it('compares null/undefined', function() {
    expect(is.equal(null, undefined)).toBe(false)
  })

  it('compares arrays by value', function() {
    var arrOne = [1, 2, 3, 4, 5]
    var arrTwo = [1, 2, 3, 4, 5]
    var arrThree = [1, 2, '3', 'bleh']
    var arrFour = ['lfa', 'ksjdf', 'kjhasdf', 'aksdf', { one: 1 }]

    var arrDup = arrOne

    expect(is.equal(arrOne, arrTwo)).toBe(true)
    expect(is.equal(arrTwo, arrThree)).toBe(false)
    expect(is.equal(arrOne, arrDup)).toBe(true)
    expect(is.equal(arrOne, arrFour)).toBe(false)
  })

  it('compares objects by value', function() {
    var objOne = { one: 1, two: 2, three: 3 }
    var objTwo = { one: 1, two: 2, three: 3 }
    var objThree = { one: 'one', two: 2, three: 3 }

    expect(is.equal(objOne, objTwo)).toBe(true)
    expect(is.equal(objTwo, objThree)).toBe(false)
  })

  it('compares nested objects recursively', function() {
    var objOne = {
      subOne: { one: 1, two: 2 },
      subTwo: {}
    }

    var objTwo = {
      subOne: { one: 1, two: 2 },
      subTwo: {}
    }

    var objThree = {
      subOne: { one: 1 },
      subTwo: {}
    }

    expect(is.equal(objOne, objTwo)).toBe(true)
    expect(is.equal(objTwo, objThree)).toBe(false)
  })
})

describe('is.nil', function() {
  it('is a function', function() {
    expect(typeof is.nil).toBe('function')
  })

  it('returns true for null', function() {
    expect(is.nil(null)).toBe(true)
  })

  it('returns true for undefined', function() {
    expect(is.nil(undefined)).toBe(true)
  })

  it('returns false for 0', function() {
    expect(is.nil(0)).toBe(false)
  })
})