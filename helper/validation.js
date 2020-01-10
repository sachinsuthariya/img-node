//imports
const _ = require("lodash");
const isEmail = require("isemail");
const isAlphaNumeric = require("is-alphanumeric");
const passwordValidtor = require("password-validator");
const isPhoneNumber = require("validate-phone-number-node-js");
const l10n = require("jm-ez-l10n");

// schema for password validator
var schema = new passwordValidtor();
schema
    .is().min(6) //Minimun length 6
    .is().max(30); // Maximum length 30
// .has().uppercase() // Must have uppercase letters
// .has().lowercase() // Must have lowercase letters
// .has().digits() // Must have digits
// .has().not().spaces() // Should not have spaces
// .is().not().oneOf(['Passw0rd', 'Password123']);

validateCtr = {};

// check for boolean values
validateCtr.isDefined = (value) => {
    if (typeof value == "boolean") return true;
}

// validate email
validateCtr.validEmail = (email) => {
    if (email) {
        return isEmail.validate(email);
    }
    return false;
}

// validate phon no.
validateCtr.validPhoneNo = (mobile) => {
    if (mobile) {
        return isPhoneNumber.validate(mobile);
    }
    return false;
}

// validate input is email or phon number
validateCtr.validEmailOrPhone = (input) => {
    if (input) {
        return this.validEmail(input) || this.validPhoneNo(input);
    }
    return false;
}

// validate password
validateCtr.validPassword = (password) => {
    if (password) {
        return schema.validate(password);
    }
    return false;
}

// isAlphaNumeric
validateCtr.isAlphaNumeric = (input) => {
    if (input) {
        return isAlphaNumeric(input);
    }
    return false;
}

// chech the value is empty or not
validateCtr.notEmpty = str => _.isNumber(str) || (!_.isEmpty(str) && !(str.trim() === ''));

// validate request body
const validate = (req, validationRules, parentKey) => {
    const {
        body,
        files,
        query
    } = req;
    const orgBody = req.orgBody || body;
    let input = {};
    let error = {};

    if (!_.isEmpty(validationRules)) {
        // Can use `forEach`, but used `every` as hack to break the loop
        Object.keys(validationRules).every((key) => {
            let validations = validationRules[key];
            if (validations.isFile) {
                input = files;
            } else if (validationRules.isQueryParams) {
                input = query;
            } else {
                input = body;
            }
            if (validations.isOptional && input[key] === undefined) {
                return error;
            }
            if (!_.isEmpty(validations.byPassWhen) || typeof validations.byPassWhen === 'function') {
                if (typeof validations.byPassWhen === 'function') {
                    if (validations.byPassWhen(orgBody)) {
                        return error;
                    }
                } else if (!_.isEmpty(strToObj(validations.byPassWhen, input))) {
                    return error;
                }
            }

            if (validations.hasChilds && validations.hasChilds === true) {
                if (_.isEmpty(input[key])) {
                    const generatedError = validateCtr.getGeneratedError((parentKey ? `${parentKey}.` : '') + key, 'notEmpty');
                    error = {
                        statusCode: 400,
                        field: key,
                        type: 'notEmpty',
                        error: generatedError,
                        generatedError,
                    };
                } else {
                    error = validate({
                        body: input[key],
                        orgBody: body
                    }, validations.childs, key);
                }

                // return false; // To break the `every` loop
            }

            if (!_.isArray(validations)) {
                if (_.isEmpty(validations.rules)) {
                    validations = [validations];
                } else {
                    validations = validations.rules;
                }
            }

            // Can use `forEach`, but used `every` as hack to break the loop
            validations.every((validation) => {
                if (!_.isEmpty(validation)) {
                    const {
                        type,
                        msg,
                        options,
                        statusCode,
                    } = validation;

                    if (!validateCtr[type](input[key], options)) {
                        const generatedError = validateCtr.getGeneratedError((parentKey ? `${parentKey}.` : '') + key, type, options, input[key]);
                        error = {
                            statusCode: statusCode || 400,
                            field: key,
                            type,
                            error: msg ? req.t(msg) : null || generatedError,
                            generatedError,
                        };

                        return false;
                    }
                }
                return true;
            });

            if (!_.isEmpty(error)) {
                return false;
            }
            return true;
        });
    }
    return error;
};

// genrate error message
validateCtr.getGeneratedError = (field, type, options, str) => {
    switch (type) {
        case 'notEmpty':
            return `${field} is required`;
        case 'isValidPhoneNumber':
            return `${field} is not valid`;
        case 'isValidMime':
            return `${field} - Unsopported file format`;
        case 'validPassword': {
            return schema.validate(str);
        }
        case 'isAlphanumeric': {
            return `${field} - Invalid input, only supported Alphanumeric chars.`;
        }
        case 'isNumberInRange': {
            if (options.max === options.min) {
                return `${field} should be exactly of ${options.min}.`;
            }
            if (options.max && options.min) {
                return `${field} should be at-least of ${options.min} and maximum of ${options.max}.`;
            }
            if (options.max) {
                return `${field} should maximum of ${options.max}.`;
            }
            if (options.min) {
                return `${field} should at-least of ${options.min}.`;
            }
            return `${field} - error - ${type}`;
        }
        case 'checkLength':
            if (_.isFinite(options.max) === _.isFinite(options.min)) {
                return `${field} should be exactly of ${options.min} characters`;
            }
            if (_.isFinite(options.max) && _.isFinite(options.min)) {
                return `${field} should be at-least of ${options.min} and maximum of ${options.max} characters`;
            }
            if (_.isFinite(options.max)) {
                return `${field} should maximum of ${options.max} characters`;
            }
            if (_.isFinite(options.min)) {
                return `${field} should at-least of ${options.min} characters`;
            }
            return `${field} - error - ${type}`;
        default:
            return `${field} - error - ${type}`;
    }
};

module.exports = {
    validateCtr,
    validate
}