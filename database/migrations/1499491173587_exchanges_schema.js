'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExchangesSchema extends Schema {
  up () {
    this.create('exchanges', (table) => {
      table.increments()
      table.string('name').notNullable()
      table.string('slug').unique().notNullable()
    })
  }

  down () {
    this.drop('exchanges')
  }
}

module.exports = ExchangesSchema
