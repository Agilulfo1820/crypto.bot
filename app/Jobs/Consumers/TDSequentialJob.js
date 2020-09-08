'use strict';

const Binance = require('node-binance-api')
const Account = use("App/Models/Account")
const Encryption = use('Encryption')
const TDSequential = require("tdsequential")
const Env = use('Env')
const Strategy = use('App/Models/Strategy')
const StrategyLog = use('App/Models/StrategyLog')
const TradeLog = use('App/Models/TradeLog')
const betterLogging = require('better-logging')
const {MessageConstructionStrategy} = betterLogging
betterLogging(console, {
    messageConstructionStrategy: MessageConstructionStrategy.NONE,
})
const {TelegramClient} = require('messaging-api-telegram')
const client = new TelegramClient({
    accessToken: Env.get('TELEGRAM_TOKEN'),
})
const CHAT_IDS = Env.get('TELEGRAM_CHAT_IDS').split(",")

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
        console.info('Asset: ', assetName)

        // Get the account associated with the strategy
        const account = await strategy.account().fetch()
        console.info('Account: ', account.name, account.api_key)

        // Retrieve the timeframe of the strategy
        let timeframe = await strategy.timeframe().fetch()
        timeframe = timeframe.value + '' + timeframe.range
        console.info('Timeframe: ', timeframe)

        // Initialize binance api
        const binance = new Binance().options({
            APIKEY: account.api_key,
            APISECRET: Encryption.decrypt(account.api_secret)
        });

        // Get last 500 daily ticks from binance
        let ticks
        try {
            ticks = await binance.candlesticks(assetName, timeframe, null, {limit: 200})
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

        //Prepare the message to send on telegram with the strategy log
        let messageData = 'Strategy: ' + strategy.name + '\n'
            + 'Indicator: TD Sequential Basic' + '\n'
            + 'Asset: ' + assetName + '\n'
            + 'Account: ' + account.name + '\n'
            + 'Timeframe: ' + timeframe + '\n'

        // We will check all condition and set the result (if to sell or not) in this boolean
        // If at the end of all check this variable will still be null then we don't do anything
        let SELL = null
        if (secondLastTD.bullishFlip || secondLastTD.buySetupPerfection) {
            messageData += '\n BUY: lastTD.bullishFlip || lastTD.buySetupPerfection'
            console.info('BUY: lastTD.bullishFlip || lastTD.buySetupPerfection')
            SELL = false
        }

        if (secondLastTD.bearishFlip || secondLastTD.sellSetupPerfection) {
            messageData += '\n SELL: secondLastTD.bearishFlip || secondLastTD.sellSetupPerfection'
            console.info('SELL: lastTD.bearishFlip || lastTD.sellSetupPerfection')
            SELL = true
        }

        // If it's a green two upon a green one
        if (secondLastTD.buySetupIndex === 2 && (lastWeekTicks[1].close > lastWeekTicks[2].close)) {
            messageData += '\n BUY: it\'s a green two upon a green one'
            console.info('BUY: lastTD.sellSetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)')
            SELL = false
        }

        // If it's a red two under a red one
        if (secondLastTD.sellSetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)) {
            messageData += '\n SELL: it\'s a red two under a red one'
            console.info('SELL: lastTD.buySetupIndex === 2 && (lastWeekTicks[1].close < lastWeekTicks[2].close)')
            SELL = true
        }

        // If it's a green 9  then sell (or better: if yesterday was a green 8 then sell today)
        if (secondLastTD.sellCoundownIndex === 8) {
            messageData += '\n SELL: it\'s a green 9'
            console.info('SELL: secondLastTD.sellCoundownIndex')
            SELL = true
        }

        // Log data and SELL result to db
        await this.logStrategy(strategy, lastWeekTicks, secondLastTD, SELL)

        if (SELL === null) {
            messageData += '\n FINAL ACTION: Match not found, no actions required.'
            console.info('FINAL ACTION: Match not found, no actions required.')
            await this.sendTelegramMessage(messageData)
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
            messageData += '\n FINAL ACTION: SELL'
            console.info('FINAL ACTION: SELL')
            if (env === 'production') {
                // These orders will be executed at current market price.
                // TODO: place real order
                binance.marketSell(assetName, quantity, (error, response) => {
                    console.info("Market Buy response", response);
                    console.info("order id: " + response.orderId);

                    // TODO:Log the trade
                })
            } else {
                // Fake log sell
                await this.logTrade(strategy, 'SELL', quantity, 0)
                messageData += '\n FAKE SOLD AT $$$'
            }
        } else {
            messageData += '\n FINAL ACTION: BUY'
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
                await this.logTrade(strategy, 'BUY', quantity, 0)
                messageData += '\n FAKE BOUGHT AT $$$'
            }
        }

        await this.sendTelegramMessage(messageData)
        console.groupEnd()
    }


    logStrategy = async (strategy, lastWeekTicks, secondLastTD, SELL) => {
        let strategyLog = new StrategyLog()
        strategyLog.strategy_id = strategy.id
        strategyLog.data = {
            lastWeekTicks: lastWeekTicks,
            secondLastTD: secondLastTD,
            action: SELL ? 'SELL' : 'BUY'
        }
        await strategyLog.save()
        console.debug('Logged strategy!')
    }

    logTrade = async (strategy, trade_type, quantity, price) => {
        let tradeLog = new TradeLog()
        tradeLog.strategy_id = strategy.id
        tradeLog.trade_type = trade_type
        tradeLog.quantity = quantity
        tradeLog.price = price
        await tradeLog.save()
        console.log('Logged Fake BUY!')
    }

    sendTelegramMessage = async (message) => {
        for(const chatId of CHAT_IDS) {
            // console.log(chatId)
            await client.sendMessage(chatId, message, {
                disableWebPagePreview: true,
                disableNotification: true,
            });
        }
    }

}

module.exports = TDSequentialJob;
