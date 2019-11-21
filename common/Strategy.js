class Strategy {

    getSizeForQuote(slice, balance, close) {
        return this.satoshi(balance * slice / close)
    }

    getSizeForBase(slice, balance) {
        return this.satoshi(balance * slice)
    }

    satoshi(size) {
        return Math.round(size * 100000000) / 100000000
    }

}

module.exports = { Strategy }
