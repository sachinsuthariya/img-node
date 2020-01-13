const express = require('express');
const middleware = require('../../helper/middleware');
const router = express.Router();

const galleryController = require('./galleryController');

//to validate request
router.use((req, res, next) => {
    if (req.method !== 'OPTIONS') {
        let routePath = req.path;
        req.validations = validationRules.get(routePath);
        middleware.reqValidator(req, res, next);
    } else {
        next();
    }
});

router.use([(req, res, next) => {
    // Add Urls to by pass auth protection
    req.byPassRoute = [];
    next();
}, middleware.isAuthenticate]);

// routes
router.post('/upload', galleryController.uploadImage);


module.exports = router;