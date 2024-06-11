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
                    class: "Latest_Products",
                    title: 'Latest Products',
                    products: latestProducts
                },
                popular: {
                    class: "Most_Popular",
                    title: 'Most Popular',
                    products: popularProducts
                },
                random: {
                    class: "May_Interest_You",
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

router.get('/product/:productId', async (req, res) => {
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
        allImg = await axios.get(getImagesUrl, {
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
                quantityStock: product[0].quantity_stocked
            },
            slogan: "Your Trusted Tech Partner",

        };
        res.render('base', {data: data});
    } catch (error) {
        console.error('Internal server error:', error);
        res.status(500).render('500', {title: "Internal Server Error"});
    }
});

router.get('/cart', isAuthenticated, async (req, res) => {
    // Read the cart cookie
    const cartCookie = req.cookies.cart;
    const token = process.env.WEB_TOKEN;
    // Initialize a map to store the total quantity and price for each unique item
    const cartItemsMap = new Map();
    let imagePaths;

    // Iterate through the items in the cart and aggregate quantities and prices
    if (cartCookie) {
        cartCookie.forEach(item => {
            const {itemId, quantity, itemPrice} = item;
            if (cartItemsMap.has(itemId)) {
                // If item already exists in map, update its quantity and total price
                const existingItem = cartItemsMap.get(itemId);
                existingItem.quantity += quantity;
                existingItem.totalPrice += quantity * itemPrice;
            } else {
                // If item doesn't exist in map, add it
                cartItemsMap.set(itemId, {itemId, quantity, totalPrice: quantity * itemPrice});
            }
        });
    }

    // Convert the map to an array of objects
    const cartItemsArray = Array.from(cartItemsMap.values());

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
    let resultArray = [];// Initialize an empty array to store the results
    try {

        for (const cartItem of cartItemsArray) {
            const productId = cartItem.itemId;

            const product = await getProductById(productId);

            if (!product) {
                console.error(`failed to get item ${productId}`);
                continue; // Skip to the next iteration
            }

            const getImagesUrl = `http://localhost:3001/v1/images/product/${productId}`;
            const allImg = await axios.get(getImagesUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            product.img = allImg.data[0].image_path;
            const typeId = product.type_id;
            const brandId = product.brand_id;

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
            imagePaths = getImagePaths(allImg);
            const miscellaneous = [];

            for (let key in product) {
                if (product.hasOwnProperty(key) && key !== 'created_at' && key !== 'updated_at' && key !== 'type_id' && key !== 'product_id' && key !== 'brand_id' && key !== 'image' && key !== 'description' && key !== 'price' && key !== 'sales' && key !== 'name' && product[key] !== null) {
                    let content = product[key];
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

            // Push the product details along with quantity ordered and image paths into the result array
            resultArray.push({
                product,
                quantityOrdered: cartItem.quantity, // Include the quantity ordered
                imagePaths: imagePaths, // Include the image paths
                miscellaneous
            });
        }

        // Now resultArray contains the results of each iteration
    } catch (error) {
        console.error('Error occurred:', error);
    }


    // Function to calculate the subtotal of the cart
    function calculateSubtotal(cartItems) {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.totalPrice;
        });
        return subtotal;
    }


    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: 'cart',
        slogan: "Your Trusted Tech Partner",
        templateData: {
            cart: {
                products: {resultArray},
                subtotal: calculateSubtotal(cartItemsArray) // Subtotal of the cart
            }
        }
    };
    res.render('base', {data: data});
})

router.get('/order', isAuthenticated, (req, res) => {
    // Retrieve the data from the request body
    const orderData = req.body;

    // Log the data to the console
    console.log(orderData);


    const data = {
        title: "Products - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "order",
        templateData: orderData,
        slogan: "Your Trusted Tech Partner",

    };
    res.render('base', {data: data});
    // Other logic related to processing the order
});

router.post('/cartAdd', isAuthenticated, (req, res) => {
    // Extract data from request body
    const itemId = req.body.itemId;
    const itemPrice = req.body.itemPrice;
    const quantity = req.body.quantity;

    // If the user is authenticated, store the cart in the session
    if (req.isAuthenticated) {
        if (!req.session.cart) {
            req.session.cart = [];
        }
        req.session.cart.push({itemId, itemPrice, quantity});
    } else { // If the user is not authenticated, store the cart in a cookie
        let cart = req.cookies.cart || [];
        cart.push({itemId, itemPrice, quantity});
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
        res.cookie('cart', cart, {maxAge: oneWeekInMilliseconds, httpOnly: true}); // Set cookie expiry time
        res.send({status: 'success'});
    }


})

router.get('/checkout', isAuthenticated, (req, res) => {

    // If the user is authenticated, retrieve the cart from the session
    if (req.isAuthenticated) {
        const cart = req.session.cart || [];
        console.log('Cart (from session):', cart);
    } else { // If the user is not authenticated, retrieve the cart from the cookie
        const cart = req.cookies.cart || [];
        console.log('Cart (from cookie):', cart);
    }
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
            const {lon: pointLon, lat: pointLat} = point;
            // Calculate distance (you can use any suitable formula here)
            const distance = Math.sqrt(Math.pow(lon - pointLon, 2) + Math.pow(lat - pointLat, 2));
            return {...point, distance};
        });

        // Sort the delivery points by distance
        distances.sort((a, b) => a.distance - b.distance);

        // Get the closest delivery point
        const closestDeliveryPoint = distances[0];

        // Make axios request to get address for the closest delivery point
        const addressResponse = await axios.get(`http://localhost:4000/api/getAddress/${closestDeliveryPoint.latitude},${closestDeliveryPoint.longitude}`);

        // Extract address from response
        const address = addressResponse.data[0].address;

        postData = ({closestDeliveryPoint, address});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }

    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "shipping",
        templateData: {
            nearbyPost: postData
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
});
router.get('/about-shipping', (req, res) => {
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "about-shipping",
        templateData: {
            nearbyPost: {}
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
