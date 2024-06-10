const {
    createNewProductQuery,
    getProductByIdQuery,
    updateProductDataQuery,
    deleteProductQuery,
} = require("../models/db-queries");
const connection = require("../models/db-connect");
const {serverErrorResponse, notFoundErrorResponse} = require("../helpers/responses");
const {newProductArray, getProductByNameAndBrand} = require("../models/products");
const {getTypeIdByName} = require("./type");
const {getBrandIdByName} = require("./brand");
const {saveImagePath} = require("./image");

exports.createNewProduct = async (req, res) => {
    const products = Array.isArray(req.body) ? req.body : [req.body];

    let product_id;
    try {
        let createdProducts = [];

        for (let product of products) {
            let {
                name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
                others, connectivity, resolution, screen_type, vram, battery_power_time, type, brand, storage, image
            } = product;

            const typeId = await getTypeIdByName({params: {name: type}});
            const brandId = await getBrandIdByName({params: {name: brand}});


            const existingProduct = await getProductByNameAndBrand(name, brandId);
            if (existingProduct) {
                return res.status(400).json({
                    message: `Product with name ${name} and brand ${brand} already exists`,
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
            createdProducts.push({product_id: results.insertId, name, brand});

            product_id = await getProductByNameAndBrand(name, brandId)
            await saveImagePath(image, product_id);
        }

        res.status(201).json({message: 'Products created successfully', products: createdProducts});
    } catch (error) {
        console.error("Unexpected error:", error);
        serverErrorResponse(res, "Failed to create products");
    }
};

exports.getProductById = async (req, res) => {
    const {product_id} = req.params;
    try {
        const result = await connection.query(getProductByIdQuery, [product_id])
        if (result.length === 0) {
            return notFoundErrorResponse(res, "No result for product with given id");
        }
        res.status(200).json(result[0]);
    } catch (err) {
        return serverErrorResponse(res, err, "Failed to get product with given id");
    }
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

exports.getProducts = async (req, res) => {
    const {filters = {}, page = 1} = req.query;
    const limit = 10;
    const offset = (page - 1) * limit;

    let getProductsQuery = 'SELECT * FROM products';
    let queryParams = [];

    // Building the WHERE clause for filtering
    const filterConditions = [];
    for (const key in filters) {
        if (Object.hasOwnProperty.call(filters, key)) {
            switch (key) {
                case 'name':
                case 'processor':
                case 'captor':
                case 'socket_cpu':
                case 'dimension':
                case 'others':
                case 'connectivity':
                case 'resolution':
                case 'screen_type':
                case 'color':
                    filterConditions.push(`${key} LIKE ?`);
                    queryParams.push(`%${filters[key]}%`);
                    break;
                case 'brand_id':
                case 'type_id':
                case 'ram':
                case 'size':
                case 'vram':
                case 'battery_power_time':
                case 'storage':
                    filterConditions.push(`${key} = ?`);
                    queryParams.push(filters[key]);
                    break;
                case 'price_min':
                    filterConditions.push(`price >= ?`);
                    queryParams.push(filters[key]);
                    break;
                case 'price_max':
                    filterConditions.push(`price <= ?`);
                    queryParams.push(filters[key]);
                    break;
                case 'updated_at':
                    getProductsQuery += ' ORDER BY updated_at ' + filters[key];
                    break;
                default:
                    break;
            }
        }
    }

    if (filterConditions.length > 0) {
        getProductsQuery += ' WHERE ' + filterConditions.join(' AND ');
    }

    getProductsQuery += ' LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    try {
        const results = await connection.query(getProductsQuery, queryParams)
        const products = newProductArray(results);
        res.status(200).json(products);
    } catch (err) {
        return serverErrorResponse(res, err, "Failed to get products with given filters and offset");
    }
};

exports.getTopProduct = async (req, res) => {
    const {limit} = req.params;
    const getPopularProducts = 'SELECT p.product_id, p.name, p.description, p.quantity_stocked, p.price, p.processor, p.ram, p.size, p.captor, p.weight, p.socket_cpu, p.dimension, p.others, p.connectivity, p.resolution, p.screen_type, p.vram, p.battery_power_time, p.storage,p.brand_id, COUNT(l.product_id) AS likes_count FROM products p JOIN likes l ON p.product_id = l.product_id GROUP BY p.product_id ORDER BY likes_count DESC LIMIT ?';
    try {
        const results = await connection.query(getPopularProducts, [parseInt(limit)])
        const products = newProductArray(results);
        res.status(200).json(products);

    } catch (err) {
        return serverErrorResponse(res, err,"Failed to get top products with given limit");
    }

};
