const { gql } = require('apollo-server')

const typeDefs = gql`

    type Role {
        roleId: String!
        name: String!
        description: String!
        users: [User]!
        global: Boolean!
    }

    input addRoleInfo {
        name: String!
        description: String!
        global: Boolean
    }

    input patchRoleInfo {
        name: String
        description: String
    }

    input syncRoleUsersInfo {
        roleId: String!
        userIds: [String]!
    }

    extend type Query {
        roles: [Role]!
        role(roleId: String!): Role
    }
    
    extend type Mutation {
        addRole(addRoleInfo: addRoleInfo!): Role!
        deleteRole(roleId: String!): Boolean!
        patchRole(roleId: String!, patchRoleInfo: patchRoleInfo!): Role!
        syncRoleUsers(syncRoleUsersInfo: syncRoleUsersInfo): [User]!
    }
`

module.exports = {
    typeDefs
}