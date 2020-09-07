'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Timeframe extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }

    strategies() {
        return this.hasMany('App/Models/Strategy', 'id', 'timeframe_id')
    }
}

module.exports = Timeframe
