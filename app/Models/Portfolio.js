'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Encryption = use('Encryption')

class Portfolio extends Model {
    static boot () {
        super.boot()

        /**
         * A hook to encrypt the api_secret before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (portfolioInstance) => {
            if (portfolioInstance.dirty.api_secret) {
                portfolioInstance.api_secret = Encryption.encrypt(portfolioInstance.api_secret)
            }
        })
    }

    user() {
        return this.belongsTo('App/Models/User', 'user_id', 'id')
    }
}

module.exports = Portfolio
