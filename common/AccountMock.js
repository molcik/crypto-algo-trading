
class AccountMock {

    constructor(fee, base, quote) {
        this.fee = fee
        this.wallet = {
            base: base,
            quote: quote
        }
        this.book = []
        this.positions = []
        this.stopLossPrice = null
        this.stopLossSize = null
        this.limitPrice = null
        this.minEquity = quote
        this.maxEquity = quote
    }

    next(candle) {
        this.book.push(candle)
        // Stop-Loss
        if ( this.stopLossPrice &&
            this.limitPrice &&
            this.getClose() < this.stopLossPrice && this.getClose() > this.limitPrice)
        {
            console.log("selling on stop loss")
            this.sell(this.stopLossSize)
            this.stopLossPrice = null
            this.limitPrice = null
        }
        // TODO: Stop-Enter
        this.getEquity() < this.minEquity ? this.minEquity = this.getEquity() : null
        this.getEquity() > this.maxEquity ? this.maxEquity = this.getEquity() : null
    }
    
    placeOrder(params) {
        // Market
        if (!params) return
        switch (params.side) {
            case "sell":
                // Stop-Loss
                if (params.type === "limit" && params.stop == "loss") {
                    this.stopLossPrice = params.stop_price
                    this.limitPrice = params.price
                    this.stopLossSize = params.size
                    return
                }

                // TODO: Limit

                // Market
                this.sell(params.size)

            case "buy":
                // TODO: Stop-Enter

                // TODO: Limit

                // Market
                this.buy(params.size)
            default:
                return
        }
    }

    buy(size) {
        if (!size) return
        if (size < 0.00100000) return
        if (size * this.getClose() > this.wallet.quote) return
        this.wallet.quote -= (size * this.getClose() + size * this.getClose() * this.fee)
        this.wallet.base += size
    }

    sell(size) {
        if (!size) return
        if (size < 0.00100000) return
        if (size > this.wallet.base) return
        this.wallet.quote -= (size * this.getClose()) * this.fee
        this.wallet.base -= size
        this.wallet.quote += size * this.getClose()
    }

    getQuoteBalance() {
        return this.wallet.quote
    }

    getBaseBalance() {
        return this.wallet.base
    }

    getEquity() {
        return this.wallet.base * this.getClose() + this.wallet.quote
    }

    getClose() {
        return this.book[this.book.length - 1][4]
    }

    getStats() {
        console.log(
        `
        Min:    ${this.minEquity}
        Max:    ${this.maxEquity}
        ____________________________
        Equity: ${this.getEquity()}
        `)
    }

}

module.exports = AccountMock
