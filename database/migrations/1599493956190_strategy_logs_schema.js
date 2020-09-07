'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StrategyLogsSchema extends Schema {
  up () {
    this.create('strategy_logs', (table) => {
      table.increments()
      table.integer('strategy_id').unsigned().notNullable()
          .references('id').inTable('strategies')
      table.json('data')
      table.timestamps()
    })
  }

  down () {
    this.drop('strategy_logs')
  }
}

module.exports = StrategyLogsSchema
