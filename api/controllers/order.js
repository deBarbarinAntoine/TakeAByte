const { createNewOrderQuery, getOrderDataQuery,getUserOrdersDataQuery, getOrdersOfProductQuery, getOrderByStatusQuery,
    createNewOrderItemQuery
} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");

// Function to handle creating a new order
exports.createNewOrder = async (req, res) => {
    const  user_id = req.userId;
    const { items }  = req.body; // items should be an array of { product_id, quantity }
    const date_ordered_at = new Date(); // Current timestamp
    const status = 'waiting'; // Default status

    // Validate request body
    if (!Array.isArray(items) || items.some(item => !item.product_id || !item.quantity)) {
        return res.status(400).json({error: "Invalid request body"});
    }

    try {

        // Step 1: Insert into orders table
        const orderResult = await connection.execute(createNewOrderQuery, [user_id, date_ordered_at, status]);
        const order_id = orderResult[0].insertId

        // Step 2: Insert each item into order_items table
        for (const item of items) {
            await connection.execute(createNewOrderItemQuery, [order_id, item.product_id, item.quantity]);
        }

        res.status(201).json({message: 'Order created successfully', order_id});
    } catch (error) {
        console.log(error)
        serverErrorResponse(res, "Failed to create order", error);
    }
};


exports.getOrderData = (req, res) => {
    const { order_id } = req.params;
    connection.query(getOrderDataQuery, [order_id], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get order data");
        }
        if (results.length === 0) {
            return notFoundErrorResponse (res, "no order data");
        }
        res.status(200).json(results[0]);
    });
};

exports.getUserOrdersData = async (req, res) => {
    const {user_id} = req.params;
    try {
        const results = await connection.query(getUserOrdersDataQuery, [user_id])
        console.log(results[0])
        res.status(200).json(results[0]);
    } catch (err) {
        console.log(err)
        return serverErrorResponse(res, "Failed to get user order");
    }
};

exports.getOrdersOfProduct = (req, res) => {
    const { product_id } = req.params;
    connection.query(getOrdersOfProductQuery, [product_id], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get orders with specified product");
        }
        res.status(200).json(results);
    });
};

exports.getOrderByStatus = (req, res) => {
    const { user_id } = req.params;
    const { status } = req.query;
    connection.query(getOrderByStatusQuery, [user_id, status], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed get user order by selected status");
        }
        res.status(200).json(results);
    })
}