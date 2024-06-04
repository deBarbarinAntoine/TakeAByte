const {createNewProductQuery,getProductByIdQuery,updateProductDataQuery,deleteProductQuery, getPopularProducts} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");

exports.createNewProduct = (req, res) => {
    const {
        name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id
    } = req.body;
    const values = [
        name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id
    ];
    connection.query(createNewProductQuery, values, (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to create new product");
        }
        res.status(201).json({ message: 'Product created successfully', product_id: results.insertId });
    });
};

exports.getProductById = (req, res) => {
    const { product_id } = req.params;
    connection.query(getProductByIdQuery, [product_id], (error, results) => {
        if (error) {
            return  serverErrorResponse (res, "Failed to get Product with given id")
        }
        if (results.length === 0) {
            return  notFoundErrorResponse (res, "no result for product with given id");
        }
        res.status(200).json(results[0]);
    });
};

exports.updateProductData = (req, res) => {
    const { product_id } = req.params;
    const {
        name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id
    } = req.body;
    const values = [
        name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id, product_id
    ];
    connection.query(updateProductDataQuery, values, (error) => {
        if (error) {
            return serverErrorResponse (res, "Failed to update Product with given id and values")
        }
        res.status(200).json({ message: 'Product updated successfully' });
    });
};

exports.deleteProduct = (req, res) => {
    const { product_id } = req.params;
    connection.query(deleteProductQuery, [product_id], (error) => {
        if (error) {
            return serverErrorResponse (res, "Failed to delete Product with given id")
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    });
};

exports.getProducts = (req, res) => {
    const { filters, page } = req.params;
    const limit = 10; // You can adjust the limit as needed
    const offset = (page - 1) * limit;

    let getProductsQuery = 'SELECT * FROM products';
    let queryParams = [];

    // Apply filters if any
    if (filters) {
        const filterConditions = [];
        if (filters.name) {
            filterConditions.push('name LIKE ?');
            queryParams.push(`%${filters.name}%`);
        }
        if (filters.brand_id) {
            filterConditions.push('brand_id = ?');
            queryParams.push(filters.brand_id);
        }
        // Add more filters as needed

        if (filterConditions.length > 0) {
            getProductsQuery += ' WHERE ' + filterConditions.join(' AND ');
        }
    }

    getProductsQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    connection.query(getProductsQuery, queryParams, (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get Product with given id and filter ? and offset ?")
        }
        res.status(200).json(results);
    });
};

exports.getTopProduct = async (req, res) => {
    const { limit } = req.params
    connection.query(getPopularProducts, [limit], (error, results) => {
        if (error) {
            return serverErrorResponse (res, "Failed to get Top Product with given limit")
        }
        res.status(200).json(results);
    })
};
