'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class IndicatorsSchema extends Schema {
  up () {
    this.create('indicators', (table) => {
      table.increments()
      table.string('slug').unique()
      table.string('symbol')
      table.string('description')
    })
  }

  down () {
    this.drop('indicators')
  }
}

module.exports = IndicatorsSchema
