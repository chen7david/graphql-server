const { ApolloServer, gql } = require('apollo-server')
const JWT = require('jsonwebtoken')
const { PORT, JWT_SECRET } = require('./config')
const { users, roles, auth } = require('./graphql')


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
        auth.typeDefs
    ],
    resolvers: [
        users.resolvers, 
        roles.resolvers,
        auth.resolvers
    ],
    context: async ({req}) => {
        try{
            const token = req.headers.authorization || ''
            const { userId } = JWT.verify(token.replace('Bearer ',''), JWT_SECRET)
            const user = await User.query().where('userId', userId).eager('roles.rights').first()

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