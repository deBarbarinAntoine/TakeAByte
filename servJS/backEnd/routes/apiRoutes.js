const express = require('express');
const router = express.Router();

const { getAddressSuggestions } = require('../controllers/addressController');
const { getCloseDeliveryPoint } = require('../controllers/deliveryPointController');
const { toggleFavoriteItem, toggleCartItem } = require('../controllers/itemController');
const {checkUserLogs, logoutUser, registerUser} = require("../controllers/authController");
const {requireAuth} = require ("../middleware/auth")

// Define a route to get address suggestions
router.get('/getAddress/:address', getAddressSuggestions);

// Define a route to get close delivery points
router.get('/getCloseDeliveryPoint/:rayon/:latitude/:longitude', getCloseDeliveryPoint);

// Route to set/unset a favorite item
router.get('/setFav/:id', toggleFavoriteItem);

// Route to add/remove an item to/from the cart
router.get('/addToCart/:id', toggleCartItem);

// Route to log user
router.post('/login', checkUserLogs);

// Route to log out user
router.get('/logoutUser', requireAuth,logoutUser)

// Route to register user
router.post('/registerUser', registerUser)



module.exports = router;
