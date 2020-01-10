const Enum = require("enum");

module.exports = {
    language: {
        english: "english",
        arabic: "arabic"
    },

    saltRound: 10,

    resStatusCode: {
        success: 200,
        created: 201,
        error: {
            internalServerError: 500,
            badRequest: 400,
            unauthorized: 401,
            forbidden: 403,
            notFound: 404,
        }
    },

    ejsTemplate: {
        verifyUser: 'email-user-verify'
    },

    userStatus: {
        active: 'Active',
        inActive: 'Inactive'
    },

    socketEvents: {
        connection: "connection"    
    }
};