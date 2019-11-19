const key = '88722d7cc4a4afd768af046f96bfa1bb';
const secret = 'ZIY4+6QKfFTKeOXdq9rsxOj/pahK+QFy49gWzPtbOZYoOV5eNv4rwSbstmzcvg41DCzutVf8nhwJjNztPaJEkw==';
const passphrase = 'mz89z1rpdwd';

const apiURI = 'https://api.pro.coinbase.com';
const sandboxURI = 'https://api-public.sandbox.pro.coinbase.com';

const authedClient = new CoinbasePro.AuthenticatedClient(
    key,
    secret,
    passphrase,
    apiURI
);
