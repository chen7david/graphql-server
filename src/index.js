const { ApolloServer, gql } = require('apollo-server')
const { PORT } = require('./config')
const { users } = require('./graphql')

const typeDefs = gql`
    type Query
    type Mutation
`
const server = new ApolloServer({
    cors:{
        origen: '*',
        credentials: true
    },
    typeDefs: [typeDefs, users.typeDefs],
    resolvers: [users.resolvers],
})

server.listen(PORT).then(({url}) => {
    console.log(`server running at ${url}`)
})