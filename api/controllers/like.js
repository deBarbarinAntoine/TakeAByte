const {likeProductQuery, unlikeProductQuery, getProductLikesQuery} = require("../models/db-queries");
const {query} = require("../models/db-connect");
const {serverErrorResponse, conflictErrorResponse} = require("../helpers/responses");

exports.likeProduct = (req, res) => {
    const { product_id } = req.params;
    const user_id = req.body.user_id;
    const created_at = new Date(); // Current timestamp
    query(likeProductQuery, [user_id, product_id, created_at], (error) => {
        if (error) {
            if (error.errno === 1062) {
                conflictErrorResponse(res, error, "You already unliked this product");
                return;
            }
            return serverErrorResponse(res, "Failed to like product");
        }
        res.status(200).json({ message: 'Product liked successfully' });
    });
};

exports.unlikeProduct = (req, res) => {
    const { product_id } = req.params;
    const user_id = req.body.user_id;
    query(unlikeProductQuery, [user_id, product_id], (error) => {
        if (error) {
            return serverErrorResponse(res, "Failed to unlike product");
        }
        res.status(200).json({ message: 'Product unliked successfully' });
    });
};

exports.getProductLikes = (req, res) => {
    const { product_id } = req.params;
    query(getProductLikesQuery, [product_id], (error, results) => {
        if (error) {
            return serverErrorResponse(res, "Failed to get product like");
        }
        res.status(200).json(results);
    });
};