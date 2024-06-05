const connection = require("./db-connect");
const { getAllproductsQuery, getAllproductsByTypeQuery, isExistingProduct} = require("./db-queries");

class Product {
    constructor(id, name, description, quantityStock, price, processor, RAM, size, captor, weight, socketCPU, dimension, others, connectivity, resolution, screenType, VRAM, batteryPowerTime, type, storage, color, createdAt, updatedAt) {
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
        this.storage = storage;
        this.color = color;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

function newProductArray(arr) {
    return arr.map(item => new Product(
        item.id, item.name, item.description, item.quantityStock, item.price, item.processor, item.RAM, item.size,
        item.captor, item.weight, item.socketCPU, item.dimension, item.others, item.connectivity, item.resolution,
        item.screenType, item.VRAM, item.batteryPowerTime, item.type, item.storage, item.color, item.createdAt, item.updatedAt
    ));
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

module.exports = { getAllProducts, productsByType ,getProductByNameAndBrand};
