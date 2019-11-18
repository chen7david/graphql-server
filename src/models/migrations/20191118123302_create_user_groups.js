exports.up = function(knex) {
  return knex.schema.createTable('user_groups',(table)=>{
    table.increments()
    table.unique(['user_id','group_id'])
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index()
    table.integer('group_id').references('id').inTable('groups').onDelete('CASCADE').index()
    table.timestamps(true,true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('user_groups')
}