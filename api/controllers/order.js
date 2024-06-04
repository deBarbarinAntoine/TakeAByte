const { createNewOrderQuery, getOrderDataQuery,getUserOrdersDataQuery, getOrdersOfProductQuery, getOrderByStatusQuery} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");

exports.createNewOrder = (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const date_ordered_at = new Date(); // Current timestamp
    connection.query(createNewOrderQuery, [user_id, product_id, date_ordered_at, quantity], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to create new order");
        }
        res.status(201).json({ message: 'Order created successfully', order_id: results.insertId });
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