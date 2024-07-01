const {likeProductQuery, unlikeProductQuery, getProductLikesQuery, getUserFavQuery} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse} = require("../helpers/responses");

exports.likeProduct = async (req, res) => {
    const {product_id} = req.params;
    const user_id = req.userId
    const created_at = new Date(); // Current timestamp
    try {
        await connection.query(likeProductQuery, [user_id, product_id, created_at],
            res.status(200).json({message: 'Product liked successfully'}))
    } catch (err) {
        if (err.errno === 1062){
            console.error('already liked this product')
        }
        console.error(err)
    }
}

exports.unlikeProduct = (req, res) => {
    const { product_id } = req.params;
    const user_id = req.userId
    connection.query(unlikeProductQuery, [user_id, product_id], (error) => {
        if (error) {
            return serverErrorResponse(res, "Failed to unlike product");
        }
        res.status(200).json({ message: 'Product unliked successfully' });
    });
};

exports.getProductLikes = (req, res) => {
    const { product_id } = req.params;
    connection.query(getProductLikesQuery, [product_id], (error, results) => {
        if (error) {
            return serverErrorResponse(res, "Failed to get product like");
        }
        res.status(200).json(results);
    });
};

exports.getUserFav = async (req, res) => {
    const {user_id} = req.params;
    try {
        const results = await connection.query(getUserFavQuery, [user_id]);
        if (!results) {
            res.status(400).json("no favorite found for this user")
        }
        res.status(200).json(results[0]);
    } catch (err) {
        return serverErrorResponse(res, "Failed to get user fav");
    }
};