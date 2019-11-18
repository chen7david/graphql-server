exports.up = function(knex) {
  return knex.schema.createTable('points',(table)=>{
      table.increments()
      table.string('description').defaultTo('reward')
      table.integer('amount').notNullable()
      table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index()
      table.timestamps(true,true)
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('points')
}