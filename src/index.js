const { ApolloServer, gql } = require('apollo-server')
const { PORT } = require('./config')
const { users, roles } = require('./graphql')

const typeDefs = gql`
    type Query
    type Mutation
`
const server = new ApolloServer({
    cors:{
        origen: '*',
        credentials: true
    },
    typeDefs: [typeDefs, users.typeDefs, roles.typeDefs],
    resolvers: [users.resolvers, roles.resolvers],
})

server.listen(PORT).then(({url}) => {
    console.log(`server running at ${url}`)
})