'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Indicator extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }

    strategies() {
        return this.hasMany('App/Models/Strategy', 'id', 'indicator_id')
    }
}

module.exports = Indicator
