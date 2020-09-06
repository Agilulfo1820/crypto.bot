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
const Database = use('Database')
const uuid = require("uuid/v4")
const Hash = use('Hash')

class InitialSeeder {
    async run() {
        /**
         * Seeding Users
         */
        console.log('Seeding Users')
        await Database.table('users')
            .insert({
                username: 'testUser'
            })
        const user = await User.first()

        /**
         * Seeding Portfolios
         */
        console.log('Seeding Portfolios')
        await Database.table('portfolios')
            .insert({
                user_id: user.id,
                slug: 'testPortfolio',
                description: 'Test portfolio with only read permissions',
                api_key: '2uQAZvjbwwrwqG3Qqbx3XCB43LxRaQw85lPSuoyXGilVfAdfnh2F0mTRjrb7UP4s',
                api_secret: await Hash.make('sqejRQMHIbbN316cJElzVo758yWyi2KPu8cWVvT0tTKGA2wv511ibd3v6WbVDk6W')
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
    }
}

module.exports = InitialSeeder
