const { ApolloServer, gql } = require('apollo-server')
const JWT = require('jsonwebtoken')
const { User } = require('./models')
const { PORT, JWT_SECRET } = require('./config')
const { users, roles, auth, groups } = require('./graphql')

const typeDefs = gql`
    type Query
    type Mutation
`
const server = new ApolloServer({
    cors:{
        origen: '*',
        credentials: true
    },
    typeDefs: [
        typeDefs, 
        users.typeDefs, 
        roles.typeDefs,
        auth.typeDefs,
        groups.typeDefs
    ],
    resolvers: [
        users.resolvers, 
        roles.resolvers,
        auth.resolvers,
        groups.resolvers
    ],
    context: async ({req}) => {
        try{
            const token = req.headers.authorization || ''
            const { userId } = JWT.decode(token.replace('Bearer ',''))
            if(!userId) throw new Error('invalid token')
            const user = await User.query().where('userId', userId).first()
            // .eager('roles.rights').first()
            if(!user) throw new Error('invalid token')
            JWT.verify(token.replace('Bearer ',''), JWT_SECRET + user.password)
            
            if(!user) throw new Error('invalid userId')

            return { authenticated: true, $me: user }

        }catch(error){ 
            // console.log(error)
            errors = ['invalid signature', 'jwt expired', 'invalid token', 'jwt malformed']
            if(errors.includes(error.message) ){
                throw new Error('jwt expired')
            }
            return { authenticated: false } 
        }
    }
})

server.listen(PORT).then(({url}) => {
    console.log(`server running at ${url}`)
})