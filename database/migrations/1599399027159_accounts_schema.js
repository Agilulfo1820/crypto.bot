'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AccountsSchema extends Schema {
  up () {
    this.create('accounts', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
          .references('id').inTable('users').onDelete('cascade')
      table.integer('exchange_id').unsigned().notNullable()
          .references('id').inTable('exchanges').onDelete('cascade')
      table.string('name')
      table.float('balance')
      table.string('api_key').notNullable().unique()
      table.string('api_secret').notNullable()
      table.timestamps()
      table.dateTime('deleted_at')
    })
  }

  down () {
    this.drop('accounts')
  }
}

module.exports = AccountsSchema
