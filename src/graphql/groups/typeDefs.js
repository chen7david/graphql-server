const { gql } = require('apollo-server')

const typeDefs = gql`

    type Group {
        groupId: String!
        name: String!
        description: String!
        active: Boolean!
        users: [User]!
    }

    input addGroupInfo {
        name: String!
        description: String
    }

    input patchGroupInfo {
        name: String
        description: String
    }

    input syncGroupUserInfo {
        groupId: String!
        userIds: [String]!
    }

    extend type Query {
        groups:[Group]!
        group(groupId: String!): Group
    }
    
    extend type Mutation {
        addGroup(addGroupInfo: addGroupInfo!): Group!
        deleteGroup(groupId: String!): Boolean!
        patchGroup(groupId: String!, patchGroupInfo: patchGroupInfo!): Group!
        syncGroupUsers(syncGroupUserInfo: syncGroupUserInfo): [User]!
    }
`

module.exports = {
    typeDefs
}