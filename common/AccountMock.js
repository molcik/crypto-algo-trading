
class AccountMock {

    constructor(fee, BTC, EUR) {
        this.fee = fee
        this.bitcoinWallet = BTC
        this.eurWallet = EUR
        this.book = []
    }

    buy(rate, portion) {
        if ((this.eurWallet * portion) < 1) return
        const amount = portion * this.eurWallet
        this.bitcoinWallet += amount / rate
        this.eurWallet -= (amount + amount * this.fee)
        // logging
        this.book.push({BTC: this.bitcoinWallet, EUR: this.eurWallet, equity: this.equity(rate), buy: true})
    }

    sell(rate, portion) {
        if  ((this.bitcoinWallet * portion) < 0.00000001) return
        const amount = this.bitcoinWallet * portion
        this.eurWallet += amount * rate
        this.eurWallet -= (amount * rate) * this.fee
        this.bitcoinWallet -= amount;
        // logging
        this.book.push({BTC: this.bitcoinWallet, EUR: this.eurWallet, equity: this.equity(rate), sell: true})
    }

    eur() {
        return this.eurWallet
    }

    btc() {
        return this.bitcoinWallet
    }

    equity(rate) {
        return this.bitcoinWallet * rate + this.eurWallet
    }

    getBook() {
        return this.book
    }

}

module.exports = AccountMock
