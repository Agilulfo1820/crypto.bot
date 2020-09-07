'use strict';

const Binance = require('node-binance-api')
const Account = use("App/Models/Account")
const Encryption = use('Encryption')
var TDSequential = require("tdsequential")
const Env = use('Env')
const Strategy = use('App/Models/Strategy')
const StrategyLog = use('App/Models/StrategyLog')
const TradeLog = use('App/Models/TradeLog')

/**
 * Sample job consumer class
 *
 * @version 2.0.0
 * @adonis-version 4.0+
 */

class TDSequentialJob {

    /**
     * Concurrency for processing this job
     * @return {Int} Num of jobs processed at time
     */
    static get concurrency() {
        return 250;
    }

    /**
     * UUID for this job class
     * Make sure consumer and producer are in sync
     * @return {String}
     */
    static get type() {
        return 'td-sequential-job';
    }

    /**
     * Inject custom payload into the job class
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    constructor(data) {
        this.data = data;
    }

    /**
     * Inject the kue ctx to the consumer, you can use it to
     * pause(), shutdown() or remove() handler actions.
     * See kue's doc for more details
     * @param  {Object} data
     *
     * DO NOT MODIFY!
     */
    setContext(ctx) {
        this.ctx = ctx;
    }

    /**
     * Handle the sending of email data
     * You can drop the async keyword if it is synchronous
     *
     * Take asset from strategy
     * Connect to user's Binance account
     * Analyze data
     * Buy or Sell asset
     */
    async handle() {
        console.group('TdSequential strategy started')
        const strategy = await Strategy.findOrFail(this.data.strategy.id)

        //Retrieve asset
        const asset = await strategy.asset().fetch()
        const firstCoin = await asset.firstCoin()
        const secondCoin = await asset.secondCoin()
        const assetName = firstCoin.symbol + '' + secondCoin.symbol
        console.log('Asset: ', assetName)

        // Get the account associated with the strategy
        const account = await strategy.account().fetch()
        console.log('Account: ', account.name, account.api_key)

        // Retrieve the timeframe of the strategy
        const timeframe = await strategy.timeframe().fetch()
        console.log('Timeframe: ', timeframe.value)

        // Initialize binance api
        const binance = new Binance().options({
            APIKEY: account.api_key,
            APISECRET: Encryption.decrypt(account.api_secret)
        });

        // Get last 500 daily ticks from binance
        let ticks
        try {
            ticks = await binance.candlesticks(assetName, timeframe.value, null, {limit: 200})
        } catch (e) {
            console.error('ERROR: ', e)
            return
        }


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
        let secondLastTD = tdSequential.reverse()[1]
        console.info('TD Sequential of second last day: ', secondLastTD)

        // We will check all condition and set the result (if to sell or not) in this boolean
        // If at the end of all check this variable will still be null then we don't do anything
        let SELL = null

        if (secondLastTD.bullishFlip || secondLastTD.buySetupPerfection) {
            console.log('BUY: lastTD.bullishFlip || lastTD.buySetupPerfection')
            SELL = false
        }

        if (secondLastTD.bearishFlip || secondLastTD.sellSetupPerfection) {
            console.log('SELL: lastTD.bearishFlip || lastTD.sellSetupPerfection')
            SELL = true
        }

        // If it's a green two upon a green one
        if (secondLastTD.buySetupIndex === 2 && (lastWeekTicks[1].close > lastWeekTicks[2].close)) {
            console.log('BUY: lastTD.sellSetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)')
            SELL = false
        }

        // If it's a red two under a red one
        if (secondLastTD.sellSetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)) {
            console.log('SELL: lastTD.buySetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)')
            SELL = true
        }

        // Log data and SELL result to db
        let strategyLog = new StrategyLog()
        strategyLog.strategy_id = strategy.id
        strategyLog.data = {
            lastWeekTicks: lastWeekTicks,
            secondLastTD: secondLastTD,
            action: SELL ? 'SELL' : 'BUY'
        }
        await strategyLog.save()
        console.log('Logged strategy!')

        if (SELL === null) {
            console.info('FINAL ACTION: Match not found, no actions required.')
            console.groupEnd()
            return false
        }

        // Log everything but sell on binance only if env is set to "production"
        const env = Env.get('NODE_ENV', 'development')

        //TODO: gestire quantity, parto con dollari e quantiti è 20,
        // poi però compro btc e quantity è 0.001 btc poi rivendo...
        // Quindi non cambia solo il valore di quantity ma cambia anche il valore di cosa rappresenta la quantity
        let quantity = 1;

        if (SELL) {
            console.info('FINAL ACTION: SELL')
            if (env === 'production') {
                // These orders will be executed at current market price.
                binance.marketSell(assetName, quantity, (error, response) => {
                    console.info("Market Buy response", response);
                    console.info("order id: " + response.orderId);

                    // TODO:Log the trade
                })
            } else {
                // Fake log sell
                let tradeLog = new TradeLog()
                tradeLog.strategy_id = strategy.id
                tradeLog.trade_type = 'SELL'
                tradeLog.quantity = quantity
                tradeLog.price = 0
                await tradeLog.save()
                console.log('Logged Fake SELL!')
            }
        } else {
            console.info('FINAL ORDER: BUY')
            if (env === 'production') {
                let quantity = 1;
                // These orders will be executed at current market price.
                binance.marketBuy(assetName, quantity, (error, response) => {
                    console.info("Market Buy response", response);
                    console.info("order id: " + response.orderId);

                    // TODO:Log the trade
                })
            } else {
                // Fake log buy
                let tradeLog = new TradeLog()
                tradeLog.strategy_id = strategy.id
                tradeLog.trade_type = 'BUY'
                tradeLog.quantity = quantity
                tradeLog.price = 0
                await tradeLog.save()
                console.log('Logged Fake BUY!')
            }
        }


        console.groupEnd()
    }


}

module.exports = TDSequentialJob;
