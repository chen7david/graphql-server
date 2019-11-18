exports.up = function(knex) {
  return knex.schema.createTable('groups',(table)=>{
    table.increments()
    table.string('groupId').unique().notNullable()
    table.string('name').unique().notNullable()
    table.text('description').defaultTo('write description here ...')
    table.boolean('active').defaultTo(false)
    table.timestamps(true,true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('groups')
}