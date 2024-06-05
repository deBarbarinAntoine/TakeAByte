const {
    createNewProductQuery,
    getProductByIdQuery,
    updateProductDataQuery,
    deleteProductQuery,
    getPopularProducts
} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");
const {Product, newProductArray, getProductByNameAndBrand} = require("../models/products");
const {getTypeIdByName} = require("./type");
const {getBrandIdByName} = require("./brand");

exports.createNewProduct = async (req, res) => {
    let {
        name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type, brand, storage
    } = req.body;

    try {
        const typeId = await getTypeIdByName({params: {name: type}});
        const brandId = await getBrandIdByName({params: {name: brand}});

        const existingProduct = await getProductByNameAndBrand(name, brandId);
        if (existingProduct) {
            return res.status(400).json({
                message: 'Product with same name and brand already exists',
                existing_product_id: existingProduct.product_id
            });
        }

        if (quantity_stocked === null || quantity_stocked === undefined) {
            quantity_stocked = 0;
        }
        const values = [
            name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
            others, connectivity, resolution, screen_type, vram, battery_power_time, typeId, storage, brandId
        ];
        // Insert product into the database
        const results = await connection.query(createNewProductQuery, values);
        res.status(201).json({message: 'Product created successfully', product_id: results.insertId});
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to create product");
    }
};

exports.getProductById = (req, res) => {
    const {product_id} = req.params;
    connection.query(getProductByIdQuery, [product_id], (error, results) => {
        if (error) {
            return serverErrorResponse(res, "Failed to get product with given id");
        }
        if (results.length === 0) {
            return notFoundErrorResponse(res, "No result for product with given id");
        }
        const product = new Product(...results[0]);
        res.status(200).json(product);
    });
};

exports.updateProductData = (req, res) => {
    const {product_id} = req.params;
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
            return serverErrorResponse(res, "Failed to update product with given id and values");
        }
        res.status(200).json({message: 'Product updated successfully'});
    });
};

exports.deleteProduct = (req, res) => {
    const {product_id} = req.params;
    connection.query(deleteProductQuery, [product_id], (error) => {
        if (error) {
            return serverErrorResponse(res, "Failed to delete product with given id");
        }
        res.status(200).json({message: 'Product deleted successfully'});
    });
};

exports.getProducts = (req, res) => {
    const {filters = {}, page = 1} = req.query; // Assuming filters and page come from query parameters
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
        if (filters.type_id) {
            filterConditions.push('type_id = ?');
            queryParams.push(filters.type_id);
        }
        if (filters.processor) {
            filterConditions.push('processor LIKE ?');
            queryParams.push(`%${filters.processor}%`);
        }
        if (filters.ram) {
            filterConditions.push('ram = ?');
            queryParams.push(filters.ram);
        }
        if (filters.size) {
            filterConditions.push('size = ?');
            queryParams.push(filters.size);
        }
        if (filters.captor) {
            filterConditions.push('captor LIKE ?');
            queryParams.push(`%${filters.captor}%`);
        }
        if (filters.weight) {
            filterConditions.push('weight = ?');
            queryParams.push(filters.weight);
        }
        if (filters.socket_cpu) {
            filterConditions.push('socket_cpu LIKE ?');
            queryParams.push(`%${filters.socket_cpu}%`);
        }
        if (filters.dimension) {
            filterConditions.push('dimension LIKE ?');
            queryParams.push(`%${filters.dimension}%`);
        }
        if (filters.others) {
            filterConditions.push('others LIKE ?');
            queryParams.push(`%${filters.others}%`);
        }
        if (filters.connectivity) {
            filterConditions.push('connectivity LIKE ?');
            queryParams.push(`%${filters.connectivity}%`);
        }
        if (filters.resolution) {
            filterConditions.push('resolution LIKE ?');
            queryParams.push(`%${filters.resolution}%`);
        }
        if (filters.screen_type) {
            filterConditions.push('screen_type LIKE ?');
            queryParams.push(`%${filters.screen_type}%`);
        }
        if (filters.vram) {
            filterConditions.push('vram = ?');
            queryParams.push(filters.vram);
        }
        if (filters.battery_power_time) {
            filterConditions.push('battery_power_time = ?');
            queryParams.push(filters.battery_power_time);
        }
        if (filters.storage) {
            filterConditions.push('storage = ?');
            queryParams.push(filters.storage);
        }
        if (filters.color) {
            filterConditions.push('color LIKE ?');
            queryParams.push(`%${filters.color}%`);
        }
        if (filters.price_min) {
            filterConditions.push('price >= ?');
            queryParams.push(filters.price_min);
        }
        if (filters.price_max) {
            filterConditions.push('price <= ?');
            queryParams.push(filters.price_max);
        }

        if (filterConditions.length > 0) {
            getProductsQuery += ' WHERE ' + filterConditions.join(' AND ');
        }
    }

    getProductsQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    connection.query(getProductsQuery, queryParams, (error, results) => {
        if (error) {
            return serverErrorResponse(res, "Failed to get products with given filters and offset");
        }
        const products = newProductArray(results);
        res.status(200).json(products);
    });
};


exports.getTopProduct = (req, res) => {
    const {limit} = req.params;
    connection.query(getPopularProducts, [limit], (error, results) => {
        if (error) {
            return serverErrorResponse(res, "Failed to get top products with given limit");
        }
        const products = newProductArray(results);
        res.status(200).json(products);
    });
};
