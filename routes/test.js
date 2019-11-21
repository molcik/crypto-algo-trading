const express = require('express');
const router = express.Router();
const coinbase = require('../services/coinbase')

/* GET - buy order. */
router.get('/buy', async (req, res, next) => {
  try {
    const response = await coinbase.buy(0.001, 'BTC-EUR')
    res.send(response);
  } catch(e) {
    console.error(e)
    res.render('error', { error: e });
  }
});

/* GET - sell order. */
router.get('/sell', async (req, res, next) => {
  try {
    const response = await coinbase.sell(0.001,'BTC-EUR')
    res.send(response);
  } catch(e) {
    console.error(e)
    res.render('error', { error: e });
  }
});

/* GET - account */
router.get('/wallets', async (req, res, next) => {
  try {
    const response = await coinbase.getWallets()
    res.send(response);
  } catch(e) {
    console.error(e)
    res.render('error', { error: e });
  }
});

/* GET - account by currency */
router.get('/wallet/:currency', async (req, res, next) => {
  try {
    const response = await coinbase.getWallet(req.param('currency'))
    res.send(response);
  } catch(e) {
    console.error(e)
    res.render('error', { error: e });
  }
});

/* GET - stop order */
router.get('/stop', async (req, res, next) => {
  try {
    const response = await coinbase.stop(0.1257, 'BTC-EUR', 7500, 1)
    res.send(response);
  } catch(e) {
    console.error(e)
    res.render('error', { error: e });
  }
});

/* GET - cancel all orders */
router.get('/cancel', async (req, res, next) => {
  try {
    const response = await coinbase.cancelAll()
    res.send(response);
  } catch(e) {
    console.error(e)
    res.render('error', { error: e });
  }
});

module.exports = router;
