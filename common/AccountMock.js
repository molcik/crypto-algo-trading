
class AccountMock {

    constructor(fee, base, quote) {
        this.fee = fee
        this.wallet = {
            base: base,
            quote: quote
        }
        this.book = []
        this.positions = []
    }

    next(candle) {
        this.book.push(candle)
    }

    buy(size) {
        console.log(size)
        if (size > this.wallet.quote || size < 1) return
        this.wallet.base += size / this.getClose()
        this.wallet.quote -= (size + size * this.fee)
    }

    sell(size) {
        console.log(size)
        if  (size > this.wallet.base || size < 0.00000001) return
        this.wallet.quote += size * this.getClose()
        this.wallet.quote -= (size * this.getClose()) * this.fee
        this.wallet.base -= size;
    }

    getSizeForQuote(slice) {
        return this.wallet.quote * slice
    }

    getSizeForBase(slice) {
        return this.wallet.base * slice
    }

    stop() {

    }

    getQuote() {
        return this.wallet.quote
    }

    getBase() {
        return this.wallet.base
    }

    getEquity() {
        return this.wallet.base * this.getClose() + this.wallet.quote
    }

    getClose() {
        return this.book[this.book.length - 1][4]
    }


}

module.exports = AccountMock
