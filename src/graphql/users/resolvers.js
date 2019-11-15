const { User, Role } = require('./../../models')
const { UniqueViolationError } = require('objection-db-errors')

const resolvers = {
    Query:{
        // Queries go here ...

        users: async (_, __, ctx) => {
            console.log(ctx)
            return await User.query()
        },

        user: async (parent, args) => await User.query().where('userId', args.userId).first(),
    },
    Mutation: {
        // Mutations go here ...

        addUser: async (_, args) => {
            try {
                const user = await User.query().insert(args.addUserInfo)
                return user
            }catch(error){
                if(error instanceof UniqueViolationError) 
                    throw new Error(`${error.columns[0]} already exists`)
            }
        },

        patchUser: async (_, args) => {
            const user = await User.query().where('userId',args.userId).first()
            if(!user) throw new Error('invalid user id')
            return await user.$query().patchAndFetch(args.patchUserInfo)
        },

        deleteUser: async (_, args) => await User.query().where('userId',args.userId).delete(),

        syncUserRoles: async (_, args, ctx) => {
            // const $me = context.$me || false
            // if(!$me) throw new Error('not authenticated')
            // $me.hasRight('syncUserRoles')
    
            const { userId, roleIds } = args.syncUserRolesInfo
    
            const user = await User.query().where('userId', userId).first()
    
            if(!user) throw new Error('invalid userId')


    
            const removeRoles = await user.$relatedQuery('roles').whereNotIn('roleId', roleIds)

            for(const role of removeRoles){
                await user.$relatedQuery('roles').unrelate().where('role_id', role.id)
            }

            const addRoles = await Role.query().whereIn('roleId', roleIds)

            for(const role of addRoles){
                try{
                    await user.$relatedQuery('roles').relate(role.id)
                }catch(error){
                    if(!error instanceof UniqueViolationError) throw(error)
                }
            }
    
            return await user.$relatedQuery('roles')
        },
    }
}

module.exports = {
    resolvers
}