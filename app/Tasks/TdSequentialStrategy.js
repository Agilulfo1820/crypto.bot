'use strict'

const Task = use('Task')
const Binance = require('node-binance-api')
const Portfolio = use("App/Models/Portfolio")
const Encryption = use('Encryption')
var TDSequential = require("tdsequential")

class TdSequentialStrategy extends Task {
    static get schedule() {
        // Schedule cronjob to run every minute
        return '*/1 * * * *'
    }

    async handle() {
        // Get first portfolio.
        // We do this only now for test purposes, this is a big security risk
        const portfolio = await Portfolio.firstOrFail()

        // Initialize binance api
        const binance = new Binance().options({
            APIKEY: portfolio.api_key,
            APISECRET: Encryption.decrypt(portfolio.api_secret)
        });

        // Get last 500 daily ticks from binance
        let ticks = await binance.candlesticks("BTCUSDT", "1d", null, {limit: 200})

        // map ticks in ohlc format
        ticks = ticks.map(function (tick, index) {
            return {
                time: tick[0],
                open: tick[1],
                high: tick[2],
                low: tick[3],
                close: tick[4],
                volume: tick[5]
            }
        });

        // Use TD Sequantial indicator on ticks
        let tdSequential = TDSequential(ticks)

        // Take the previous td since the last one is the current tick
        // so we need its timeframe to close in order to correctly elaborate the data
        let lastTD = tdSequential.reverse()[1]
        console.info(lastTD)

        if (lastTD.bullishFlip) {
            console.info('BUY')
        }

        if (lastTD.bearishFlip) {
            console.info('SELL')
        }
        /**
         * TODO: Logica da introdurre
         *
         * if (bearishFlip) {
         *     vendi se ho qualcosa da vendere
         * }
         *
         * if (bullishFlip) {
         *     compra, se ho soldi per comprare
         * }
         *
         * if (sellSetupIndex == 8) {
         *     vendi 50% di quello che ho
         * }
         *
         * if (sellSetupIndex == 9) {
         *     vendi tutto
         * }
         *
         * Altre logiche:
         * il 2 verde sopra 1 verde (guardando i TDSTBUY) e il 3 verde sopra 1 verde e 2 verde
         * il 2 rosso sotto 1 rosso
         *
         * Gestire le percentuali di soldi, i soldi investiti, quelli non investiti, etc.
         */
    }
}

module.exports = TdSequentialStrategy
