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
        if(this.password) this.password = await bcrypt.hash(this.password, 10)
        if(this.email) this.emailVerified = false
    }

    async verifyPassword(password){
        // RETURNS TRUE IF GIVEN PASSWORD MATCHES DB PASSWORD
        return await bcrypt.compare(password, this.password)    
    }

    async depositPoints(object){
        return await this.$relatedQuery('points').insert(object)
    }

    async mail(body){
        return body
    }

    static get relationMappings(){ 

        const Role = require('./Role')
        const Group = require('./Group')
        const Point = require('./Point')

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
            },

            points: {
                relation: BaseModel.HasManyRelation,
                modelClass: Point,
                join:{
                    from:'users.id',
                    to:'points.user_id',
                } 
            },

            friends: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: User,
                join:{
                    from: 'users.id',
                    to: 'users.id',
                    through:{
                        from: 'friends.user_id',
                        to: 'friends.friend_id',
                        extra: ['requester', 'state']
                    }
                }
            },

            friendsOf: {
                relation: BaseModel.ManyToManyRelation,
                modelClass: User,
                join:{
                    from: 'users.id',
                    to: 'users.id',
                    through:{
                        from: 'friends.friend_id',
                        to: 'friends.user_id',
                        extra: ['requester', 'state']
                    }
                }
            }

        }
    }
}

module.exports = User