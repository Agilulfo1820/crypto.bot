'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username').unique().notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('first_name', 60).nullable()
      table.string('last_name', 60).nullable()
      table.string('phone_number', 60).notNullable()
      table.dateTime('last_login').nullable()
      table.timestamps()
      table.dateTime('deleted_at')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
