const connection = require("./db-connect");
const { getAllproductsQuery, getAllproductsByTypeQuery, isExistingProduct} = require("./db-queries");

class Product {
    constructor({
                    id, name, description, quantityStock, price, processor, RAM, size, captor, weight,
                    socketCPU, dimension, others, connectivity, resolution, screenType, VRAM, batteryPowerTime,
                    type,brand, storage, color, createdAt, updatedAt, image
                }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantityStock = quantityStock;
        this.price = price;
        this.processor = processor;
        this.RAM = RAM;
        this.size = size;
        this.captor = captor;
        this.weight = weight;
        this.socketCPU = socketCPU;
        this.dimension = dimension;
        this.others = others;
        this.connectivity = connectivity;
        this.resolution = resolution;
        this.screenType = screenType;
        this.VRAM = VRAM;
        this.batteryPowerTime = batteryPowerTime;
        this.type = type;
        this.brand = brand;
        this.storage = storage;
        this.color = color;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.image = image;
    }
}


function newProductArray(arr) {
    const productsArray = arr[0]; // Accessing the array of product objects

    return productsArray.map(item => new Product({
        id: item.product_id,
        name: item.name,
        description: item.description,
        quantityStock: item.quantity_stocked,
        price: item.price,
        processor: item.processor,
        RAM: item.ram,
        size: item.size,
        captor: item.captor,
        weight: item.weight,
        socketCPU: item.socket_cpu,
        dimension: item.dimension,
        others: item.others,
        connectivity: item.connectivity,
        resolution: item.resolution,
        screenType: item.screen_type,
        VRAM: item.vram,
        batteryPowerTime: item.battery_power_time,
        type: item.type_id,
        brand: item.brand_id,
        storage: item.storage,
        color: null, // Assuming color is not provided in the data
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        image : item.image
    }));
}

async function productsByType(type) {
    type = `%${type}%`.toLowerCase().trim();
    try {
        const [rows] = await connection.query(getAllproductsByTypeQuery, [type]);
        return newProductArray(rows);
    } catch (err) {
        console.error('Error fetching products by type', err);
        throw err;
    }
}

async function getAllProducts() {
    try {
        const [rows] = await connection.query(getAllproductsQuery);
        return newProductArray(rows);
    } catch (err) {
        console.error('Error fetching all products', err);
        throw err;
    }
}

// Helper function to get product by name and brand
async function getProductByNameAndBrand(name, brandId) {
    const [rows] = await connection.query(isExistingProduct, [name, brandId]);
    return rows.length ? rows[0] : null;
}

module.exports = { getAllProducts, productsByType ,getProductByNameAndBrand,newProductArray};
