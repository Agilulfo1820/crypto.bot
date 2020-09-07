'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TradeLogsSchema extends Schema {
  up () {
    this.create('trade_logs', (table) => {
      table.increments()
      table.integer('strategy_id').unsigned().notNullable()
          .references('id').inTable('strategies')
      table.string('trade_type')
      table.float('quantity')
      table.float('price')
      table.timestamps()
    })
  }

  down () {
    this.drop('trade_logs')
  }
}

module.exports = TradeLogsSchema
