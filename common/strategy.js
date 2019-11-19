const indicators = require('technicalindicators')
const { downloadData } = require('./utils')

const offlineRunner = async (start, end, timeframe, acc, Strategy) => {

    const data = await downloadData(start, end, timeframe)
    const strategy = new Strategy(acc, timeframe)

    console.log(`
    Start:
    BTC: ${acc.bitcoinWallet}, EUR: ${acc.eurWallet}, equity: ${acc.equity(data[0][4])}
    `)

    data.forEach(candle => {
        strategy.next(candle)
    })

    console.log(`
    End:
    BTC: ${acc.btc()}, EUR: ${acc.eur()}, equity: ${acc.equity(data[data.length - 1][4])}
    `)

}

class Strategy {
    constructor(acc) {
        this.acc = acc
    }
}

class Watson extends Strategy {

    constructor(acc, timeFrame) {
        super(acc)
        this.sliceBuy = 0.01
        this.sliceSell = 0.001
        this.stopLoss = 0.9
        this.ema = null
        this.equity = null
        // Indicators
        this.EMA = new indicators.EMA({period: 26 * (86400/timeFrame), values: []})
    }

    next(candle) {
        const open =  candle[3]
        const close = candle[4]
        const equityPrev = this.equity
        this.equity = this.acc.equity(close)
        const emaPrev = this.EMA
        this.ema = this.EMA.nextValue(close)

        // STOP LOSS
        if (equityPrev && this.equity/equityPrev < this.stopLoss) {
            this.acc.sell(close, 1)
            return;
        }

        // down trend
        if (this.ema < emaPrev) {
            this.sliceBuy = 0.0001
            this.sliceSell = 0.001
        }

        // up trend
        if (this.ema > emaPrev) {
            this.sliceBuy = 0.1
            this.sliceSell = 0.01
        }

        // open > close (down-trend)
        if (open > close) {
            this.acc.buy(close, this.sliceBuy)
        }

        // open < close (up-trend)
        if (open < close) {
            this.acc.sell(close, this.sliceSell)
        }
    }


}

module.exports = { offlineRunner, Watson }
