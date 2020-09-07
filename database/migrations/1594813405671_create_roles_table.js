'use strict'

const Schema = use('Schema')

class RolesTableSchema extends Schema {
  up () {
    this.create('roles', table => {
      table.increments()
      table.string('slug').notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.unique(['slug'])
      table.timestamps()
    })
  }

  down () {
    this.drop('roles')
  }
}

module.exports = RolesTableSchema
