const express = require('express');
const axios = require('axios');
const {isAuthenticated} = require("../middleware/auth");
const {
    fetchLatestProducts,
    fetchPopularProducts,
    fetchRandomCategoryProducts,
    getProductById
} = require("../controllers/productsController");
const router = express.Router();

// Define a route for the home page
router.get('/address', (req, res) => {
    res.render('index', {title: "Address and Delivery Point Finder"});
});

router.get('/fav', (req, res) => {
    res.render('fav&cart', {title: "shop app"});
});

router.get('/home', isAuthenticated, async (req, res) => {
    try {
        // Call functions to fetch latest, popular, and random products
        const latestProducts = await fetchLatestProducts();
        const popularProducts = await fetchPopularProducts();
        const randomCategoryProducts = await fetchRandomCategoryProducts();

        // Construct the data object with the fetched products
        const data = {
            title: "Home - TakeAByte",
            isAuthenticated: req.isAuthenticated,
            template: "landing",
            templateData: {
                banner: {
                    img: "banner.jpg",
                    title: "Computer Components",
                    text: "All you need to build or power up your computer or even set up your own home lab.",
                    link: "/type/Computer Components",
                    btnContent: "Discover our collection"
                },
                latest: {
                    title: 'Latest Products',
                    products: latestProducts
                },
                popular: {
                    title: 'Most Popular',
                    products: popularProducts
                },
                random: {
                    title: 'May interest you',
                    products: randomCategoryProducts
                },
            },
            slogan: "Your Trusted Tech Partner"
        };

        // Render the page with the populated data
        res.render('base', {data: data});
    } catch (error) {
        console.error("Error fetching products:", error);
        // Handle errors appropriately
        res.status(500).send("Internal Server Error");
    }
});

router.get('/login', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "login",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
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
    res.render('base', {data: data});
});

router.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;

    // Validate the productId
    if (isNaN(productId)) {
        return res.status(400).render('400', {title: "Invalid Product ID"});
    }

    try {
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).render('404', {title: "Product Not Found"});
        }

        const data = {
            title: `${product.name} - TakeAByte`,
            isAuthenticated: req.isAuthenticated,
            template: "product-detail",
            templateData: {product},
            slogan: "Your Trusted Tech Partner"
        };

        res.render('base', {data});
        res.render('base', {data: data});
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).render('500', {title: "Internal Server Error"});
    }
});

router.get('/cart', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "register",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/checkout', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "order",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/order-confirmation', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "register",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/profile', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "register",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/contact-us', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "contact-us",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/about', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "about",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/privacy-policy', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "privacy-policy",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/terms-conditions', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "terms-conditions",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/shipping', isAuthenticated, async (req, res) => {
    const lon = req.body.longitude;
    const lat = req.body.latitude;
    let postData
    try {
        // Make axios request to get close delivery points
        const deliveryPointsResponse = await axios.get(`http://localhost:4000/api/getCloseDeliveryPoint/5000/${lat}/${lon}`);
        // Extract delivery points from response
        const deliveryPoints = deliveryPointsResponse.data;
        // Calculate the distances of each delivery point from the given coordinates
        const distances = deliveryPoints.deliveryPoints.map(point => {
            const { lon: pointLon, lat: pointLat } = point;
            // Calculate distance (you can use any suitable formula here)
            const distance = Math.sqrt(Math.pow(lon - pointLon, 2) + Math.pow(lat - pointLat, 2));
            return { ...point, distance };
        });

        // Sort the delivery points by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Get the closest delivery point
        const closestDeliveryPoint = distances[0];

        // Make axios request to get address for the closest delivery point
        const addressResponse = await axios.get(`http://localhost:4000/api/getAddress/${closestDeliveryPoint.latitude},${closestDeliveryPoint.longitude}`);

        // Extract address from response
        const address = addressResponse.data[0].address;

        postData =({ closestDeliveryPoint, address });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "shipping",
        templateData: {
            nearbyPost : postData
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
});

router.get('/about_shiping',(req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "about-shipping",
        templateData: {
            nearbyPost :{}
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})



router.get('/register', isAuthenticated, (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "register",
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})





// Define a route for the 404 page
router.get('*', (req, res) => {
    res.render('404', {title: "Error not found 404 I'm a teapot 418"});
});

module.exports = router;
