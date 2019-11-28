const indicators = require('technicalindicators')
const { Strategy } = require('./Strategy')

class WatsonStrategy extends Strategy {

    constructor(timeFrame, buffer, productId) {
        super()
        this.sliceBuy = 0.01
        this.productId = productId
        this.sliceSell = 0.001
        this.stopLoss = 0.90
        this.advice = null
        this.stopAdvice = null
        this.ema = null
        // Indicators
        this.EMA = new indicators.EMA({period: buffer * (86400/timeFrame), values: []})

        this.setSellAdvice(null)
        this.setStopLossAdvice(null, null, null)

    }

    next(candle, baseBalance, quoteBalance) {
        const open =  candle[3]
        const close = candle[4]
        const emaPrev = this.ema
        this.ema = this.EMA.nextValue(close)

        // init
        if (typeof this.ema === "undefined") return;

        // down trend
        if (this.ema <= emaPrev) {
            this.sliceBuy = 0.001
            this.sliceSell = 0.1
        }

        // up trend
        if (this.ema > emaPrev) {
            this.sliceBuy = 0.1
            this.sliceSell = 0.001
        }

        // BUY: open > close (micro down-trend)
        if (open > close) {
            const size = this.getSizeForQuote(this.sliceBuy, quoteBalance, close)
            const stopLossSize = this.getSizeForBase(1, baseBalance + size)
            this.setBuyAdvice(size)
            this.setStopLossAdvice(stopLossSize, close * this.stopLoss, close * this.stopLoss * 0.9)
        }

        // SELL: open < close (micro up-trend)
        if (open < close) {
            const size = this.getSizeForBase(this.sliceSell, baseBalance)
            this.setSellAdvice(size)
            this.setStopLossAdvice(null, null, null)
        }

        return this.advice
    }

    getAdvice() {
        return this.advice
    }

    getStopAdvice() {
        return this.stopAdvice
    }

    setStopLossAdvice(size, stopPrice, price) {
        this.stopAdvice = {
            side: 'sell',
            type: 'limit',
            size: size,
            stop_price: stopPrice ? Math.round(stopPrice * 100)/100 : null,
            price: price ? Math.round(price * 100)/100 : null,
            stop: 'loss',
            product_id: this.productId,
        }
    }

    setSellAdvice(size) {
        this.advice =  {
            side: 'sell',
            type: 'market',
            product_id: this.productId,
            size: size,
        }
    }

    setBuyAdvice(size) {
        this.advice =  {
            side: 'buy',
            type: 'market',
            product_id: this.productId,
            size: size,
        }
    }

}

module.exports = { WatsonStrategy: WatsonStrategy }
