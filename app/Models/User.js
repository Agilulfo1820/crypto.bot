'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
    portfolios() {
        return this.hasMany('App/Models/Portfolio', 'id', 'user_id')
    }
}

module.exports = User
