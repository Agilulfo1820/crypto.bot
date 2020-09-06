'use strict'
const Binance = require('node-binance-api')
const Portfolio = use("App/Models/Portfolio")
const Encryption = use('Encryption')

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
        return await binance.prices(firstCoinSymbol+secondCoinSymbol)
    }
}

module.exports = PriceController
