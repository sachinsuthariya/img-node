//import
const model = require("../../helper/models");
const mongoUtils = require("../../helper/mongoUtils");
const helper = require("../../helper/commonUtils");
const jwtUtils = require("../../helper/jwt");
const userUtils = require("./userUtils");
const {
    resStatusCode,
    ejsTemplate,
    userStatus
} = require("../../helper/constant"); //common data
const logger = require("../../helper/logger");


exports.signUp = async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
    const data = {
        email: email,
        password: req.body.password
    };

    try {
        // check email Exist or not
        const emailExist = await mongoUtils.checkExist(model.userModel, {
            email: email
        });
        if (emailExist) {
            const response = {
                success: false,
                message: req.t("REGISTRATION_FAIL"),
                error: req.t("ERR_EMAIL_EXIST")
            };
            return res.json(response);
        } else {
            // insert data
            const result = await mongoUtils.insert(model.userModel, data);

            // genrate token
            const payload = {
                id: result.id,
                email: email,
                isAdmin: result.isAdmin,
                roleId: result.roleId
            }
            const authToken = jwtUtils.genToken(payload);

            if (result) {
                const emailData = {
                    logo: process.env.SYSTEM_LOGO,
                    url: `${process.env.ACC_VERIFICATION_LINK}/${authToken}`
                }

                // email
                await helper.sendMail(result.email, ejsTemplate.verifyUser, emailData); // genrate mail from here

                const response = {
                    success: true,
                    message: req.t("REGISTRATION_SUCCESSS"),
                    body: {
                        id: result.id,
                        email: result.email,
                        token: authToken
                    }
                };
                return res.status(resStatusCode.created).json(response);
            }
        }
    } catch (err) {
        const response = {
            success: false,
            err: err.message,
            message: req.t("REGISTRATION_FAIL")
        };
        return res.status(resStatusCode.error.internalServerError).json(response);
    }
}


exports.signIn = async (req, res) => {
    const email = req.body.email.toLowerCase().trim();
    try {
        const isUser = await userUtils.login(model.userModel, {
            email: email
        });

        if (isUser) {

            if (!isUser.varified) {
                const response = {
                    success: false,
                    message: req.t("ACC_NOT_VARIFIED")
                };
                return res.status(resStatusCode.error.unauthorized).json(response);
            }

            if (isUser.status == userStatus.inActive) {
                const response = {
                    success: false,
                    message: req.t("ACC_DEACTIVATED")
                };
                return res.status(resStatusCode.error.unauthorized).json(response);
            }
            console.log(req.body.password, isUser.password);
            const password = await helper.decrypt(req.body.password, isUser.password);
            console.log(password, "check");

            if (password) {
                const payload = {
                    id: isUser.id,
                    email: email,
                    isAdmin: isUser.isAdmin,
                    roleId: isUser.roleId
                }
                const authToken = await jwtUtils.genToken(payload);
                const response = {
                    success: true,
                    message: req.t("LOGIN_SUCCESS"),
                    body: {
                        id: isUser.id,
                        email: email,
                        isAdmin: isUser.isAdmin,
                        roleId: isUser.roleId,
                        token: authToken
                    }
                };
                return res.status(resStatusCode.success).json(response);
            } else {
                const response = {
                    success: false,
                    err: req.t("LOGIN_FAIL"),
                    message: req.t("INVALID_AUTH")
                };
                return res.status(resStatusCode.error.unauthorized).json(response);
            }
        } else {
            const response = {
                success: false,
                err: req.t("LOGIN_FAIL"),
                message: req.t("INVALID_AUTH")
            };
            return res.status(resStatusCode.error.unauthorized).json(response);
        }
    } catch (err) {
        const response = {
            success: false,
            err: err.message,
            message: req.t("LOGIN_FAIL")
        };
        return res.status(resStatusCode.error.internalServerError).json(response);
    }
}

// exports.signIn = async (req, res) => {
//     // console.log("req.body", req.body);
//     const email = req.body.email.toLowerCase().trim();
//     try {
//         const isUser = await userUtils.login(model.userModel, {
//             email: email
//         });

//         if (isUser) {

//             if (!isUser.varified) {
//                 const response = {
//                     success: false,
//                     message: req.t("ACC_NOT_VARIFIED")
//                 };
//                 return res.status(resStatusCode.error.unauthorized).json(response);
//             }

//             if (isUser.status == userStatus.inActive) {
//                 const response = {
//                     success: false,
//                     message: req.t("ACC_DEACTIVATED")
//                 };
//                 return res.status(resStatusCode.error.unauthorized).json(response);
//             }

//             const password = await helper.decrypt(req.body.password, isUser.password);

//             if (password) {
//                 const authToken = await jwtUtils.genToken({
//                     data: email
//                 });
//                 const response = {
//                     success: true,
//                     message: req.t("LOGIN_SUCCESS"),
//                     body: {
//                         id: isUser.id,
//                         email: email,
//                         token: authToken
//                     }
//                 };
//                 return res.status(resStatusCode.success).json(response);
//             }
//         } else {
//             const response = {
//                 success: false,
//                 err: req.t("LOGIN_FAIL"),
//                 message: req.t("INVALID_AUTH")
//             };
//             return res.status(resStatusCode.error.unauthorized).json(response);
//         }
//     } catch (err) {
//         const response = {
//             success: false,
//             err: err.message,
//             message: req.t("LOGIN_FAIL")
//         };
//         return res.status(resStatusCode.error.internalServerError).json(response);
//     }
// }

exports.verifyAccount = async (req, res) => {
    try {
        const {
            token
        } = req.body;

        const authToken = await jwtUtils.decodeToken(token);

        if (!authToken) {
            const response = {
                success: false,
                message: req.t("UNAUTH_ACC")
            };
            return res.status(resStatusCode.error.unauthorized).json(response);
        }
        const filterObj = {
            email: authToken.email,
            varified: false
        };

        const updateObj = {
            varified: true,
            status: userStatus.active
        };

        const isVarify = await mongoUtils.findAndUpdate(model.userModel, filterObj, updateObj);

        if (isVarify) {
            const response = {
                success: true,
                message: req.t("ACC_VARIFY_SUCCESS")
            };
            return res.status(resStatusCode.success).json(response);
        } else {
            const response = {
                success: false,
                message: req.t('ACC_ALREADY_VARIFIED')
            }
            return res.status(resStatusCode.error.badRequest).json(response);
        }

    } catch (err) {
        logger.error(err.message);
        const response = {
            success: false,
            message: req.t("UNAUTH_ACC"),
            error: err.message
        };
        return res.status(resStatusCode.error.unauthorized).json(response);
    }
}

exports.getUserList = async (req, res) => {
    try {
        const data = await mongoUtils.getData(model.userModel, {
            varified: true
        }, {
            id: 1,
            email: 1,
            status: 1
        });

        const response = {
            success: true,
            body: data.length ? data : req.t("NO_DATA_FOUND")
        }
        return res.status(resStatusCode.success).json(response);
    } catch (err) {
        const response = {
            success: false,
            message: req.t("ERROR"),
            error: err.message
        };
        return res.status(resStatusCode.error.internalServerError).json(response);
    }
}

exports.index = (req, res) => {
    return res.sendFile('/home/sachinsuthariya/Videos/project/nodesetup/templates/index.html');
}

exports.login = (req, res) => {
    console.log("req body", req.body);
}