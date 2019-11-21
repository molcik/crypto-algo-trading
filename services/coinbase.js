const CoinbasePro = require('coinbase-pro')
const apiURI = 'https://api.pro.coinbase.com'
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com'

const authedClient = new CoinbasePro.AuthenticatedClient(
    process.env.COINBASE_KEY,
    process.env.COINBASE_SECRET,
    process.env.COINBASE_PASSPHRASE,
    apiURI
);

const sandboxAuthedClient = new CoinbasePro.AuthenticatedClient(
    process.env.COINBASE_SANDBOX_KEY,
    process.env.COINBASE_SANDBOX_SECRET,
    process.env.COINBASE_SANDBOX_PASSPHRASE,
    sandboxURI
);

const placeOrder = async (params, prod) => {
    return await getClient(prod).placeOrder(params)
}

const buy = async (size, productId, prod) => {
    const params = {
        side: 'buy',
        type: 'market',
        size: size,
        product_id: productId,
    };
    return placeOrder(params, prod)

}

const sell = async (size, productId, prod) => {
    const params = {
        side: 'sell',
        type: 'market',
        size: size,
        product_id: productId,
    };
    return placeOrder(params, prod)
}

const stop = async (size, productId, stopPrice, price, prod) => {
    const params = {
        side: 'sell',
        type: 'limit',
        stop_price: stopPrice,
        price: price,
        stop: 'loss',
        size: size,
        product_id: productId,
    };
    return await getClient(prod).placeOrder(params)
}

const cancelAll = async (prod) => {
    return await getClient(prod).cancelAllOrders()
}

const getWallets = async (prod) => {
    return await getClient(prod).getAccounts()
}

const getWallet = async (currency, prod) => {
    const accounts = await getClient(prod).getAccounts();
    return accounts.find(account => account.currency === currency)
}

const getClient = (prod) => {
    return (prod ? authedClient : sandboxAuthedClient)
}

module.exports = {
    buy,
    sell,
    stop,
    placeOrder,
    getWallet,
    getWallets,
    cancelAll
}
