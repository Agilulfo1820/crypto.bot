'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TimeframesSchema extends Schema {
  up () {
    this.create('timeframes', (table) => {
      table.increments()
      table.integer('value').notNullable()
      table.string('range').notNullable()
      table.string('slug').unique().notNullable()
      table.string('description')
    })
  }

  down () {
    this.drop('timeframes')
  }
}

module.exports = TimeframesSchema
