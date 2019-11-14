const { gql } = require('apollo-server')

const typeDefs = gql`

    type User {
        userId: String!
        username: String!
        email: String!
        disabled: Boolean!
        emailVerified: Boolean!
    }

    extend type Query {
        users:[User]!
    }

    extend type Mutation {
        
    }
`

module.exports = {
    typeDefs
}