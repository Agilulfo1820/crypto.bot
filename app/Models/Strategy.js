'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Strategy extends Model {
    static boot () {
        super.boot()

        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    indicator() {
        return this.belongsTo('App/Models/Indicator', 'indicator_id', 'id')
    }

    account() {
        return this.belongsTo('App/Models/Account', 'account_id', 'id')
    }

    timeframe() {
        return this.belongsTo('App/Models/Timeframe', 'timeframe_id', 'id')
    }

    asset() {
        return this.belongsTo('App/Models/CoinPair', 'coin_pair_id', 'id')
    }

    logs() {
        return this.hasMany('App/Models/StrategyLog', 'id', 'strategy_id')
    }
}

module.exports = Strategy
