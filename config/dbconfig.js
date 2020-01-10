// imports
const mongoose = require("mongoose");

const URL = process.env.DB_URL;

module.exports = {
    connection: mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        .then(() => {
            console.log("Conneted!");
        })
        .catch(err => {
            console.log("Error in Database connetion::", err);
            process.exit();
        })
};