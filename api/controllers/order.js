const { createNewOrderQuery, getOrderDataQuery,getUserOrdersDataQuery, getOrdersOfProductQuery, getOrderByStatusQuery,
    createNewOrderItemQuery
} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");

// Function to handle creating a new order
exports.createNewOrder = (req, res) => {
    const { user_id } = req.userId
    const { items } = req.body; // items should be an array of { product_id, quantity }
    const date_ordered_at = new Date(); // Current timestamp
    const status = 'waiting'; // Default status

    connection.beginTransaction((err) => {
        if (err) {
            return serverErrorResponse(res, "Transaction start failed");
        }

        // Step 1: Insert into orders table
        connection.query(createNewOrderQuery, [user_id, date_ordered_at, status], (error, results) => {
            if (error) {
                return connection.rollback(() => {
                    serverErrorResponse(res, "Failed to create new order");
                });
            }

            const order_id = results.insertId;

            // Step 2: Insert each item into order_items table
            const orderItems = items.map(item => [order_id, item.product_id, item.quantity]);

            connection.query(createNewOrderItemQuery, [orderItems], (error) => {
                if (error) {
                    return connection.rollback(() => {
                        serverErrorResponse(res, "Failed to create order items");
                    });
                }

                connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            serverErrorResponse(res, "Transaction commit failed");
                        });
                    }
                    res.status(201).json({ message: 'Order created successfully', order_id });
                });
            });
        });
    });
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

exports.getUserOrdersData = (req, res) => {
    const { user_id } = req.params;
    connection.query(getUserOrdersDataQuery, [user_id], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get user order");
        }
        res.status(200).json(results);
    });
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