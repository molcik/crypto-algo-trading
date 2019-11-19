const CoinbasePro = require('coinbase-pro');

const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

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

const buy = async (client, productId, size) => {
    const params = {
        side: 'buy',
        type: 'market',
        size: size,
        product_id: productId,
    };
    return await client.placeOrder(params);

}

const sell = async (client, productId, size) => {
    const params = {
        side: 'sell',
        type: 'market',
        size: size,
        product_id: productId,
    };
    return await client.placeOrder(params);
}

module.exports = {buy, sell, sandboxAuthedClient}
