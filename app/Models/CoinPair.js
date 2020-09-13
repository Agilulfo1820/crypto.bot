'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Coin = use('App/Models/Coin')

class CoinPair extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }

    strategies() {
        return this.hasMany('App/Models/Strategy', 'id', 'coin_pair_id')
    }

    async firstCoin() {
        return Coin.find(this.first_coin_id)
    }

    secondCoin() {
        return Coin.find(this.second_coin_id)
    }
}

module.exports = CoinPair
