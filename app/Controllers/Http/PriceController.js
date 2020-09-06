'use strict'
const Binance = require('node-binance-api')
const Portfolio = use("App/Models/Portfolio")
const Encryption = use('Encryption')
var TDSequential = require("tdsequential");

class PriceController {
    /**
     * Show price of a specific pair
     *
     * @param request
     * @param response
     * @returns {Promise<void>}
     */
    async show({request, response}) {
        const firstCoinSymbol = request.all().first_coin
        const secondCoinSymbol = request.all().second_coin

        // Get first portfolio.
        // We do this only now for test purposes, this is a big security risk
        const portfolio = await Portfolio.firstOrFail()

        // Initialize binance api
        const binance = new Binance().options({
            APIKEY: portfolio.api_key,
            APISECRET: Encryption.decrypt(portfolio.api_secret)
        });

        //Get price
        try {
            return await binance.prices(firstCoinSymbol + secondCoinSymbol)
        } catch (e) {
            return {
                code: 'error',
                message: 'Price for this pair is not available',
            }
        }

    }

    /**
     * Return prices for all pairs present on Binance
     *
     * @param request
     * @param response
     * @returns {Promise<*>}
     */
    async index({request, response}) {
        // Get first portfolio.
        // We do this only now for test purposes, this is a big security risk
        const portfolio = await Portfolio.firstOrFail()

        // Initialize binance api
        const binance = new Binance().options({
            APIKEY: portfolio.api_key,
            APISECRET: Encryption.decrypt(portfolio.api_secret)
        });

        //Get price
        return await binance.prices()
    }

    async tdSequentialTest({request, response}) {
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
        ticks = ticks.map(function (tick, index){
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
        let result = TDSequential(ticks)

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

        return result.reverse()

    }
}

module.exports = PriceController
