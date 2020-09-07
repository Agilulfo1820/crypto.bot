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
}

module.exports = StrategyLog
