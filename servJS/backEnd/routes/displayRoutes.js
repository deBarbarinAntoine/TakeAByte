const express = require('express');
const axios = require('axios');
const {isAuthenticated, requireAuth} = require("../middleware/auth");
const {
    fetchLatestProducts,
    fetchPopularProducts,
    fetchRandomCategoryProducts,
    getProductById, getProductByTypeId
} = require("../controllers/productsController");
const {getTypeNameById, getAllType} = require("../controllers/typeController");
const {getBrandByIds, getAllBrands} = require("../controllers/brandController");
const {getSearchData} = require("../controllers/searchController");
const {addToLikes, takeOffLikes} = require("../controllers/likeContoller");
const {
    getUserInfoById,
    getUserIdFromToken,
    updateUserData,
    updateUserPassword
} = require("../controllers/userController");
const {getUserFavByUserId} = require("../controllers/favController");
const {getUserOrdersByUserId} = require("../controllers/orderController");
const router = express.Router();

router.get('/home', isAuthenticated, async (req, res) => {
    try {
        // Call functions to fetch latest, popular, and random products
        const latestProducts = await fetchLatestProducts();
        const popularProducts = await fetchPopularProducts();
        const randomCategoryProducts = await fetchRandomCategoryProducts();
        const type_list = await getAllType();
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
                    link: "/category/11",
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
            slogan: "Your Trusted Tech Partner",
            categories: type_list
        };

        // Render the page with the populated data
        res.render('base', {data: data});
    } catch (error) {
        console.error("Error fetching products:", error);
        // Handle errors appropriately
        res.status(500).send("Internal Server Error");
    }
});

router.get('/login', isAuthenticated, async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "login",
        templateData: {},
        slogan: "Your Trusted Tech Partner",
        categories: type_list
    };
    res.render('base', {data: data});
})

