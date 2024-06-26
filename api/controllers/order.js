const { createNewOrderQuery, getOrderDataQuery,getUserOrdersDataQuery, getOrdersOfProductQuery, getOrderByStatusQuery,
    createNewOrderItemQuery, getOrderDetailsQuery
} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");

// Function to handle creating a new order
exports.createNewOrder = async (req, res) => {
    const  user_id = req.userId;
    const { items }  = req.body; // items should be an array of { product_id, quantity , price}
    const date_ordered_at = new Date(); // Current timestamp
    const status = 'waiting'; // Default status

    // Validate request body
    if (!Array.isArray(items) || items.some(item => !item.product_id || !item.quantity || !item.price)) {
        return res.status(400).json({error: "Invalid request body"});
    }
    const full_price = items.reduce((total, item) => total + item.price, 0);
    try {

        // Step 1: Insert into orders table
        const orderResult = await connection.execute(createNewOrderQuery, [user_id, full_price ,date_ordered_at, status]);
        const order_id = orderResult[0].insertId

        // Step 2: Insert each item into order_items table
        for (const item of items) {
            const price=  item.price / item.quantity
            await connection.execute(createNewOrderItemQuery, [order_id, item.product_id, item.quantity , price]);
        }

        res.status(201).json({message: 'Order created successfully', order_id});
    } catch (error) {
        console.error(error)
        serverErrorResponse(res, "Failed to create order", error);
    }
};


exports.getOrderData = async (req, res) => {
    const {order_id} = req.params;
    try {
        const results = await connection.query(getOrderDataQuery, [order_id])
        if (results.length === 0) {
            return notFoundErrorResponse(res, "no order data");
        }
        const order = await connection.query(getOrderDetailsQuery, [results[0][0].order_id]);
        const combinedData = {
            order : results[0][0],
            detail :order[0]
        }
        res.status(200).json(combinedData);
    } catch (err) {
        return serverErrorResponse(res, "Failed to get order data");
    }
};

exports.getUserOrdersData = async (req, res) => {
    const { user_id } = req.params;
    try {
        const queryResults = await connection.query(getUserOrdersDataQuery, [user_id]);
        const results = queryResults[0]; // Extract the first element which contains the order data

        if (!Array.isArray(results) || results.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        // Map over the orders to create an array of promises
        const allDetailsPromises = results.map(order => connection.query(getOrderDetailsQuery, [order.order_id]));

        // Await all promises to resolve
        const allDetailsArray = await Promise.all(allDetailsPromises);

        // Combine results with their corresponding details
        const combinedResults = results.map((order, index) => ({
            ...order,
            details: allDetailsArray[index]
        }));


        res.status(200).json(combinedResults);
    } catch (err) {
        console.error(err);
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

exports.getOrderDetails = async (req, res) => {
    const {order_id} = req.params;

    try {
        const results = await connection.query(getOrderDetailsQuery, [order_id])
        if (results.length === 0) {
            return notFoundErrorResponse(res, "no order data");
        }
        res.status(200).json(results[0]);
    } catch (err) {
        return serverErrorResponse(res, "Failed to get order data");
    }
};
