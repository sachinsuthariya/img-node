const {
    galleryModel
} = require('../../helper/models');
const helper = require('../../helper/commonUtils');

exports.uploadImage = async (req, res) => {
    await this.helper.upload(req, res, (err, result) => {
        if (err) {
            const response = {
                success: false,
                err: err.message,
                message: req.t("FILE_UPLOAD_FAIL")
            };
            return res.status(resStatusCode.error.internalServerError).json(response);
        }
        if (result) {
            console.log("result of file uplode", result);
        }
    })
}