const express = require('express');
const getProductById = require("../controllers/productsController");
const {isAuthenticated} = require("../middleware/auth");
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

router.get('/products', (req, res) => {
    const data = {
        title: "Products - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "product-list",
        templateData: {
            products: [
                // Array of product objects with details like id, name, price, image, etc.
            ]
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', { data: data });
});

router.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;

    // Validate the productId
    if (isNaN(productId)) {
        return res.status(400).render('400', { title: "Invalid Product ID" });
    }

    try {
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).render('404', { title: "Product Not Found" });
        }

        const data = {
            title: `${product.name} - TakeAByte`,
            isAuthenticated: req.isAuthenticated,
            template: "product-detail",
            templateData: { product },
            slogan: "Your Trusted Tech Partner"
        };

        res.render('base', { data });
        res.render('base', { data: data });
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).render('500', { title: "Internal Server Error" });
    }
});

router.get('/cart', isAuthenticated, (req, res) =>{
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
router.get('/checkout', isAuthenticated, (req, res) =>{
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
router.get('/order-confirmation', isAuthenticated, (req, res) =>{
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
router.get('/profile', isAuthenticated, (req, res) =>{
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
router.get('/faq', isAuthenticated, (req, res) =>{
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
router.get('/about', isAuthenticated, (req, res) =>{
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
