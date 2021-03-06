const { gql } = require('apollo-server')

const typeDefs = gql`

    type User {
        userId: String!
        username: String!
        email: String!
        friends: [User]!
        friendRequests: [User]!
        blockedFriends: [User]!
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

    input friendshipInfo {
        userId: String!
        friendId: String!
    }

    input friendshipStateInfo {
        userId: String!
        friendId: String!
        blocked: Boolean!
    }
    
    extend type Mutation {
        addUser(addUserInfo: addUserInfo!): User!
        deleteUser(userId: String!): Boolean!
        patchUser(userId: String!, patchUserInfo: patchUserInfo!): User!
        syncUserRoles(syncUserRolesInfo: syncUserRolesInfo!): [Role]!
        addPoints(userId: String!, addPointsInfo: addPointsInfo!): User!
        stranferPoints(userId: String!, to:to): User!
        expressFriendship(friendshipInfo: friendshipInfo!): Boolean!
        revokeFriendship(friendshipInfo: friendshipInfo!): Boolean!
        updateFriendshipState(friendshipStateInfo: friendshipStateInfo!): Boolean!
    }
`
module.exports = {
    typeDefs
}