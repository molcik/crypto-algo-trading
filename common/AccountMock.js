
class AccountMock {

    constructor(fee, base, quote) {
        this.fee = fee
        this.wallet = {
            base: base,
            quote: quote
        }
        this.book = []
        this.positions = []
        this.stopLossPrice = 0
        this.minEquity = quote
        this.maxEquity = quote
    }

    next(candle) {
        this.book.push(candle)
        // Stop Loss
        if (this.getClose() < this.stopLossPrice) {
            this.sell(this.getSizeForBase(1))
            this.stopLossPrice = 0
        }
        this.getEquity() < this.minEquity ? this.minEquity = this.getEquity() : null
        this.getEquity() > this.maxEquity ? this.maxEquity = this.getEquity() : null
    }
    
    placeOrder(params) {
        if (!params) return
        switch (params.side) {
            case "sell":
                this.sell(params.size)
            case "buy":
                this.buy(params.size)
            default:
        }
    }

    buy(size) {
        if (!size) return
        if (size < 0.00100000) return
        if (size * this.getClose() > this.wallet.quote) return
        this.wallet.base += size
        this.wallet.quote -= (size * this.getClose() + size * this.getClose() * this.fee)
    }

    sell(size) {
        if (!size) return
        if (size < 0.00100000) return
        if (size > this.wallet.base) return
        this.wallet.quote += size * this.getClose()
        this.wallet.quote -= (size * this.getClose()) * this.fee
        this.wallet.base -= size;
    }

    setStopLoss(ratio) {
        this.stopLossPrice = this.getClose() * ratio
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
