
class AccountMock {

    constructor(fee, BTC, EUR) {
        this.fee = fee
        this.bitcoinWallet = BTC
        this.eurWallet = EUR
        this.book = []
    }

    buy(rate, slice) {
        if ((this.eurWallet * slice) < 1) return
        const amount = slice * this.eurWallet
        this.bitcoinWallet += amount / rate
        this.eurWallet -= (amount + amount * this.fee)
        // logging
        this.book.push({BTC: this.bitcoinWallet, EUR: this.eurWallet, equity: this.eurWallet + this.bitcoinWallet * rate, buy: true})
    }

    sell(rate, slice) {
        if  ((this.bitcoinWallet * slice) < 0.00000001) return
        const amount = this.bitcoinWallet * slice
        this.eurWallet += amount * rate
        this.eurWallet -= (amount * rate) * this.fee
        this.bitcoinWallet -= amount;
        // logging
        this.book.push({BTC: this.bitcoinWallet, EUR: this.eurWallet, equity: this.eurWallet + this.bitcoinWallet * rate, sell: true})
    }

    eur() {
        return this.eurWallet
    }

    btc() {
        return this.bitcoinWallet
    }

    getBook() {
        return this.book
    }

}

module.exports = AccountMock
