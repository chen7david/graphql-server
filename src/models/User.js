const BaseModel = require('./BaseModel')
const crypto = require('crypto')
const bcrypt = require('bcrypt')


class User extends BaseModel {

    async $beforeInsert() {

        // GENERATES A USERID UPON INSERT
        this.userId = 'US' + await crypto.randomBytes(5).toString('hex').toUpperCase()

        // HASHES PASSWORD UPON INSERT
        this.password = await bcrypt.hash(this.password, 10)
    }

    async $beforeUpdate(){
        // SET EMAIL VERIFIED TO NULL WHEN EMAIL IS UPDATED
        if(this.email) this.emailVerified = null
    }

    async verifyPassword(password){
        // RETURNS TRUE IF GIVEN PASSWORD MATCHES DB PASSWORD
        return await bcrypt.compare(password, this.password)    
    }

    static get relationMappings(){ 

        const Role = require('./Role')
        const Group = require('./Group')

        return {
            roles:{
                relation: BaseModel.ManyToManyRelation,
                modelClass: Role,
                join:{
                    from:'users.id',
                    to:'roles.id',
                    through:{
                        from:'user_roles.user_id',
                        to:'user_roles.role_id'
                    }
                }
            },

            groups:{
                relation: BaseModel.ManyToManyRelation,
                modelClass: Group,
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

module.exports = User