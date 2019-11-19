const indicators = require('technicalindicators')
const { downloadData } = require('./utils')
const Account = require('./mock')

const fee = 0.05
let sliceBuy = 0.01
let sliceSell = 0.001
let stopLoss = 0.9

let start = "2017-01-01"
let end = "2019-11-15"
let timeframe = 86400

const main = async () => {

    const data = await downloadData(start, end, timeframe)
    const acc = new Account(fee, 0, 1000)

    console.log(`
    START
    BTC: ${acc.bitcoinWallet}, EUR: ${acc.eurWallet}, equity: ${acc.eurWallet + acc.bitcoinWallet * data[0][4]}
    `)

    // Trend
    const ema = new indicators.WEMA({period: 26 * (86400/timeframe), values: []})
    let emaValue, emaPrevValue, equity, equityPrev

    data.map(candle => {
        const open =  candle[3]
        const close = candle[4]
        equityPrev = equity
        equity = acc.eur() + acc.btc() * close
        emaPrevValue = emaValue
        emaValue = ema.nextValue(close)

        // STOP LOSS
        if (equityPrev && equity/equityPrev < stopLoss) {
            acc.sell(close, 1)
            return;
        }

        // down trend
        if (emaValue < emaPrevValue) {
            sliceBuy = 0.0001
            sliceSell = 0.001
        }

        // up trend
        if (emaValue > emaPrevValue) {
            sliceBuy = 0.1
            sliceSell = 0.01
        }

        // open > close (down-trend)
        if (open > close) {
            acc.buy(close, sliceBuy)
        }

        // open < close (up-trend)
        if (open < close) {
            acc.sell(close, sliceSell)
        }

    })

    console.log(acc.getBook())

    console.log(`
    END
    BTC: ${acc.btc()}, EUR: ${acc.eur()}, equity: ${acc.eur() + acc.btc() * data[data.length - 1][4]}
    `)

}

main()







