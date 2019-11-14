exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments()
        table.string('userId').unique().notNullable()
        table.string('username').unique().notNullable()
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
        table.boolean('disabled').defaultTo(false)
        table.boolean('emailVerified').defaultTo(false)
        table.timestamps(true, true)
    })
}

exports.down = function(knex) {
     return knex.schema.dropTable('users')
}