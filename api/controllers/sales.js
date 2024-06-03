const {createNewSalesQuery,getUserOngoingSalesQuery} = require("../models/db-queries");
const {query} = require("../models/db-connect");
const {serverErrorResponse} = require("../helpers/responses");
exports.createNewSales = (req, res) => {
    const { product_id, sale_price, start_date, end_date } = req.body;
    const values = [product_id, sale_price, start_date, end_date];

    query(createNewSalesQuery, values, (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to creat new sales with given values")
        }
        res.status(201).json({ message: 'Sale created successfully', sale_id: results.insertId });
    });
};

exports.getUserOngoingSales = (req, res) => {
    const { user_id } = req.params;
    query(getUserOngoingSalesQuery, [user_id], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get users who have item in liked that are in sales")
        }
        res.status(200).json(results);
    });
};
