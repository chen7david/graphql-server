const { gql } = require('apollo-server')

const typeDefs = gql`

    input authInfo {
        username: String!
        password: String!
    }

    type authCredentials {
        accessToken: String!
        refreshToken: String!
        me: User!
    }
    
    extend type Mutation {
        authenticate(authInfo: authInfo!): authCredentials!
    }
`

module.exports = {
    typeDefs
}