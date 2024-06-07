const express = require('express');
const router = express.Router();

// Define a route for the home page
router.get('/address', (req, res) => {
    res.render('index', { title: "Address and Delivery Point Finder" });
});

router.get('/fav', (req, res) => {
    res.render('fav&cart', { title: "shop app" });
});

// Define a route for the 404 page
router.get('*', (req, res) => {
    res.render('404', { title: "Error not found 404 I'm a teapot 418" });
});

module.exports = router;
