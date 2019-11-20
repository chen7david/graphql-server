const { gql } = require('apollo-server')

const typeDefs = gql`

    type authCredentials {
        accessToken: String!
        refreshToken: String!
        me: User!
    }

    type refreshCredentials {
        accessToken: String!
        me: User!
    }

    input authInfo {
        username: String!
        password: String!
    }

    input passwordRecovery{
        password: String!,
        passwordConfirm: String,
        token: String!
    }
    
    
    extend type Mutation {
        authenticate(authInfo: authInfo!): authCredentials!
        refreshToken(refreshToken: String!): refreshCredentials!
        activateAccount(token: String!): authCredentials!
        resendActivation(email: String!): Boolean!
        sendPasswordReset(email: String!): Boolean!
        resetPassword(passwordRecovery: passwordRecovery!):authCredentials!
    }
`

module.exports = {
    typeDefs
}