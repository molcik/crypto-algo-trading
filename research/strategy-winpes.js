const indicators = require('technicalindicators')
const { downloadData } = require('./utils')

export const main = async (start, end) => {

    let nextSlice = 0.1
    const data = await downloadData(start, end)

    console.log(`
    START:
    BTC: ${bitcoinWallet}, EUR: ${eurWallet}, equity: ${eurWallet + bitcoinWallet * data[0][4]}
    `)

    // Trend
    const SMA200 = new indicators.SMA({period: 200 * (86400/timeframe), values: []})
    const SMA5 = new indicators.SMA({period: 5 * (86400/timeframe), values: []})
    const RSI2 = new indicators.RSI({period: 2, values: []})

    data.map(candle => {
        const close = candle[4]
        const sma200 = SMA200.nextValue(close)
        const sma5 = SMA5.nextValue(close)
        const rsi2 = RSI2.nextValue(close)

        if (rsi2 < 10 & close > sma200) {
            buy(close, nextSlice)
            nextSlice += 0.1
        }

        if (nextSlice > 0.1 && close < sma5) {
            buy(close, nextSlice)
            nextSlice += 0.1
        }

        if (close > sma5) {
            sell(close, 1)
            nextSlice = 0.1
        }

    })
    // console.log(book)

    console.log(`
    END:
    BTC: ${bitcoinWallet}, EUR: ${eurWallet}, equity: ${eurWallet + bitcoinWallet * data[data.length - 1][4]}
    `)

}
