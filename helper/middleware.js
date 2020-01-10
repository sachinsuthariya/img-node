const _ = require('lodash');
const jwtUtils = require("./jwt");
const _v = require('../helper/validation.js');
const {
    resStatusCode
} = require("../helper/constant");

const middleware = {};

middleware.isAuthenticate = (req, res, next) => {
    if (req.method == 'OPTIONS') return next();

    const {
        byPassRoute,
    } = req;

    let path = req.path;
    if (byPassRoute.length) {
        path = path.trim();

        const isRoute = byPassRoute.includes(path);

        if (isRoute) {
            return next();
        }
    }

    // get token from header
    const token = req.headers['x-auth-token'];
    // if no token
    const response = {
        success: false,
        message: req.t('No_TOKEN')
    };
    if (!token) return res.status(resStatusCode.error.unauthorized).json(response);
    try {
        const decoded = jwtUtils.decodeToken(token);

        req.user = decoded;
        next();
    } catch (err) {
        const response = {
            success: false,
            message: req.t("INVALID_TOKEN")
        };
        return res.status(resStatusCode.error.badRequest).json(response);
    }
}


middleware.reqValidator = (req, res, next) => {
    const {
        validations
    } = req;
    const error = _v.validate(req, validations);
    if (!_.isEmpty(error)) {
        res.status(error.statusCode).json(error);
    } else {
        next();
    }
};

module.exports = middleware;