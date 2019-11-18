const BaseModel = require('./BaseModel')
const crypto = require('crypto')


class Group extends BaseModel {

    async $beforeInsert() {
        // GENERATES A GROUPID UPON INSERT
        this.groupId = 'GR' + await crypto.randomBytes(5).toString('hex').toUpperCase()
    }

    static get relationMappings(){ 

        const User = require('./User')

        return {
            users:{
                relation: BaseModel.ManyToManyRelation,
                modelClass: User,
                join:{
                    from:'groups.id',
                    to:'users.id',
                    through:{
                        from:'user_groups.group_id',
                        to:'user_groups.user_id'
                    }
                }
            }
        }
    }
}

module.exports = Group