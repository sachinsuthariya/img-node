const validator = {};

const input = {
    '/signUp': {
        email: {
            rules: [{
                    type: 'notEmpty',
                    msg: 'REQ_EMAIL'
                },
                {
                    type: 'validEmail',
                    msg: 'ERR_VALID_EMAIL'
                },
            ]
        },
        password: {
            rules: [{
                type: 'notEmpty'
            }, {
                type: 'validPassword',
                msg: 'ERR_VALID_PASSWORD'
            }]
        }
    },

    '/signIn': {
        email: {
            rules: [{
                type: 'notEmpty'
            }, {
                type: 'validEmail',
                msg: 'ERR_VALID_EMAIL'
            }],
        },
        password: {
            rules: [{
                type: 'notEmpty'
            }, {
                type: 'validPassword',
                msg: 'ERR_VALID_PASSWORD'
            }],
        },
    },
};

validator.get = route => input[route];

module.exports = validator;