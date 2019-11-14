const { gql } = require('apollo-server')

const typeDefs = gql`

    type User {
        userId: String!
        username: String!
        email: String!
        disabled: Boolean!
        emailVerified: Boolean!
    }

    input addUserInfo {
        username: String!
        email: String!
        password: String!
    }

    input patchUserInfo {
        email: String
    }

    extend type Query {
        users:[User]!
        user(userId: String!): User
    }
    
    extend type Mutation {
        addUser(addUserInfo: addUserInfo!): User!
        deleteUser(userId: String!): Boolean!
        patchUser(userId: String!, patchUserInfo: patchUserInfo!): User!
    }
`

module.exports = {
    typeDefs
}