const {likeProductQuery, unlikeProductQuery, getProductLikesQuery} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse} = require("../helpers/responses");

exports.likeProduct = async (req, res) => {
    const {product_id} = req.params;
    const user_id = req.userId
    const created_at = new Date(); // Current timestamp
    try {
        await connection.query(likeProductQuery, [user_id, product_id, created_at],
            res.status(200).json({message: 'Product liked successfullyy'}))
    } catch (err) {
        console.log(err)
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