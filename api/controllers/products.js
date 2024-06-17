const {
    createNewProductQuery,
    getProductByIdQuery,
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
    try {
        let createdProducts = [];

        for (let product of products) {
            let {
                airflow,
                aspect_ratio,
                autofocus,
                battery_power,
                battery_power_time,
                benefits,
                brand,
                business_oriented,
                camera,
                capacity,
                cellular,
                certification,
                compatibility,
                connectivity,
                cores,
                coverage,
                CPU,
                cpu_generation,
                curve,
                description,
                display,
                display_size,
                durability,
                features,
                film_format,
                form_factor,
                functions,
                g_sync_compatible,
                gaming_oriented,
                gps,
                grade,
                graphics_card,
                image,
                interfaces,
                keyboard,
                layout,
                lens_mount,
                lighting,
                materials,
                megapixels,
                microphone,
                name,
                noise_cancellation,
                noise_level,
                operating_system,
                options,
                panel_type,
                performance_focus,
                portability,
                power_consumption,
                price,
                RAM,
                refresh_rate,
                resolution,
                response_time,
                sales,
                screen_type,
                security_features,
                sensor,
                sensor_resolution,
                sensor_size,
                side_panel,
                size,
                smart_assistant,
                socket_compatibility,
                socket_cpu,
                speed,
                stabilization,
                storage_capacity,
                style,
                switch_type,
                sync_technology,
                target_audience,
                technology,
                touchscreen,
                type,
                uses,
                video_recording,
                wattage,
                weatherproof,
                weight,
                wifi,
                wifi_standard,
                zoom,
                quantity_stocked
            } = product;

            // Get typeId and brandId
            const typeId = await getTypeIdByName({params: {name: type}});
            const brandId = await getBrandIdByName({params: {name: brand}});

            // Check if product already exists
            const existingProduct = await getProductByNameAndBrand(name, brandId);
            if (existingProduct) {
                return res.status(400).json({
                    message: `Product with name ${name} and brand ${brand} already exists`,
                    existing_product_id: existingProduct.product_id
                });
            }

            // Ensure quantity_stocked has a default value if not provided
            quantity_stocked = quantity_stocked ?? 0;

            const values = [
                airflow = product.airflow,
                aspect_ratio = product.aspect_ratio,
                autofocus = product.autofocus,
                battery_power = product.battery_power,
                battery_power_time = product.battery_power_time,
                benefits = product.benefits,
                brandId,
                business_oriented = product.business_oriented,
                camera = product.camera,
                capacity = product.capacity,
                cellular = product.cellular,
                certification = product.certification,
                compatibility = product.compatibility,
                connectivity = product.connectivity,
                cores = product.cores,
                coverage = product.coverage,
                CPU = product.CPU,
                cpu_generation = product.cpu_generation,
                curve = product.curve,
                description = product.description,
                display = product.display,
                display_size = product.display_size,
                durability = product.durability,
                features = product.features,
                film_format = product.film_format,
                form_factor = product.form_factor,
                functions = product.functions,
                g_sync_compatible = product.g_sync_compatible,
                gaming_oriented = product.gaming_oriented,
                gps = product.gps,
                grade = product.grade,
                graphics_card = product.graphics_card,
                image = product.image,
                interfaces = product.interfaces,
                keyboard = product.keyboard,
                layout = product.layout,
                lens_mount = product.lens_mount,
                lighting = product.lighting,
                materials = product.materials,
                megapixels = product.megapixels,
                microphone = product.microphone,
                name = product.name,
                noise_cancellation = product.noise_cancellation,
                noise_level = product.noise_level,
                operating_system = product.operating_system,
                options = product.options,
                panel_type = product.panel_type,
                performance_focus = product.performance_focus,
                portability = product.portability,
                power_consumption = product.power_consumption,
                price = product.price,
                quantity_stocked,
                RAM = product.RAM,
                refresh_rate = product.refresh_rate,
                resolution = product.resolution,
                response_time = product.response_time,
                sales = product.sales,
                screen_type = product.screen_type,
                security_features = product.security_features,
                sensor = product.sensor,
                sensor_resolution = product.sensor_resolution,
                sensor_size = product.sensor_size,
                side_panel = product.side_panel,
                size = product.size,
                smart_assistant = product.smart_assistant,
                socket_compatibility = product.socket_compatibility,
                socket_cpu = product.socket_cpu,
                speed = product.speed,
                stabilization = product.stabilization,
                storage_capacity = product.storage_capacity,
                style = product.style,
                switch_type = product.switch_type,
                sync_technology = product.sync_technology,
                target_audience = product.target_audience,
                technology = product.technology,
                touchscreen = product.touchscreen,
                typeId,
                uses = product.uses,
                video_recording = product.video_recording,
                wattage = product.wattage,
                weatherproof = product.weatherproof,
                weight = product.weight,
                wifi = product.wifi,
                wifi_standard = product.wifi_standard,
                zoom = product.zoom
            ];
            // Insert product into the database
            await connection.query(createNewProductQuery, values);

            const newProduct = await getProductByNameAndBrand(product.name, brandId);

            // Save the image path
            await saveImagePath(product.image, newProduct.product_id);

            // Add created product info to the response array
            createdProducts.push({product_id: newProduct.product_id, name, brand});
        }

        res.status(201).json({message: 'Products created successfully', products: createdProducts});
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({message: "Failed to create products"});
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
    const { product_id } = req.params;
    const {
        name, description, quantity_stocked, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id
    } = req.body;

    // Collect fields to be updated in an object
    const fields = {
        name, description, price, processor, ram, size, captor, weight, socket_cpu, dimension,
        others, connectivity, resolution, screen_type, vram, battery_power_time, type_id, storage, brand_id
    };

    let query = 'UPDATE products SET ';
    const values = [];

    // Construct query and values array dynamically
    Object.keys(fields).forEach((key) => {
        if (fields[key] !== null && fields[key] !== undefined && key !== 'quantity_stocked') {
            query += `${key} = ?, `;
            values.push(fields[key]);
        }
    });
    // Handle quantity_stocked separately
    if (quantity_stocked !== null && quantity_stocked !== undefined) {
        query += `quantity_stocked = quantity_stocked - ?, `;
        values.push(quantity_stocked);
    }
    // Remove the trailing comma and space
    try{
        if (values.length > 0) {
            query = query.slice(0, -2); // Remove the last ', '
            query += ' WHERE product_id = ?';
            values.push(product_id);
            connection.query(query, values);
            res.status(200).json({ message: 'Product updated successfully' });
        }

    }catch(err){
        console.log(err)
        console.error(`Error updating product with ID ${product_id}:`, err);
        res.status(400).json({ message: 'No valid fields provided for update' });
    }
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
    const { filters = {}, page = 1 } = req.query;
    const limit = 50;
    const offset = (page - 1) * limit;

    let getProductsQuery = 'SELECT * FROM products';
    let queryParams = [];

    // Building the WHERE clause for filtering
    const filterConditions = [];
    for (const key in filters) {
        if (Object.hasOwnProperty.call(filters, key)) {
            switch (key) {
                // Handle each filter case based on the schema fields
                case 'name':
                case 'CPU':
                case 'socket_cpu':
                case 'resolution':
                case 'screen_type':
                case 'color':
                    // Add more cases for other fields if needed
                    filterConditions.push(`${key} LIKE ?`);
                    queryParams.push(`%${filters[key]}%`);
                    break;
                case 'brand_id':
                case 'type_id':
                case 'RAM':
                case 'size':
                case 'price':
                case 'battery_power_time':
                    // Add more cases for other fields if needed
                    filterConditions.push(`${key} = ?`);
                    queryParams.push(filters[key]);
                    break;
                // Handle price range filtering separately
                case 'price_min':
                    filterConditions.push(`price >= ?`);
                    queryParams.push(filters[key]);
                    break;
                case 'price_max':
                    filterConditions.push(`price <= ?`);
                    queryParams.push(filters[key]);
                    break;
                case 'updated_at':
                    getProductsQuery += ` ORDER BY updated_at ${filters[key]}`;
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
        const results = await connection.query(getProductsQuery, queryParams);
        const products = newProductArray(results[0]);
        res.status(200).json(products);
    } catch (err) {
        return serverErrorResponse(res, err, "Failed to get products with given filters and offset");
    }
};

exports.getTopProduct = async (req, res) => {
    const {limit} = req.params;
    const getPopularProducts = 'SELECT p.*, COUNT(l.product_id) AS likes_count FROM products p JOIN likes l ON p.product_id = l.product_id GROUP BY p.product_id ORDER BY likes_count DESC LIMIT ?';
    try {
        const results = await connection.query(getPopularProducts, [parseInt(limit)])
        const products = newProductArray(results[0]);
        res.status(200).json(products);

    } catch (err) {
        return serverErrorResponse(res, err, "Failed to get top products with given limit");
    }

};
