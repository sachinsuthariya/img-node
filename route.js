const express = require("express");
const app = express();
//import all modules
const userRoutes = require("./modules/user/userRoute");


// use all modules routes
app.use("/user", userRoutes);

module.exports = app;