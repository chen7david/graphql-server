const { gql } = require('apollo-server')

const typeDefs = gql`

    type Role {
        roleId: String!
        name: String!
        description: String!
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

    extend type Query {
        roles: [Role]!
        role(roleId: String!): Role
    }
    
    extend type Mutation {
        addRole(addRoleInfo: addRoleInfo!): Role!
        deleteRole(roleId: String!): Boolean!
        patchRole(roleId: String!, patchRoleInfo: patchRoleInfo!): Role!
    }
`

module.exports = {
    typeDefs
}