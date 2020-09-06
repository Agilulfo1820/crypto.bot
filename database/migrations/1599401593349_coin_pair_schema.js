'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CoinPairSchema extends Schema {
  up () {
    this.create('coin_pairs', (table) => {
      table.increments()
      table.integer('first_coin_id').unsigned().notNullable()
          .references('id').inTable('coins').onDelete('cascade')
      table.integer('second_coin_id').unsigned().notNullable()
          .references('id').inTable('coins').onDelete('cascade')
      table.unique(['first_coin_id', 'second_coin_id'])
    })
  }

  down () {
    this.drop('coin_pairs')
  }
}

module.exports = CoinPairSchema
