exports.up = function(knex) {
    return knex.schema.createTable('friends', table => {
        table.increments()
        table.unique(['user_id','friend_id'])
        table.boolean('requester').defaultTo(false)
        table.boolean('blocked').defaultTo(false)
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index()
        table.integer('friend_id').references('id').inTable('users').onDelete('CASCADE').index()
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
     return knex.schema.dropTable('friends')
}