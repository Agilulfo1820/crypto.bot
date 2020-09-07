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
        console.group('TdSequentialStrategy check')
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

        let lastWeekTicks = ticks.reverse().slice(0, 7)
        console.info('Last Week Ticks: ', lastWeekTicks)

        // Use TD Sequantial indicator on ticks
        let tdSequential = TDSequential(ticks)

        // Take the previous td since the last one is the current tick
        // so we need its timeframe to close in order to correctly elaborate the data
        let lastTD = tdSequential.reverse()[1]
        console.info('TD Sequential of last day: ', lastTD)

        // We will check all condition and set the result (if to sell or not) in this boolean
        // If at the end of all check this variable will still be null then we don't do anything
        let SELL = null

        if (lastTD.bullishFlip || lastTD.buySetupPerfection) {
            console.log('BUY: lastTD.bullishFlip || lastTD.buySetupPerfection')
            SELL = false
        }

        if (lastTD.bearishFlip || lastTD.sellSetupPerfection) {
            console.log('SELL: lastTD.bearishFlip || lastTD.sellSetupPerfection')
            SELL = true
        }

        // If it's a green two apon a green one
        if (lastTD.sellSetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)) {
            console.log('BUY: lastTD.sellSetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)')
            SELL = false
        }

        // If it's a red two under a red one
        if (lastTD.buySetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)) {
            console.log('SELL: lastTD.buySetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)')
            SELL = true
        }

        if (SELL === null) {
            console.info('FINAL ORDER: Match not found, no actions required.' )
            return false
        }

        SELL ? console.info('FINAL ORDER: SELL') : console.info('FINAL ORDER: BUY')

        console.groupEnd()
    }
}

module.exports = TdSequentialStrategy
