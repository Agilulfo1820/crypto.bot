'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StrategiesSchema extends Schema {
    up() {
        this.create('strategies', (table) => {
            table.increments()
            table.string('name')
            table.integer('coin_pair_id').unsigned().notNullable()
                .references('id').inTable('coin_pairs').onDelete('cascade')
            table.integer('indicator_id').unsigned().notNullable()
                .references('id').inTable('indicators').onDelete('cascade')
            table.integer('account_id').unsigned().notNullable()
                .references('id').inTable('accounts').onDelete('cascade')
            table.integer('timeframe_id').unsigned().notNullable()
                .references('id').inTable('timeframes').onDelete('cascade')
            table.float('budget').default(0)
            table.float('balance').default(0)
            table.boolean('is_active').default(true)
            table.timestamps()
            table.dateTime('deleted_at')
        })
    }

    down() {
        this.drop('strategies')
    }
}

module.exports = StrategiesSchema
