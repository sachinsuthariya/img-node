const jwt = require("../../helper/jwt");
const userUtils = {};

userUtils.login = (model, data) => {
    try {
        return model.findOne(data);
    } catch (err) {
        return err;
    }
}

userUtils.verifyUser = (token) => {
    // jwt.decodeToken(token);
}

module.exports = userUtils;