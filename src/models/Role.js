const BaseModel = require('./BaseModel')

class Role extends BaseModel {

    async $beforeInsert() {

        // GENERATES A USERID UPON INSERT
        this.roleId = 'RO' + await crypto.randomBytes(5).toString('hex').toUpperCase()
    }

    static get relationMappings(){   
        
        const User = require('./User')
        
        return {
            users:{
                relation: BaseModel.ManyToManyRelation,
                modelClass: User,
                join:{
                    from:'roles.id',
                    to:'users.id',
                    through:{
                        from:'user_roles.role_id',
                        to:'user_roles.user_id'
                    }
                }
            } 
        }
    }
}

module.exports = Role