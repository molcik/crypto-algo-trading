const { watson, winpes } = require('./strategy')

let start = "2016-01-01"
let end = "2019-11-15"
let timeframe = 86400

watson(start, end, timeframe)
