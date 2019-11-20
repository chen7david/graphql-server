const { gql } = require('apollo-server')

const typeDefs = gql`

    type User {
        userId: String!
        username: String!
        email: String!
        roles: [Role]!
        pointsHistory: [Point]!
        points: Int
        disabled: Boolean!
        emailVerified: Boolean!
    }

    type Point {
        amount: Int!
        description: String!
        created_at: String!
    }

    input addUserInfo {
        username: String!
        email: String!
        password: String!
    }

    input patchUserInfo {
        email: String
    }

    input syncUserRolesInfo {
        userId: String!
        roleIds: [String]!
    }

    input addPointsInfo {
        amount: Int!
        description: String
    }

    input to {
        userId: String!
        amount: Int!
        description: String
    }

    extend type Query {
        users:[User]!
        user(userId: String!): User
    }
    
    extend type Mutation {
        addUser(addUserInfo: addUserInfo!): User!
        deleteUser(userId: String!): Boolean!
        patchUser(userId: String!, patchUserInfo: patchUserInfo!): User!
        syncUserRoles(syncUserRolesInfo: syncUserRolesInfo!): [Role]!
        addPoints(userId: String!, addPointsInfo: addPointsInfo!): User!
        stranferPoints(userId: String!, to:to): User!
    }
`

module.exports = {
    typeDefs
}