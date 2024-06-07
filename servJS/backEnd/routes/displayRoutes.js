const express = require('express');
const router = express.Router();

// Define a route for the home page
router.get('/address', (req, res) => {
    res.render('index', { title: "Address and Delivery Point Finder" });
});

router.get('/fav', (req, res) => {
    res.render('fav&cart', { title: "shop app" });
});

router.get('/home',isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "landing",
        templateData :{
            banner: { /* banner data */ },
            latest: { /* latest products data */ },
            popular: { /* popular products data */ },
            random: { /* random category products data */ }
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', { data: data });
});

router.get('/login',isAuthenticated,(req,res) =>{
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "login",
        templateData :{
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', { data: data });
})

router.get('/register', isAuthenticated, (req, res) =>{
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "register",
        templateData :{
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', { data: data });
})


// Define a route for the 404 page
router.get('*', (req, res) => {
    res.render('404', { title: "Error not found 404 I'm a teapot 418" });
});

module.exports = router;
