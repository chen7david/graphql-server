const { User, Role, Group } = require('../../models')
const { getMe } = require('../../helpers/auth')
const { validate, schema } = require('../../helpers/validation')
const { UniqueViolationError } = require('objection-db-errors')

const resolvers = {
    Query:{
        // Queries go here ...

        groups: async (_, __, ctx) => {
            const $me = getMe(ctx)
            return await Group.query()
        },

        group: async (parent, args) => await Group.query().where('groupId', args.groupId).first(),
    },
    Mutation: {
        // Mutations go here ...

        addGroup: async (_, args) => {
            try {
                const data = validate(schema.addGroup, args.addGroupInfo)
                const user = await Group.query().insert(data)
                return user
            }catch(error){
                if(error instanceof UniqueViolationError) 
                    throw new Error(`${error.columns[0]} already exists`)
                
                throw(error)
            }
        },

        patchGroup: async (_, args) => {
            const group = await Group.query().where('groupId',args.groupId).first()
            if(!group) throw new Error('invalid group id')
            return await group.$query().patchAndFetch(args.patchGroupInfo)
        },

        deleteGroup: async (_, args) => {
            const group = await Group.query().where('groupId',args.groupId).first()
            if(!group) throw new Error('invalid group id')
            return await group.$query().delete()
        },

        syncGroupUsers: async (_, args, ctx) => {
            
    
            const { groupId , userIds } = args.syncGroupUserInfo
    
            const group = await Group.query().where('groupId', groupId).first()

            if(!group) throw new Error('invalid groupId')

            const removeUsers = await group.$relatedQuery('users').whereNotIn('userId', userIds)
            console.log('removeUsers:',removeUsers)
            
            for(const user of removeUsers){
                await group.$relatedQuery('users').unrelate().where('user_id', user.id)
            }

            const addUsers = await User.query().whereIn('userId', userIds)

            console.log('addUsers:',addUsers)

            for(const user of addUsers){
                try{
                    await group.$relatedQuery('users').relate(user.id)
                }catch(error){
                    if(!error instanceof UniqueViolationError) throw(error)
                }
            }
    
            return await group.$relatedQuery('users')
        },
    },

    User: {
        roles: async (user, args, context) => {
            const roles = await user.$relatedQuery('roles')
            return roles
        }
    }
}

module.exports = {
    resolvers
}