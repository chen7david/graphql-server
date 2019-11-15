const { User, Role } = require('../../models')
const { UniqueViolationError } = require('objection-db-errors')

const resolvers = {
    Query:{
        // Queries go here ...

        roles: async () => await Role.query(),

        role: async (_, args) => await Role.query().where('roleId', args.roleId).first(),
    },
    Mutation: {
        // Mutations go here ...

        addRole: async (_, args) => {
            
            try {
                const role = await Role.query().insert(args.addRoleInfo)
                return role
            }catch(error){
                if(error instanceof UniqueViolationError) 
                    throw new Error(`${error.columns[0]} already exists`)
            }
        },

        patchRole: async (_, args) => {
            const role = await Role.query().where('roleId',args.roleId).first()
            if(!role) throw new Error('invalid role id')
            return await role.$query().patchAndFetch(args.patchRoleInfo)
        },

        deleteRole: async (_, args) => await Role.query().where('roleId', args.roleId).delete(),

        syncRoleUsers: async (_, args, ctx) => {
            // const $me = context.$me || false
            // if(!$me) throw new Error('not authenticated')
            // $me.hasRight('syncUserRoles')
    
            const { roleId, userIds } = args.syncRoleUsersInfo
    
            const role = await Role.query().where('roleId', roleId).first()
    
            if(!role) throw new Error('invalid roleId')

            const removeUsers = await role.$relatedQuery('users').whereNotIn('userId', userIds)

            for(const user of removeUsers){
                await role.$relatedQuery('users').unrelate().where('user_id', user.id)
            }

            const addUsers = await User.query().whereIn('userId', userIds)

            for(const user of addUsers){
                try{
                    await role.$relatedQuery('users').relate(user.id)
                }catch(error){
                    if(!error instanceof UniqueViolationError) throw(error)
                }
            }
    
            return await role.$relatedQuery('users')
        },
    },

    Role: {
        users: async (parent, args, context) => {
            const users = await parent.$relatedQuery('users')
            return users
        }
    }
}

module.exports = {
    resolvers
}