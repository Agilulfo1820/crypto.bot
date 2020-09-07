'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

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
}

module.exports = CoinPair
