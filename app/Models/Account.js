'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Encryption = use('Encryption')

class Account extends Model {
    static boot () {
        super.boot()

        /**
         * A hook to encrypt the api_secret before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (accountInstance) => {
            if (accountInstance.dirty.api_secret) {
                accountInstance.api_secret = Encryption.encrypt(accountInstance.api_secret)
            }
        })

        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    user() {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }

    exchange() {
        return this.belongsTo('App/Models/Exchange', 'exchange_id', 'id')
    }

    strategies() {
        return this.hasMany('App/Models/Strategy', 'id', 'account_id')
    }
}

module.exports = Account
