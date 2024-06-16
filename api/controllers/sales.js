const {createNewSalesQuery,getUserOngoingSalesQuery, getProductSales} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse} = require("../helpers/responses");
exports.createNewSales = (req, res) => {
    const { product_id, sale_price, start_date, end_date } = req.body;
    const values = [product_id, sale_price, start_date, end_date];

    connection.query(createNewSalesQuery, values, (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to creat new sales with given values")
        }
        res.status(201).json({ message: 'Sale created successfully', sale_id: results.insertId });
    });
};

exports.getUserOngoingSales = (req, res) => {
    const { user_id } = req.params;
    connection.query(getUserOngoingSalesQuery, [user_id], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get users who have item in liked that are in sales")
        }
        res.status(200).json(results);
    });
};

exports.GetSaleForProduct = async (req, res) => {
    const { product_id } = req.params;

    try {
        // Execute the query asynchronously
        const sales = await connection.query(getProductSales, [product_id]);

        // Return the result to the client
        res.json({ sales });
    } catch (error) {
        console.error('Error retrieving sale:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};