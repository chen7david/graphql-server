exports.up = function(knex) {
  return knex.schema.createTable('roles',(table)=>{
    table.increments()
    table.string('roleId').unique().notNullable()
    table.string('name').unique().notNullable()
    table.text('description')
    table.boolean('global').defaultTo(false)
    table.timestamps(true,true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('roles')
}