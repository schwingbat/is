const is = require('./is')

console.log(0.5001 + 0.4999)

console.log(is.integer(0.5001 + 0.4999))

console.log(is.number(NaN))