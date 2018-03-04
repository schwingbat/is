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

  it('does not pollute the global `is` when definitions are added', function() {
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

describe('is.not (negation)', function() {
  it('has versions of all `define`d functions', function() {
    expect(typeof is.not.func).toBe('function')
    expect(typeof is.not.object).toBe('function')
    expect(typeof is.not.number).toBe('function')
  })

  it('returns the opposite result of the normal is.* function', function() {
    expect(is.not.object({})).toBe(!is.object({}))
    expect(is.not.number(5)).toBe(!is.number(5))
    expect(is.not.string('test')).toBe(!is.string('test'))
    expect(is.not.decimal(1)).toBe(!is.decimal(1))
  })

  it('also works with not.a/not.an notation', function() {
    expect(is.not.a === is.not).toBe(true)
    expect(is.not.an === is.not).toBe(true)

    expect(is.not.a.number('5')).toBe(true)
    expect(is.not.an.object(2)).toBe(true)
  })
})

describe('is.a/is.an', function() {
  it('is a transparent reference back to `is`', function() {
    expect(is.a === is).toBe(true)
    expect(is.an === is).toBe(true)
  })
})

describe('is.object', function() {
  it('is a function', function() {
    expect(typeof is.object).toBe('function')
  })

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

describe('is.func', function() {
  it('is a function', function() {
    expect(is.func(is.func)).toBe(true)
  })

  it('correctly identifies functions', function() {
    expect(is.func(function() {}))
    expect(is.func(function() {
      return false
    }))
    expect(is.func([].toString)).toBe(true)
  })

  it('identifies arrow functions', function() {
    expect(is.func(() => false)).toBe(true)
  })

  it('rejects non-functions', function() {
    expect(is.func('fish')).toBe(false)
    expect(is.func(5)).toBe(false)
    expect(is.func([])).toBe(false)
    expect(is.func({})).toBe(false)
  })
})

describe('is.array', function() {
  it('is a function', function() {
    expect(typeof is.array).toBe('function')
  })

  it('correctly identifies arrays', function() {
    expect(is.array([])).toBe(true)
    expect(is.array([1, 2, 3, 'five'])).toBe(true)
  })

  it('rejects objects and other non-arrays', function() {
    expect(is.array({})).toBe(false)
    expect(is.array("string")).toBe(false)
  })
})

describe('is.string', function() {
  it('is a function', function() {
    expect(typeof is.string).toBe('function')
  })

  it('correctly identifies strings', function() {
    expect(is.string('string')).toBe(true)
  })

  it('rejects non-strings', function() {
    expect(is.string(['n', 'o', 'p', 'e'])).toBe(false)
    expect(is.string(null)).toBe(false)
    expect(is.string(5)).toBe(false)
  })
})

describe('is.number', function() {
  it('is a function', function() {
    expect(typeof is.number).toBe('function')
  })

  it('correctly identifies numbers', function() {
    expect(is.number(5)).toBe(true)
    expect(is.number(.15)).toBe(true)
    expect(is.number(0xffffff)).toBe(true)
    expect(is.number(0o777)).toBe(true)
  })

  it('considers NaN to not be a number', function() {
    expect(is.number(NaN)).toBe(false)
  })

  it('rejects non-numbers', function() {
    expect(is.number('1')).toBe(false)
    expect(is.number())
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
    expect(is.decimal(1.5)).toBe(true)
    expect(is.decimal(198204.12)).toBe(true)
    expect(is.decimal(-90.0000000000001)).toBe(true)
  })

  it('rejects numbers with no fractional component', function() {
    expect(is.decimal(1)).toBe(false)
    expect(is.decimal(919191)).toBe(false)
    expect(is.decimal(451)).toBe(false)
  })

  it('rejects non-numbers', function() {
    expect(is.decimal('1')).toBe(false)
    expect(is.decimal({ not: 'a number' })).toBe(false)
    expect(is.decimal(NaN)).toBe(false)
    expect(is.decimal([1, 2, 3])).toBe(false)
  })
})

describe('is.boolean', function() {
  it('is a function', function() {
    expect(typeof is.boolean).toBe('function')
  })

  it('correctly identifies booleans', function() {
    expect(is.boolean(true)).toBe(true)
    expect(is.boolean(false)).toBe(true)
  })

  it('rejects non-booleans', function() {
    expect(is.boolean(0)).toBe(false)
    expect(is.boolean([])).toBe(false)
    expect(is.boolean('false')).toBe(false)
  })
})

describe('is.null', function() {
  it('is a function', function() {
    expect(typeof is.null).toBe('function')
  })

  it('returns true if value is null', function() {
    expect(is.null(null)).toBe(true)
  })

  it('does not return true for undefined', function() {
    expect(is.null(undefined)).toBe(false)
  })

  it('does not return true for 0', function() {
    expect(is.null(0)).toBe(false)
  })
})

describe('is.undefined', function() {
  it('is a function', function() {
    expect(typeof is.undefined).toBe('function')
  })

  it('returns true for undefined', function() {
    expect(is.undefined(undefined)).toBe(true)
  })

  it('returns false for null and 0', function() {
    expect(is.undefined(null)).toBe(false)
    expect(is.undefined(0)).toBe(false)
  })
})

describe('is.defined', function() {
  it('is a function', function() {
    expect(typeof is.defined).toBe('function')
  })

  it('returns true if not undefined', function() {
    expect(is.defined(2)).toBe(true)
    expect(is.defined(null)).toBe(true)
    expect(is.defined(0)).toBe(true)
  })

  it('returns false if undefined', function() {
    expect(is.defined(undefined)).toBe(false)
  })
})

describe('is.true', function() {
  it('is a function', function() {
    expect(typeof is.true).toBe('function')
  })
})

describe('is.false', function() {
  it('is a function', function() {
    expect(typeof is.false).toBe('function')
  })
})

describe('is.nan', function() {
  it('is a function', function() {
    expect(typeof is.nan).toBe('function')
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