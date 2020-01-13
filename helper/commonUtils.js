const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
const path = require("path");
const EmailTemplate = require("email-templates-v2").EmailTemplate;
// const fs = require("fs");
const logger = require("./logger");
const multer = require('multer');

// variables
const saltRound = 10;

const helper = {};

// mail transporter 
const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
    }
});

// file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '../public/uploads/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
});

const field = "file";
helper.upload = multer({
    storage: storage
}).single(field);
// .array("imgUploader", 3); //Field name and max count

// end image upload


// send mail
helper.sendMail = (to, templateName, data, isBcc) => {
    try {
        const templateDir = path.join(__dirname, '../templates', templateName);
        const template = new EmailTemplate(templateDir)
        template.render(data, (err, result) => {
            const {
                subject,
                text,
                html
            } = result;

            let mailOption = {
                from: process.env.DEFAULT_FROM,
                to,
                replyTo: process.env.DEFAULT_REPLY_TO,
                subject,
                text,
                html
            };

            if (isBcc) {
                mailOption.bcc = process.env.BCC;
            }

            transporter.sendMail(mailOption, (err, info) => {
                if (err) {

                    return logger.error(err.message);
                }
                return info;
            });
        });
    } catch (err) {
        return logger.error(err.message);
    }
};

helper.genHash = (value) => {
    return bcrypt.hash(value, saltRound);
};


helper.decrypt = (value, hash) => {
    return bcrypt.compare(value, hash);
};

// helper.uploadFile = (field) => {

// }

module.exports = helper;