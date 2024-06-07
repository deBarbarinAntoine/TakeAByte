const express = require('express');
const router = express.Router();

const { getAddressSuggestions } = require('../controllers/addressController');
const { getCloseDeliveryPoint } = require('../controllers/deliveryPointController');
const { toggleFavoriteItem, toggleCartItem } = require('../controllers/itemController');

// Define a route to get address suggestions
router.get('/getAddress/:address', getAddressSuggestions);

// Define a route to get close delivery points
router.get('/getCloseDeliveryPoint/:rayon/:latitude/:longitude', getCloseDeliveryPoint);

// Route to set/unset a favorite item
router.get('/setFav/:id', toggleFavoriteItem);

// Route to add/remove an item to/from the cart
router.get('/addToCart/:id', toggleCartItem);

module.exports = router;
