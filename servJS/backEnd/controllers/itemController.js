let favoriteItems = [];
let cartItems = [];

const toggleFavoriteItem = (req, res) => {
    const itemId = req.params.id;

    if (!itemId) {
        return res.status(400).send('Item ID is required');
    }

    const itemIndex = favoriteItems.indexOf(itemId);
    if (itemIndex > -1) {
        // Item is already in favorites, remove it
        favoriteItems.splice(itemIndex, 1);
        res.send(`Item ${itemId} removed from favorites`);
    } else {
        // Item is not in favorites, add it
        favoriteItems.push(itemId);
        res.send(`Item ${itemId} added to favorites`);
    }
};

const toggleCartItem = (req, res) => {
    const itemId = req.params.id;

    if (!itemId) {
        return res.status(400).send('Item ID is required');
    }

    const itemIndex = cartItems.indexOf(itemId);
    if (itemIndex > -1) {
        // Item is already in cart, remove it
        cartItems.splice(itemIndex, 1);
        res.send(`Item ${itemId} removed from cart`);
    } else {
        // Item is not in cart, add it
        cartItems.push(itemId);
        res.send(`Item ${itemId} added to cart`);
    }
};

module.exports = { toggleFavoriteItem, toggleCartItem };
