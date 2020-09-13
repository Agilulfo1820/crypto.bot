'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StrategyLog extends Model {
    static boot () {
        super.boot()
        this.addTrait('@provider:Jsonable')
    }

    get jsonFields () {
        return [
            'data'
        ]
    }

    strategy() {
        return this.belongsTo('App/Models/Strategy', 'strategy_id', 'id')
    }
}

module.exports = StrategyLog
