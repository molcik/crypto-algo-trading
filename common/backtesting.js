const { offlineRunner, Watson } = require('./strategy')
const AccountMock = require('./AccountMock')

 const start = "2019-01-01"
// const start ="2017-12-15"

 const end = "2019-11-15"
// const end = "2018-12-08"

const timeframe = 86400
const fee = 0.005
const acc = new AccountMock(fee, 0, 1000)
const productId = 'BTC-EUR'

offlineRunner(start, end, timeframe, productId, acc, Watson)

