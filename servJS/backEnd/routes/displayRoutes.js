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
        templateData: {},
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
});

router.get('/products/:productId', async (req, res) => {
    const productId = req.params.productId;
    const token = process.env.WEB_TOKEN;
    // Validate the productId
    if (isNaN(productId)) {
        return res.status(400).render('400', {title: "Invalid Product ID"});
    }
    function getImagePaths(allImg) {
        // Get the length of the allImg.data array
        const length = allImg.data.length;

        // Create an array to store the image paths
        const imagePaths = [];

        // Loop through the allImg.data array and push the image paths to the imagePaths array
        for (let i = 0; i < length; i++) {
            imagePaths.push(allImg.data[i].image_path);
        }

        // Add "/static/img/image-not-found.webp" to the array until it has 3 elements
        while (imagePaths.length < 3) {
            imagePaths.push("/static/img/image-not-found.webp");
        }

        // Return the array of image paths
        return imagePaths;
    }
    try {
        const product = await getProductById(productId);

        if (!product) {
            return res.status(404).render('404', {title: "Product Not Found"});
        }

            const getImagesUrl = `http://localhost:3001/v1/images/product/${productId}`;
            allImg = await axios.get(getImagesUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            product.img = allImg.data[0].image_path;
            const typeId = product[0].type_id;
            const brandId = product[0].brand_id;

            // Fetch type name
            if (typeId) {
                const typeUrl = `http://localhost:3001/v1/types/${typeId}`;
                const typeResponse = await axios.get(typeUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.type = typeResponse.data[0].name;
            }
            // Fetch brand name
            if (brandId) {
                const brandUrl = `http://localhost:3001/v1/brands/${brandId}`;
                const brandResponse = await axios.get(brandUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                product.brand = brandResponse.data[0].name;
            }
        const imagePaths = getImagePaths(allImg);
        const miscellaneous = [];

        for (let key in product[0]) {
            if (product[0].hasOwnProperty(key) && key !== 'created_at' && key !== 'updated_at' && key !== 'type_id' && key !== 'product_id' && key !== 'brand_id' && key !== 'image' && key !== 'description' && key !== 'price' && key !== 'sales' && key !== 'name' && product[0][key] !== null) {
                let content = product[0][key];
                if (key === 'quantity_stocked') {
                    if (content === "0" || content === null || content === undefined) {
                        key = "Availability"
                        content = 'Not available';
                    } else {
                        content = `Only ${content} left. Order now!`;
                    }
                }
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // Capitalize first letter // Replace underscores with spaces
                miscellaneous.push({
                    name: formattedKey,
                    content: content
                });
            }
        }

        const data = {
            title: "Products - TakeAByte",
            isAuthenticated: req.isAuthenticated,
            template: "product",
            templateData: {
                "navData": [
                    {
                        "link": `/category/${product.type}`,
                        "className": "previous",
                        "title": product.type
                    },
                    {
                        "className": "current",
                        "title": product[0].name
                    }
                ],
                "product": {
                    "images": imagePaths,
                    "name": product[0].name,
                    "description": product[0].description,
                    "price": `${product[0].price} €`,
                    "colors": [
                        "css-color-name"
                    ],
                    "brand": product.brand,
                    "miscellaneous": miscellaneous
                },
                quantityStock :product[0].quantity_stocked
            },
            slogan: "Your Trusted Tech Partner",

        };
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

router.get('/about-shipping',(req, res) => {
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
