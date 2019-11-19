const express = require('express');
const router = express.Router();
const coinbase = require('../services/coinbase')

/* GET users listing. */
router.get('/buy', async (req, res, next) => {
  try {
    const response = await coinbase.buy(coinbase.sandboxAuthedClient, 'BTC-EUR', 0.001)
    res.send(response);
  } catch(e) {
    console.error(e)
    res.send(e.message)
  }
});

router.get('/sell', async (req, res, next) => {
  try {
    const response = await coinbase.sell(coinbase.sandboxAuthedClient,'BTC-EUR', 0.001)
    res.send(response);
  } catch(e) {
    console.error(e)
    res.send(e.message)
  }
});

module.exports = router;
