const indicators = require('technicalindicators')
const { downloadData } = require('./utils')

const offlineRunner = async (start, end, timeframe, productId, acc, Strategy) => {

    const data = await downloadData(start, end, timeframe, productId)
    const strategy = new Strategy(acc, timeframe)

    data.forEach(candle => {
        acc.next(candle)
        strategy.next(candle)
    })

    console.log(`
    End:
    equity: ${acc.getEquity()}
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
        const emaPrev = this.EMA
        this.ema = this.EMA.nextValue(close)

        // STOP LOSS
        if (false) {

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
            this.acc.buy(this.acc.getSizeForQuote(this.sliceBuy))
        }

        // open < close (up-trend)
        if (open < close) {
            this.acc.sell(this.acc.getSizeForBase(this.sliceSell))
        }
    }


}

module.exports = { offlineRunner, Watson }
