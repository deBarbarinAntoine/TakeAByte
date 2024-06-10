const connection = require("./db-connect");
const { getAllproductsQuery, getAllproductsByTypeQuery, isExistingProduct} = require("./db-queries");

class Product {
    constructor({
                    id,name, description, quantity_stocked, price, processor, ram,
                    storage_capacity, battery_power_time, screen_type, resolution, camera,
                    connectivity, operating_system, brand, sales, sensor, megapixels,
                    display_size, gps, film_format, cores, Interface, form_factor, wifi,
                    speed, capacity, graphics_card, refresh_rate, response_time, touchscreen,
                    materials, layout, lighting, switch_type, wattage, certification,
                    socket_cpu, socket_compatibility, noise_level, portability, sensor_size,
                    lens_mount, compatibility, airflow, curve, sync_technology, side_panel,
                    microphone, performance_focus, grade, video_recording, business_oriented,
                    security_features, Function, smart_assistant, technology, coverage,
                    stabilization, gaming_oriented, features, benefits, autofocus,
                    weatherproof, target_audience, uses, cpu_generation, g_sync_compatible,
                    power_consumption, created_at, updated_at,image
                }) {
        this.id = id
        this.name = name;
        this.description = description;
        this.quantityStock = quantity_stocked;
        this.price = price;
        this.processor = processor;
        this.ram = ram;
        this.storageCapacity = storage_capacity;
        this.batteryPowerTime = battery_power_time;
        this.screenType = screen_type;
        this.resolution = resolution;
        this.camera = camera;
        this.connectivity = connectivity;
        this.operatingSystem = operating_system;
        this.brand = brand;
        this.sales = sales;
        this.sensor = sensor;
        this.megapixels = megapixels;
        this.displaySize = display_size;
        this.gps = gps;
        this.filmFormat = film_format;
        this.cores = cores;
        this.interface = Interface;
        this.formFactor = form_factor;
        this.wifi = wifi;
        this.speed = speed;
        this.capacity = capacity;
        this.graphicsCard = graphics_card;
        this.refreshRate = refresh_rate;
        this.responseTime = response_time;
        this.touchscreen = touchscreen;
        this.materials = materials;
        this.layout = layout;
        this.lighting = lighting;
        this.switchType = switch_type;
        this.wattage = wattage;
        this.certification = certification;
        this.socketCPU = socket_cpu;
        this.socketCompatibility = socket_compatibility;
        this.noiseLevel = noise_level;
        this.portability = portability;
        this.sensorSize = sensor_size;
        this.lensMount = lens_mount;
        this.compatibility = compatibility;
        this.airflow = airflow;
        this.curve = curve;
        this.syncTechnology = sync_technology;
        this.sidePanel = side_panel;
        this.microphone = microphone;
        this.performanceFocus = performance_focus;
        this.grade = grade;
        this.videoRecording = video_recording;
        this.businessOriented = business_oriented;
        this.securityFeatures = security_features;
        this.functionality = Function;
        this.smartAssistant = smart_assistant;
        this.technology = technology;
        this.coverage = coverage;
        this.stabilization = stabilization;
        this.gamingOriented = gaming_oriented;
        this.features = features;
        this.benefits = benefits;
        this.autofocus = autofocus;
        this.weatherproof = weatherproof;
        this.targetAudience = target_audience;
        this.uses = uses;
        this.cpuGeneration = cpu_generation;
        this.gSyncCompatible = g_sync_compatible;
        this.powerConsumption = power_consumption;
        this.createdAt = created_at;
        this.updatedAt = updated_at;
        this.image = image;
    }
}

function newProductArray(arr) {
     // Accessing the array of product objects
    return arr.map(item => new Product({
        id: item.product_id,
        name: item.name,
        description: item.description,
        quantity_stocked: item.quantityStock,
        price: item.price,
        processor: item.processor,
        ram: item.ram,
        storage_capacity: item.storageCapacity,
        battery_power_time: item.batteryPowerTime,
        screen_type: item.screenType,
        resolution: item.resolution,
        camera: item.camera,
        connectivity: item.connectivity,
        operating_system: item.operatingSystem,
        brand: item.brand,
        sales: item.sales,
        sensor: item.sensor,
        megapixels: item.megapixels,
        display_size: item.displaySize,
        gps: item.gps,
        film_format: item.filmFormat,
        cores: item.cores,
        interface: item.Interface,
        form_factor: item.formFactor,
        wifi: item.wifi,
        speed: item.speed,
        capacity: item.capacity,
        graphics_card: item.graphicsCard,
        refresh_rate: item.refreshRate,
        response_time: item.responseTime,
        touchscreen: item.touchscreen,
        materials: item.materials,
        layout: item.layout,
        lighting: item.lighting,
        switch_type: item.switchType,
        wattage: item.wattage,
        certification: item.certification,
        socket_cpu: item.socketCPU,
        socket_compatibility: item.socketCompatibility,
        noise_level: item.noiseLevel,
        portability: item.portability,
        sensor_size: item.sensorSize,
        lens_mount: item.lensMount,
        compatibility: item.compatibility,
        airflow: item.airflow,
        curve: item.curve,
        sync_technology: item.syncTechnology,
        side_panel: item.sidePanel,
        microphone: item.microphone,
        performance_focus: item.performanceFocus,
        grade: item.grade,
        video_recording: item.videoRecording,
        business_oriented: item.businessOriented,
        security_features: item.securityFeatures,
        function: item.functionality,
        smart_assistant: item.smartAssistant,
        technology: item.technology,
        coverage: item.coverage,
        stabilization: item.stabilization,
        gaming_oriented: item.gamingOriented,
        features: item.features,
        benefits: item.benefits,
        autofocus: item.autofocus,
        weatherproof: item.weatherproof,
        target_audience: item.targetAudience,
        uses: item.uses,
        cpu_generation: item.cpuGeneration,
        g_sync_compatible: item.gSyncCompatible,
        power_consumption: item.powerConsumption,
        created_at: item.createdAt,
        updated_at: item.updatedAt,
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
