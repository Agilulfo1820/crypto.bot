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

        return result.reverse()

    }
}

module.exports = PriceController
