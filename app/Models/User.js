'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
    static boot () {
        super.boot()

        /**
         * A hook to hash the user password before saving
         * it to the database.
         */
        this.addHook('beforeSave', async (userInstance) => {
            if (userInstance.dirty.password) {
                userInstance.password = await Hash.make(userInstance.password)
            }
        })

        this.addTrait('@provider:Lucid/SoftDeletes')
    }

    static get traits () {
        return [
            '@provider:Adonis/Acl/HasRole',
            '@provider:Adonis/Acl/HasPermission'
        ]
    }

    accounts() {
        return this.hasMany('App/Models/Account', 'id', 'user_id')
    }
}

module.exports = User
