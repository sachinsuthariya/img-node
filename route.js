const express = require("express");
const app = express();
//import all modules
const userRoutes = require("./modules/user/userRoute");
const galleryRoute = require("./modules/gallery/galleryRoute");

// use all modules routes
app.use("/user", userRoutes);
app.use("/gallery", galleryRoute);

module.exports = app;