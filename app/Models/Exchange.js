'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Exchange extends Model {
    static get createdAtColumn () {
        return null;
    }

    static get updatedAtColumn () {
        return null;
    }

    accounts() {
        return this.hasMany('App/Models/Account', 'id', 'exchange_id')
    }
}

module.exports = Exchange
