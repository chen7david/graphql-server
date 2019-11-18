const BaseModel = require('./BaseModel')
const crypto = require('crypto')


class Group extends BaseModel {

    async $beforeInsert() {
        console.log('hello')
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
                    from:'users.id',
                    to:'groups.id',
                    through:{
                        from:'user_groups.user_id',
                        to:'user_groups.group_id'
                    }
                }
            }
        }
    }
}

module.exports = Group