router.get('/product/:productId', isAuthenticated, async (req, res) => {
    const productId = req.params.productId;
    const token = process.env.WEB_TOKEN;
    const userToken = req.cookies.token;
    const userFav = req.cookies.fav;
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
        let isFav
        if (userToken) {
            try {
                const userId = await getUserIdFromToken(userToken);
                const userLikedItems = await getUserFavByUserId(userId);

                // Iterate through userLikedItems and check for matching product IDs
                const likedProductIds = userLikedItems.map(item => item.product_id); // Extract product IDs
                isFav = likedProductIds.includes(productId); // Check if current product ID is liked

            } catch (err) {

            }
        }else if (userFav){
            const userFavArray = JSON.parse(userFav);
            const likedProductIds = userFavArray.map(item=>item.productId);
            isFav = likedProductIds.includes(productId)
        }


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
        const type_list = await getAllType();
        const productType = product.type;

        const matchingType = type_list.find(type => type.name === productType);
        let type_id;
        if (matchingType) {
            type_id = matchingType.type_id;
        } else {
            console.log('Type not found');
        }
        let saleData
        try {
            const saleUrl = `http://localhost:3001/v1/sales/product/${productId}`
            saleData = await axios.get(saleUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (err) {
            console.log("error retrieving sales data:", err)
        }
        const data = {
            title: "Products - TakeAByte",
            isAuthenticated: req.isAuthenticated,
            template: "product",
            templateData: {
                "navData": [
                    {
                        "link": `/category/${type_id}`,
                        "className": "previous",
                        "title": product.type
                    },
                    {
                        "className": "current",
                        "title": product[0].name
                    }
                ],
                "product": {
                    "isFavorite" : isFav,
                    "id": productId,
                    "images": imagePaths,
                    "name": product[0].name,
                    "description": product[0].description,
                    "price": `${product[0].price} €`,
                    "colors": [
                        "css-color-name"
                    ],
                    "brand": product.brand,
                    "miscellaneous": miscellaneous,
                    "promotion": saleData.data.sales[0].length > 0 ?{
                        "reduction": saleData.data.sales[0][0].reduction_percentage,
                        "end_at": saleData.data.sales[0][0].end_date
                    }: {
                        "reduction": 0,
                        "end_at": "none",
                    }
                },
                quantityStock: product[0].quantity_stocked
            },
            slogan: "Your Trusted Tech Partner",
            categories: type_list

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
            product[0].price = cartItem.totalPrice / cartItem.quantity
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
            let item_Quantity;

            try {
                const item = await getProductById(productId);
                item_Quantity = item[0].quantity_stocked;

                // Check if cartItem.quantity is less than or equal to item_Quantity
                if (cartItem.quantity <= item_Quantity) {
                    // If yes, push cartItem with its details
                    resultArray.push({
                        product,
                        quantityOrdered: cartItem.quantity,
                        imagePaths: imagePaths,
                        miscellaneous
                    });
                } else {
                    const itemToUpdate = cartCookie.find(item => item.itemId === productId);

                    if (itemToUpdate) {
                        // Update the quantity of the found item
                        itemToUpdate.quantity = item_Quantity;

                        // Set the updated cookie
                        res.cookie('cart', cartCookie, {maxAge: 900000, httpOnly: true}); // Example options

                        // Optionally, send a response indicating success
                        res.send('Cart updated successfully');
                    } else {
                        console.log(`Item with itemId ${productId} not found in the cart.`);
                    }
                    // If no, push item_Quantity instead of cartItem.quantity
                    resultArray.push({
                        product,
                        quantityOrdered: item_Quantity, // Push item_Quantity instead
                        imagePaths: imagePaths,
                        miscellaneous
                    });
                }
            } catch (err) {
                console.log("Failed to get item quantity available", err);
            }
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

    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: 'cart',
        slogan: "Your Trusted Tech Partner",
        categories: type_list,
        templateData: {
            cart: {
                products: {resultArray},
                subtotal: calculateSubtotal(cartItemsArray) // Subtotal of the cart
            }
        }
    };
    res.render('base', {data: data});
})

router.get('/order/address', isAuthenticated, async (req, res) => {
    // Read the cart cookie
    const cartCookie = req.cookies.cart;
    const token = process.env.WEB_TOKEN;
    const userToken = req.cookies.token;
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
            product[0].price = cartItem.totalPrice / cartItem.quantity
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

    let userData;
    if (req.isAuthenticated) {
        try {
            const userId = await getUserIdFromToken(userToken)
            userData = await getUserInfoById(userId.user_id, token)
            const type_list = await getAllType();
            const data = {
                title: "Home - TakeAByte",
                isAuthenticated: req.isAuthenticated,
                template: 'order',
                slogan: "Your Trusted Tech Partner",
                categories: type_list,
                templateData: {
                    client: {
                        email: userData[0].email,
                        name: userData[0].name,
                        lastName: userData[0].lastName,
                        address: {
                            street: userData[0].street_name,
                            complement: userData[0].address_complements,
                            city: userData[0].city,
                            zip: userData[0].zip_code,
                            province: userData[0].province,
                            country: userData[0].country
                        },
                        shippingMethod: "Standard Shipping - FREE"
                    },
                    page: 'address',
                    order: {
                        products: resultArray,
                        subtotal: calculateSubtotal(cartItemsArray), // Subtotal of the cart
                        shippingCost: "FREE for a limited time"
                    }
                }
            };
            res.render('base', {data: data});
        } catch (err) {
            console.error("problem getting userid or userdata", err)
        }
    }else{
        const type_list = await getAllType();
        const data = {
            title: "Home - TakeAByte",
            isAuthenticated: req.isAuthenticated,
            template: 'order',
            slogan: "Your Trusted Tech Partner",
            categories: type_list,
            templateData: {
                client: {
                    email: "",
                    name: "",
                    lastName: "",
                    address: {
                        street: "",
                        complement: "",
                        city: "",
                        zip: "",
                        province: "",
                        country: ""
                    },
                    shippingMethod: "Standard Shipping - FREE"
                },
                page: 'address',
                order: {
                    products: resultArray,
                    subtotal: calculateSubtotal(cartItemsArray), // Subtotal of the cart
                    shippingCost: "FREE for a limited time"
                }
            }
        };
        res.render('base', {data: data});
    }
});

router.post('/cartAdd', isAuthenticated, (req, res) => {
    // Extract data from request body
    const itemId = req.body.itemId;
    const itemPrice = req.body.itemPrice;
    const quantity = req.body.quantity;

    let cart = req.cookies.cart || [];
    cart.push({itemId, itemPrice, quantity});
    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    res.cookie('cart', cart, {maxAge: oneWeekInMilliseconds, httpOnly: true}); // Set cookie expiry time
    res.send({status: 'success'});

})

router.delete('/cartDelete', isAuthenticated, (req, res) => {
    // Extract data from request body
    const itemIdToDelete = req.body.itemId;

    // Retrieve cart from cookies or initialize as an empty array
    let cart = req.cookies.cart || [];

    // Find index of item to delete in the cart array
    const indexToDelete = cart.findIndex(item => item.itemId === itemIdToDelete);

    if (indexToDelete !== -1) {
        // Remove item from cart array
        cart.splice(indexToDelete, 1);

        // Set cookie with updated cart and expiry time
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
        res.cookie('cart', cart, { maxAge: oneWeekInMilliseconds, httpOnly: true });

        // Respond with success status
        res.send({ status: 'success' });
    } else {
        // If item with itemIdToDelete is not found in cart
        console.log('Item not found in cart');
    }
});


router.post('/favAdd', isAuthenticated, async (req, res) => {
    // Extract productId from request body
    const {productId} = req.body;
    const token = req.cookies.token;

    let fav = req.cookies.fav ? JSON.parse(req.cookies.fav) : [];

    // Check if the productId already exists
    const productIndex = fav.findIndex(item => item.productId === productId);
    if (productIndex !== -1) {
        // If it exists, remove it from the array
        fav.splice(productIndex, 1);
    } else {
        // If it doesn't exist, add it to the array
        fav.push({productId});
    }

    const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    res.cookie('fav', JSON.stringify(fav), {maxAge: oneWeekInMilliseconds, httpOnly: true}); // Set cookie expiry time
    res.send({status: 'success'});

    try {
        if (productIndex === -1) {
            await addToLikes(productId, token);
        } else {
            await takeOffLikes(productId, token);
        }
    } catch (error) {
        console.error("Error updating likes:", error);
    }
});

router.post('/checkout', isAuthenticated, async (req, res) => {
    const {cardNumber, expiration, cvv, amount} = req.body;
    const api_key = process.env.ALLAN_TOKEN; // Make sure to load your environment variables

// Trim spaces from cardNumber
    const trimmedCardNumber = cardNumber.replace(/\s+/g, '');

// Function to validate and format expiration date to MM/YY
    const formatExpirationDate = (date) => {
        const datePattern = /^(0[1-9]|1[0-2])\/(\d{2})$/; // Matches MM/YY format
        const match = date.match(datePattern);

        if (match) {
            return date; // Already in MM/YY format
        } else {
            throw new Error('Invalid expiration date format. Please use MM/YY.');
        }
    };

// Function to validate CVV
    const validateCVV = (cvv) => {
        const cvvPattern = /^\d{3}$/; // Matches exactly 3 digits
        if (cvv.match(cvvPattern)) {
            return cvv; // Valid CVV
        } else {
            throw new Error('Invalid CVV. It should be exactly 3 digits.');
        }
    };

// Function to validate and format amount to 0.00 format
    const formatAmount = (amount) => {
        const amountPattern = /^\d+(\.\d{2})?$/; // Matches numbers with optional two decimal places
        const match = amount.match(amountPattern);

        if (match) {
            return parseFloat(amount).toFixed(2); // Format to 0.00 if not already
        } else {
            // If amount doesn't match, attempt to round to two decimal places
            const parsedAmount = parseFloat(amount);
            if (!isNaN(parsedAmount)) {
                return parsedAmount.toFixed(2);
            } else {
                throw new Error('Invalid amount format. It should be a number.');
            }
        }
    };

    try {
        const response = await axios.post('https://challenge-js.ynovaix.com/payment', {
                card: {
                    number: trimmedCardNumber,
                    expiration_date: formatExpirationDate(expiration),
                    cvc: validateCVV(cvv)
                },
                payment_intent: {
                    price: formatAmount(amount)
                }
            },
            {
                headers: {
                    Authorization: `${api_key}`,
                    'Content-Type': 'application/json'
                }
            });

        res.status(200).json({success: true, data: response.data});
    } catch (err) {
        if ((err.response.data.message) === "La carte est expirée.") {
            res.status(500).json({success: false, error: err.response.data.message});
        } else {
            res.status(500).json({success: false, error: err.response.data.message});
        }
    }
});

router.get('/paymentOk', isAuthenticated, async (req, res) => {
    const cartCookie = req.cookies.cart;
    const token = process.env.WEB_TOKEN;
    const userToken = req.cookies.token;
    let userId = null;
    try {
        userId = await getUserIdFromToken(userToken);
        if (!userId) {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        console.error('Error fetching user info:', err);
        return res.status(500).send('Internal Server Error');
    }

    const createOrderUrl = `http://localhost:3001/v1/orders/${userId.user_id}`;
    const cartItemsMap = new Map();
    let orderId;

    // Aggregate quantities and prices
    if (cartCookie) {
        cartCookie.forEach(item => {
            const {itemId, quantity, itemPrice} = item;
            if (cartItemsMap.has(itemId)) {
                const existingItem = cartItemsMap.get(itemId);
                existingItem.quantity += quantity;
                existingItem.totalPrice += quantity * itemPrice;
            } else {
                cartItemsMap.set(itemId, {itemId, quantity, totalPrice: quantity * itemPrice});
            }
        });
    }

    const cartItemsArray = Array.from(cartItemsMap.values());

    function getImagePaths(allImg) {
        const imagePaths = allImg.data.map(img => img.image_path);
        while (imagePaths.length < 3) {
            imagePaths.push("/static/img/image-not-found.webp");
        }
        return imagePaths;
    }

    async function fetchProductDetails(productId) {
        const product = await getProductById(productId);
        if (!product) throw new Error(`Failed to get item ${productId}`);

        const getImagesUrl = `http://localhost:3001/v1/images/product/${productId}`;
        const allImg = await axios.get(getImagesUrl, {headers: {Authorization: `Bearer ${token}`}});
        product.img = allImg.data[0].image_path;

        if (product.type_id) {
            const typeUrl = `http://localhost:3001/v1/types/${product.type_id}`;
            const typeResponse = await axios.get(typeUrl, {headers: {Authorization: `Bearer ${token}`}});
            product.type = typeResponse.data[0].name;
        }

        if (product.brand_id) {
            const brandUrl = `http://localhost:3001/v1/brands/${product.brand_id}`;
            const brandResponse = await axios.get(brandUrl, {headers: {Authorization: `Bearer ${token}`}});
            product.brand = brandResponse.data[0].name;
        }

        const imagePaths = getImagePaths(allImg);
        const miscellaneous = Object.keys(product)
            .filter(key => product[key] && !['created_at', 'updated_at', 'type_id', 'product_id', 'brand_id', 'image', 'description', 'price', 'sales', 'name'].includes(key))
            .map(key => ({
                name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                content: key === 'quantity_stocked' ? (product[key] ? `Only ${product[key]} left. Order now!` : 'Not available') : product[key]
            }));

        return {product, imagePaths, miscellaneous};
    }

    async function processCartItems(cartItems) {
        const resultArray = [];
        for (const cartItem of cartItems) {
            try {
                const productDetails = await fetchProductDetails(cartItem.itemId);
                resultArray.push({
                    ...productDetails,
                    quantityOrdered: cartItem.quantity,
                });
            } catch (error) {
                console.error(error.message);
            }
        }
        return resultArray;
    }

    function calculateSubtotal(cartItems) {
        return cartItems.reduce((subtotal, item) => subtotal + item.totalPrice, 0);
    }

    const formattedItems = cartItemsArray.map(item => ({

        product_id: item.itemId,
        quantity: item.quantity,
        price : item.totalPrice
    }));
    try {
        const response = await axios.post(createOrderUrl, {items: formattedItems}, {headers: {Authorization: `Bearer ${userToken}`}});
        orderId = response.data.order_id;
    } catch (error) {
        console.error('Error creating order:', error.message);
        return res.status(500).send('Internal Server Error');
    }

    for (const item of formattedItems) {
        const productId = item.product_id;
        const reduceStockUrl = `http://localhost:3001/v1/products/${productId}`;

        try {
            const response = await axios.put(reduceStockUrl, {
                quantity_stocked: item.quantity
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Successfully reduced stock for product ${productId}`, response.data);
        } catch (err) {
            console.error(`Failed to reduce stock for product ${productId}`, err);
        }
    }


    try {
        const resultArray = await processCartItems(cartItemsArray);
        const typeList = await getAllType();
        const data = {
            title: "Home - TakeAByte",
            isAuthenticated: req.isAuthenticated,
            template: 'order',
            slogan: "Your Trusted Tech Partner",
            categories: typeList,
            templateData: {
                client: {orderId},
                page: 'payment-confirmed',
                order: {
                    products: resultArray,
                    subtotal: calculateSubtotal(cartItemsArray),
                    shippingCost: "FREE for a limited time"
                }
            }
        };
        res.clearCookie('cart');
        res.render('base', {data});
    } catch (error) {
        console.error('Error processing cart items:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/contact-us', isAuthenticated, async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "contact-us",
        templateData: {},
        categories: type_list,
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/about', isAuthenticated, async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "about",
        templateData: {},
        categories: type_list,
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/privacy-policy', isAuthenticated, async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "privacy-policy",
        templateData: {},
        categories: type_list,
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/terms-conditions', isAuthenticated, async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "terms-conditions",
        templateData: {},
        categories: type_list,
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/order/shipping/:encodedData', isAuthenticated, async (req, res) => {
    // Decode the encoded data from the URL path
    const decodedData = Buffer.from(req.params.encodedData, 'base64').toString('latin1');
    const {lon, lat, email, name, lastname, street, optional, city, zip, region, country} = JSON.parse(decodedData);
console.log(JSON.parse(decodedData))
    let postData;

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
        return; // Exit the route handler early if an error occurs
    }

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
            product[0].price = cartItem.totalPrice / cartItem.quantity

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

    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: 'order',
        categories: type_list,
        slogan: "Your Trusted Tech Partner",
        templateData: {
            client: {
                client: {email, name, lastname, street, optional, city, zip, region, country},
                nearestPost: {postData}
            },
            page: 'shipping',
            order: {
                products: resultArray,
                subtotal: calculateSubtotal(cartItemsArray), // Subtotal of the cart
                shippingCost: "FREE for a limited time"
            }
        }
    };
    res.render('base', {data: data});
});
router.get('/order/payment/:encodedData', isAuthenticated, async (req, res) => {
    const decodedData = Buffer.from(req.params.encodedData, 'base64').toString('latin1');
    const {contactEmail, shipToAddress, shippingMethod} = JSON.parse(decodedData);


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
            product[0].price = cartItem.totalPrice / cartItem.quantity
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

    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: 'order',
        categories: type_list,
        slogan: "Your Trusted Tech Partner",
        templateData: {
            client: {client: {contactEmail, shipToAddress, shippingMethod}},
            page: 'payment',
            order: {
                products: resultArray,
                subtotal: calculateSubtotal(cartItemsArray), // Subtotal of the cart
                shippingCost: "FREE for a limited time"
            }
        }
    };
    res.render('base', {data: data});
})
router.get('/about-shipping', async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "about-shipping",
        categories: type_list,
        templateData: {
            nearbyPost: {}
        },
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})
router.get('/register', isAuthenticated, async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "register",
        templateData: {},
        categories: type_list,
        slogan: "Your Trusted Tech Partner"
    };
    res.render('base', {data: data});
})

router.get('/category/:type_id', isAuthenticated, async (req, res) => {
    const type_id = req.params.type_id;
    const {brand, price_max, category} = req.query; // Destructure the filters from query parameters
    let type_name;
    let product_list;
    let brand_list;

    try {
        type_name = await getTypeNameById(type_id);
        product_list = await getProductByTypeId(type_id);
        for (const product of product_list) {
            const token = process.env.WEB_TOKEN;
            const saleUrl = `http://localhost:3001/v1/sales/product/${product.id}`
            const saleDetails =  await axios.get(saleUrl,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (saleDetails.data.sales[0].length > 0){
                product.price = product.price - (product.price * saleDetails.data.sales[0][0].reduction_percentage / 100)
                product.sales = saleDetails.data.sales[0][0].reduction_percentage
            }else{
                product.sales = "0"
            }
            }
        // Filter the product list based on the query parameters
        if (brand) {
            const brandsFilter = brand.split(',');
            product_list = product_list.filter(product => brandsFilter.includes(product.brand));
        }
        if (price_max) {
            product_list = product_list.filter(product => product.price <= parseFloat(price_max));
        }
        if (category) {
            const categoriesFilter = category.split(',');
            product_list = product_list.filter(product => categoriesFilter.includes(product.category));
        }

        const brandIds = product_list.map(product => product.brand);
        brand_list = await getBrandByIds(brandIds);

    } catch (err) {
        if (err === "ReferenceError: id is not defined") {
            console.log(err)
        } else {
            console.error('Error in router handler:', err);
            return res.status(500).send('Internal Server Error');
        }
    }

    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "category",
        categories: type_list,
        templateData: {
            "navData": [
                {
                    "link": `/category/${type_id}`,
                    "className": " current",
                    "title": type_name
                }
            ],
            "category": {
                "products": product_list
            },
            "filters": {
                "categories": null,
                "brands": brand_list
            }
        },
        slogan: "Your Trusted Tech Partner"
    };

    res.render('base', {data: data});
});

router.get('/search', isAuthenticated, async (req, res) => {
    let searchData
    const {brand, price_max, category} = req.query;
    const type_list = await getAllType();
    const full_brand_list = await getAllBrands()
    let brand_list
    try {
        searchData = await getSearchData(req.query.search, type_list, full_brand_list)
    } catch (err) {
        console.error('Error in router handler:', err);

    }
    if (searchData !== null && searchData !== undefined) {
    for (const product of searchData) {
        const token = process.env.WEB_TOKEN;
        const saleUrl = `http://localhost:3001/v1/sales/product/${product.id}`
        const saleDetails =  await axios.get(saleUrl,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (saleDetails.data.sales[0].length > 0){
            product.price = product.price - (product.price * saleDetails.data.sales[0][0].reduction_percentage / 100)
            product.sales = saleDetails.data.sales[0][0].reduction_percentage
        }else{
            product.sales = "0"
        }
    }
    if (brand) {
        const brandsFilter = brand.split(',');
        searchData = searchData.filter(product => brandsFilter.includes(product.brand));
    }
    if (price_max) {
        searchData = searchData.filter(product => product.price <= parseFloat(price_max));
    }
    if (category) {
        const categoriesFilter = category.split(',');
        searchData = searchData.filter(product => categoriesFilter.includes(product.category));
    }
    const brandIds = Array.isArray(searchData)
        ? searchData.map(product => product.brand)
        : [];

    brand_list = await getBrandByIds(brandIds);
    }else {
        searchData = "No data found for the searched product"
    }
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "search",
        templateData: {
            category: {
                products: searchData
            },
            filters: {
                "categories": null,
                "brands": brand_list
            }
        },
        slogan: "Your Trusted Tech Partner",
        categories: type_list,

    };
    res.render('base', {data: data});
})

router.get('/user', requireAuth, async (req, res) => {
    const token = req.cookies.token;
    let userInfo = null;
    let userFav = null;
    let userId = null;
    let userOrders = null;
    if (!token) {
        return res.status(401).send('Unauthorized: No token provided');
    }

    try {
        userId = await getUserIdFromToken(token);
        if (!userId) {
            return res.status(404).send('User not found');
        }
        userInfo = await getUserInfoById(userId.user_id, token);
        if (!userInfo) {
            return res.status(404).send('No info found for user')
        }
    } catch (err) {
        console.error('Error fetching user info:', err);
        return res.status(500).send('Internal Server Error');
    }

    try {
        userFav = await getUserFavByUserId(userId)
        if (!userFav) {
            return res.status(404).send('No fav found for this user')
        }
    } catch (err) {
        console.error(err, "failed to get user fav")
    }

    try{
        userOrders = await getUserOrdersByUserId(userId)
    }catch(err){
        console.log('error getting user orders',err)
    }
    try {
        const type_list = await getAllType();
        const data = {
            title: "Home - TakeAByte",
            isAuthenticated: req.isAuthenticated,
            template: "dashboard",
            templateData: {
                user: userInfo[0],
                favorites: {
                    products: userFav
                },
                purchases :userOrders
            },
            slogan: "Your Trusted Tech Partner",
            categories: type_list
        };

        res.render('base', {data: data});
    } catch (err) {
        console.error('Error fetching types:', err);
        return res.status(500).send('Internal Server Error');
    }
});
// Define a route for the 404 page

router.post('/update-cart', (req, res) => {
    const {itemId, quantity} = req.body;

    // Update cart logic here
    // Example: Update cart stored in cookies
    let cart = req.cookies.cart || [];
    const itemIndex = cart.findIndex(item => item.itemId === itemId);

    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
    }

    // Set updated cart back to cookies
    res.cookie('cart', cart, {maxAge: 900000, httpOnly: true});
    res.sendStatus(200);
});

router.post('/user/:user_id/update/address', async (req, res) => {
    const user_id = req.params;
    const form = req.body
    try {
        await updateUserData(user_id, form)

        res.redirect("/user")
    } catch (err) {
        console.error(err)

    }

})

router.post('/user/:user_id/update/password', async (req, res) => {
    const {user_id} = req.params;
    const {password, 'new-password': newPassword, 'confirm-password': confirmPassword} = req.body;

    // Basic validation
    if (!user_id || !password || !newPassword || !confirmPassword) {
        return res.status(400).json({error: 'All fields are required'});
    }

    // Additional validation if needed (e.g., password strength, format checks)

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        return res.status(400).json({error: 'New password and confirm password do not match'});
    }

    try {
        // Perform password update operation
        await updateUserPassword(user_id, password, newPassword, confirmPassword);

        // Password updated successfully
        return res.redirect('/user')

    } catch (error) {
        console.error('Error updating password:', error);
        return res.status(500).json({error: 'Failed to update password'});
    }
});

router.get('/purchase/:order_id', async (req,res) =>{
    const {order_id} = req.params;
    const userToken = req.cookies.token
    const userId = await getUserIdFromToken(userToken)
    let userOrders
    let productsInfo = [];
    let index;
    try {
        // Assuming getUserOrdersByUserId and getProductById are asynchronous functions returning promises

        // Fetch user orders by user ID
        userOrders = await getUserOrdersByUserId(userId);

        // Check if userOrders array is empty or undefined
        if (!userOrders || userOrders.length === 0) {
            return res.status(404).send('No order found for this user');
        }
        index = userOrders.findIndex(order => order.order_id === parseInt(order_id, 10));
        // Iterate over details of the first order (userOrders[0].details[0])
        for (const product of userOrders[index].details[0]) {

            // Fetch product information using product_id
            const productInfo = await getProductById(product.product_id);

            productInfo.quantity_brought = product.quantity;
            productInfo.price_when_bought = product.price_when_bought;
            // Append productInfo to productsInfo array

            productsInfo.push(productInfo);
        }

    } catch (err) {
        // Handle errors
        console.log('Error getting user orders', err);
    }
    const type_list = await getAllType();
    const data = {
        title: "Home - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "purchase",
        templateData: {
                purchase: {
                    id: userOrders[index].order_id,
                    status: userOrders[index].status,
                    expectedDate: "expected-delivery-date",
                    products: productsInfo,
                    subtotal:userOrders[index].full_price,
                    shippingFee: 0
                },
        },
        slogan: "Your Trusted Tech Partner",
        categories: type_list
    };
    res.render('base', {data: data});
})

router.get('*', async (req, res) => {
    const type_list = await getAllType();
    const data = {
        title: "Error 404 - TakeAByte",
        isAuthenticated: req.isAuthenticated,
        template: "404",
        templateData: {},
        categories: type_list,
        slogan: "Your Trusted Tech Partner"
    }
    res.render('base', {data: data});
});

module.exports = router;
