const { Role } = require('../../models')
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
    }
}

module.exports = {
    resolvers
}