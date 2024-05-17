const connection = require("./db-connect");
const {getAllproductsQuery, getAllproductsByTypeQuery} = require("./db-queries");

class Product {
    id;
    name;
    description;
    quantityStock;
    price;
    processor;
    RAM;
    size;
    captor;
    weight;
    socketCPU;
    dimension;
    others;
    connectivity;
    resolution;
    screenType;
    VRAM;
    batteryPowerTime;
    type;
    storage;
    color;
    createdAt;
    UpdatedAt;

    constructor(id, name, description, quantityStock, price, processor, RAM, size, captor, weight, socketCPU, dimension, others, connectivity, resolution, screenType, VRAM, batteryPowerTime, type, storage, color, createdAt, UpdatedAt) {
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
        this.UpdatedAt = UpdatedAt;
    }
}

function newProductArray(arr) {
    const productArray = [];
    for (let i = 0; i < arr.length; i++) {
        productArray.push(new Product(arr[i]));
    }
    return productArray;
}

async function productsByType(type) {
    type = `%${type}%`.toLowerCase().trim();
    try {
        const [rows] = await connection.query(getAllproductsByTypeQuery, [type]);
        return newProductArray(rows);
    } catch (err) {
        console.error('Error fetching all products', err);
    }
}

async function getAllProducts() {
    try {
        const [rows] = await connection.query(getAllproductsQuery);
        return newProductArray(rows);
    } catch (err) {
        console.error('Error fetching all products', err);
    }
}