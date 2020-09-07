'use strict'

/*
|--------------------------------------------------------------------------
| InitialSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const User = use('App/Models/User')
const Coin = use('App/Models/Coin')
const Exchange = use('App/Models/Exchange')
const Database = use('Database')
const uuid = require("uuid/v4")
const Hash = use('Hash')
const Encryption = use('Encryption')

class InitialSeeder {
    async run() {
        /**
         * Seeding Users
         */
        console.log('Seeding Users')
        await Database.table('users')
            .insert({
                username: 'testUser',
                password: 'Hello123!',
                email: 'test@email.com',
                phone_number: '3207925997',
            })
        const user = await User.first()

        /**
         * Seeding Exchanges
         */
        console.log('Seeding Exchanges')
        await Database.table('exchanges')
            .insert({
                name: 'Binance',
                slug: 'binance'
            })
        const exchange = await Exchange.first()

        /**
         * Seeding Accounts
         */
        console.log('Seeding Accounts')
        await Database.table('accounts')
            .insert({
                user_id: user.id,
                exchange_id: exchange.id,
                name: 'testAccount',
                balance: 0,
                api_key: '2uQAZvjbwwrwqG3Qqbx3XCB43LxRaQw85lPSuoyXGilVfAdfnh2F0mTRjrb7UP4s',
                api_secret:  Encryption.encrypt('sqejRQMHIbbN316cJElzVo758yWyi2KPu8cWVvT0tTKGA2wv511ibd3v6WbVDk6W')
            })

        /**
         * Seeding Coins
         */
        console.log('Seeding Coins')
        await Database.table('coins')
            .insert([
                {
                    name: 'Bitcoin',
                    symbol: 'BTC'
                },
                {
                    name: 'Ethereum',
                    symbol: 'ETH'
                },
                {
                    name: 'Tether',
                    symbol: 'USDT'
                }
            ])

        console.log('Seeding Coin Pairs')
        const BTC = await Coin.findBy('symbol', 'BTC')
        const ETH = await Coin.findBy('symbol', 'ETH')
        const USDT = await Coin.findBy('symbol', 'USDT')
        await Database.table('coin_pairs')
            .insert([
                {
                    first_coin_id: BTC.id,
                    second_coin_id: ETH.id
                },
                {
                    first_coin_id: BTC.id,
                    second_coin_id: USDT.id
                },
                {
                    first_coin_id: ETH.id,
                    second_coin_id: USDT.id
                },
                {
                    first_coin_id: ETH.id,
                    second_coin_id: BTC.id
                }
            ])
    }
}

module.exports = InitialSeeder
