'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CoinSchema extends Schema {
  up () {
    this.create('coins', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('symbol').notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('coins')
  }
}

module.exports = CoinSchema
