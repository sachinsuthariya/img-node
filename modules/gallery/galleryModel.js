const mongoose = require('mongoose');
const helper = require('../../helper/commonUtils');
const validator = require('../../helper/validation');
const l10n = require('jm-ez-l10n');
const {
    status
} = require('../../helper/constant');

const gallerySchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: [true, l10n.t("REQ_FILE")],
        trim: true,
        lowercase: true
    },
    filePath: {
        type: String,
        required: [true, l10n.t("REQ_FILEPATH")],
        trim: true
    },
    category: {
        type: String,
        required: [true, l10n.t("REQ_CATEGORY")]
    },
    subCategory: {
        type: String,
        required: [true, l10n.t("REQ_SUBCATEGORY")]
    },
    status: {
        type: String,
        minlength: 5,
        maxlength: 10,
        default: status.inActive
    },
    // time: new Date()
});


module.exports = mongoose.model('gallery', gallerySchema);