# Crypto Algo Trading
This project aims to provide control for automated trading on multiple platforms. More information in [doc](https://filipmolcik.com/algo-trading-cryptocurrency/).

## Roadmap

### Done
- [x] research (backtesting)
- [x] strategies
- [x] client (Coinbase)
- [x] runner (automation)

### In Progress
- [ ] web interface (controls)

### To Do
- [ ] analytics, reports, logging
- [ ] another clients (Binance, ...)

## Usage
### Install
Install project dependencies
```bash
npm install
```
Rename ```.env.example``` to ```.env``` and update it with your keys

### Run
To run the backtest
```bash
npm run backtest
```
To run the orders execution based on your strategy
```bash
npm run runner
```
To run the web interface (in progress)
```bash
npm start
```
