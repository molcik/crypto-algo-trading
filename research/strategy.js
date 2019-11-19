const indicators = require('technicalindicators')
const { downloadData } = require('./utils')

const watson = async (acc, start, end, timeframe) => {

    // Coinbase Account Mock with 1000 EUR
    const data = await downloadData(start, end, timeframe)

    // Variables
    let sliceBuy = 0.01
    let sliceSell = 0.001
    let stopLoss = 0.9

    // Indicators
    const EMA = new indicators.EMA({period: 26 * (86400/timeframe), values: []})
    let emaValue, emaPrevValue, equity, equityPrev

    console.log(`
    START
    BTC: ${acc.bitcoinWallet}, EUR: ${acc.eurWallet}, equity: ${acc.eurWallet + acc.bitcoinWallet * data[0][4]}
    `)

    data.forEach(candle => {
        const open =  candle[3]
        const close = candle[4]
        equityPrev = equity
        equity = acc.eur() + acc.btc() * close
        emaPrevValue = emaValue
        emaValue = EMA.nextValue(close)

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

    // console.log(acc.getBook())

    console.log(`
    END
    BTC: ${acc.btc()}, EUR: ${acc.eur()}, equity: ${acc.eur() + acc.btc() * data[data.length - 1][4]}
    `)

}


const winpes = async (start, end, timeframe) => {

    // Coinbase Account Mock with 1000 EUR
    const fee = 0.005
    const data = await downloadData(start, end, timeframe)
    const acc = new Account(fee, 0, 1000)

    // Variables
    let nextSlice = 0.1

    // Indicators
    const SMA200 = new indicators.SMA({period: 200 * (86400/timeframe), values: []})
    const SMA5 = new indicators.SMA({period: 5 * (86400/timeframe), values: []})
    const RSI2 = new indicators.RSI({period: 2, values: []})

    console.log(`
    START
    BTC: ${acc.bitcoinWallet}, EUR: ${acc.eurWallet}, equity: ${acc.eurWallet + acc.bitcoinWallet * data[0][4]}
    `)

    data.forEach(candle => {
        const close = candle[4]
        const sma200 = SMA200.nextValue(close)
        const sma5 = SMA5.nextValue(close)
        const rsi2 = RSI2.nextValue(close)

        if (rsi2 < 10 & close > sma200) {
            acc.buy(close, nextSlice)
            nextSlice += 0.1
        }

        if (nextSlice > 0.1 && close < sma5) {
            acc.buy(close, nextSlice)
            nextSlice += 0.1
        }

        if (close > sma5) {
            acc.sell(close, 1)
            nextSlice = 0.1
        }

    })
    // console.log(book)

    console.log(`
    END
    BTC: ${acc.btc()}, EUR: ${acc.eur()}, equity: ${acc.eur() + acc.btc() * data[data.length - 1][4]}
    `)

}

module.exports = { watson, winpes }
