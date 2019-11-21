const { User, Role } = require('./../../models')
const { getMe } = require('./../../helpers/auth')
const { validate, schema } = require('./../../helpers/validation')
const { UniqueViolationError } = require('objection-db-errors')
const { mail } = require('./../../helpers/mail')
const { sign } = require('./../../helpers/jwt')

const resolvers = {
    Query:{
        // Queries go here ...

        users: async (_, __, ctx) => {
            const $me = getMe(ctx)
            console.log('me:',$me)
            return await User.query()
        },

        user: async (_, args) => {
            const user = await User.query().where('userId', args.userId).first()
            return user
        },
    },
    Mutation: {
        // Mutations go here ...

        addUser: async (_, args) => {
            try {
                const data = validate(schema.addUser, args.addUserInfo)
                const user = await User.query().insert(data)

                await mail.sendMail({
                    to:user.email,
                    subject:'Activation Email',
                    body: mail.template('activation', {
                        user,
                        subject:'Activation Email',
                        link: `http://localhost:5000/${sign.activateToken(user)}`
                    })
                })
                
                return user
            }catch(error){
                if(error instanceof UniqueViolationError) 
                    throw new Error(`${error.columns[0]} already exists`)

                throw(error)
            }
        },

        patchUser: async (_, args) => {
            const user = await User.query().where('userId',args.userId).first()
            if(!user) throw new Error('invalid user id')
            return await user.$query().patchAndFetch(args.patchUserInfo)
        },

        deleteUser: async (_, args) => await User.query().where('userId',args.userId).delete(),

        syncUserRoles: async (_, args, ctx) => {
            
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

        addPoints: async (_, args) => {
            const user = await User.query().where('userId',args.userId).first()
            if(!user) throw new Error('invalid user id')
            await user.depositPoints(args.addPointsInfo)
            return user
        },

        stranferPoints: async (_, args) => {
            const sender = await User.query().where('userId',args.userId).first()
            const receiver = await User.query().where('userId',args.to.userId).first()
            if(!sender && !receiver) throw new Error('invalid user id')
            await sender.depositPoints({
                amount:`-${args.to.amount}`,
                description: args.to.description || `transfered to ${receiver.userId}`
            })

            await receiver.depositPoints({
                amount: args.to.amount,
                description: args.to.description || `received transfer from ${receiver.userId}`
            })

            return sender
        },

        addFriend: async (_, args) => {
            const { userId, friendId } = args.friendshipInfo

            const userOne = await User.query().where('userId', userId).first()
            const userTwo = await User.query().where('userId', friendId).first()

            if(!userOne || !userTwo) throw new Error('invalid relationship credentials')

            friend = userOne.id > userTwo.id ? userOne : userTwo
            friendOf = userOne.id == friend.id ? userTwo : userOne

            try{
                await friend.$relatedQuery('friends').relate({id: friendOf.id, requester_id: userOne.id})
            }catch(error){
                console.log(error)
                if(!error instanceof UniqueViolationError) throw(error)
            }
 
            return true
        },

        updateFriendship: async (_, args) => {
            const { userId, friendId } = args.friendshipInfo

            const friend = await User.query().where('userId', userId).first()
            const friendOf = await User.query().where('userId', friendId).first()
            
            
            try{
                
                const x = await friend.$relatedQuery('friends')
                .whereNot('requester_id', friend.id)
                .andWhere('active', false)
                // .patch({active: true})
                console.log(x)
            }catch(error){
                // console.log(error)
                if(!error instanceof UniqueViolationError) throw(error)
            }
 
            return true
        },
    },

    User: {
        roles: async (parent, args, context) => {
            const roles = await parent.$relatedQuery('roles')
            return roles
        },
        pointsHistory: async (parent) => {
            return await parent.$relatedQuery('points')
        },
        points: async (parent) => {
            const sum = await parent.$relatedQuery('points').sum('amount as points').first()
            return sum.points || 0
        },
        friends: async (parent) => {
            const friends = await parent.$relatedQuery('friends')
                .where('active', true)
                .andWhere('blocked', false)
            const friendOf = await parent.$relatedQuery('friendsOf')
                .where('active', true)
                .andWhere('blocked', false)

            return [...friends, ...friendOf]
        },
        friendRequests: async (parent) => {
            const friends = await parent.$relatedQuery('friends')
                .whereNot('requester_id', parent.id)
                .andWhere('active', false)

            const friendOf = await parent.$relatedQuery('friendsOf')
                .whereNot('requester_id', parent.id)
                .andWhere('active', false)

            return [...friends, ...friendOf]
        },
        blockedFriends: async (parent) => {
            const friends = await parent.$relatedQuery('friends')
                .where('blocker_id', parent.id)

            const friendOf = await parent.$relatedQuery('friendsOf')
                .where('blocker_id', parent.id)

            return [...friends, ...friendOf]
        },

    }
}

module.exports = {
    resolvers
}