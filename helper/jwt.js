const jwt = require("jwt-simple");

const jwtUtils = {};

jwtUtils.genToken = (data) => jwt.encode(data, process.env.JWT_SECREAT_KEY);

jwtUtils.decodeToken = (token) => {
    if (token) {
        return jwt.decode(token, process.env.JWT_SECREAT_KEY);
    }
    return false;
}

module.exports = jwtUtils;