const { User } = require('./../../models')
const resolvers = {
    Query:{
        // Queries go here ...

        users: async () => await User.query(),

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
            return await user.$query().patchAndFetch(args.patchUserObject)
        },

        deleteUser: async (_, args) => await User.query().where('userId',args.userId).delete(),
    }
}

module.exports = {
    resolvers
}