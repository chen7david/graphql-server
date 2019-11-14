const knexfile = require('./../../knexfile').development
const Knex = require('knex')(knexfile)
const pluralize =  require('pluralize')
const { Model } = require('objection')
const { DBErrors } = require('objection-db-errors')
Model.knex(Knex)

class BaseModel extends DBErrors(Model) {
    
    static get tableName() {
        return pluralize(this.name.toLowerCase())
    }

    static get modelPaths() {
        return [__dirname]
    }

    $formatJson(json) {
        json = super.$formatJson(json)
        delete json.id
        delete json.password
        delete json.created_at
        delete json.updated_at
        return json
    }

    $beforeInsert(){
        const timestamp = new Date().toISOString()
        this.created_at = timestamp
        this.updated_at = timestamp
    }

    $beforeUpdate(){
        const timestamp = new Date().toISOString()
        this.updated_at = timestamp 
    }
}

module.exports = BaseModel