'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PortfoliosSchema extends Schema {
  up () {
    this.create('portfolios', (table) => {
      table.increments()
      table.integer('user_id').unsigned().notNullable()
          .references('id').inTable('users').onDelete('cascade')
      table.string('slug').unique()
      table.string('api_key').notNullable().unique()
      table.string('api_secret').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('portfolios')
  }
}

module.exports = PortfoliosSchema
