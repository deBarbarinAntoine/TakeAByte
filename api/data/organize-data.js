const products = require('./products.json');
// const types = new Set();

// for (let i = 0; i < products.length; i++) {
//     let regex = /camera/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'camera';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /watch/i;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Smartwatch';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /(Console|VR)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Gaming';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /(Head|Micro|Speaker|Earbuds)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'audio';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /Smartphone/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'phone device';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /Charger/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'phone Chargers';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /Smartphone(Accessory|Gimbal)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'phone Accessories';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /Desktop/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Computer Desktop';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /(Mini|Single)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Computer Mini-PC/SBC';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /(Laptop|Chromebook)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Computer Laptop';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /Tablet/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Computer Tablet';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /(Appliance|Router)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Computer Network';
//         types.add(products[i].type);
//         continue;
//     }
//     regex = /(Monitor|Case|Keyboard|Mouse|External|Peripheral)/;
//     if (products[i].type.match(regex)) {
//         products[i].type = 'Computer Peripherals';
//         types.add(products[i].type);
//         continue;
//     }
//     products[i].type = 'Computer Components';
//     types.add(products[i].type);
// }

// types.forEach(type => {
//     console.log(type);
// });

const productImages = [
    'samsung-galaxy-s23-ultra.jpg',
    'lenovo-thinkpad-x1-carbon.jpg',
    'samsung-galaxy-watch-5-pro.jpg',
    'apple-watch-se.jpg',
    'fujifilm-instax-mini-11.jpg',
    'samsung-galaxy-buds-pro-2.jpg',
    'xbox-series-s.jpg',
    'anker-577-powercore-23000-portable-charger.jpg',
    'sony-wf-1000xm4-wireless-earbuds.jpg',
    'blue-yeti-nano-microphone.jpg',
    'samsung-galaxy-tab-s7-fe.jpg',
    'belkin-boostcharge-pro-usb-c-power-delivery-wall-charger.jpg',
    'amd-ryzen-5-5600x-processor.jpg',
    'nvidia-geforce-rtx-3060-ti-graphics-card.jpg',
    'samsung-980-pro-nvme-pcie-gen4-ssd.jpg',
    'asus-rog-strix-b550-f-gaming-wifi-motherboard.jpg',
    'corsair-vengeance-rgb-pro-ddr4-ram.jpg',
    'msi-alpha-15-advantage-edition-gaming-laptop.jpg',
    'tp-link-archer-ax55-wi-fi-6-router.jpg',
    'gigabyte-aorus-gc-ph-gvn20d-geforce-gtx-1650-low-profile-graphics-card.jpg',
    'noctua-nh-d15-cpu-cooler.jpg',
    'seagate-barracuda-hdd.jpg',
    'asus-tuf-gaming-vg27aq1a-gaming-monitor.jpg',
    'microsoft-surface-laptop-studio.jpg',
    'western-digital-wd-black-sn770-ssd.jpg',
    'thermaltake-h500-case.jpg',
    'steelseries-apex-pro-tkl-keyboard.jpg',
    'evga-supernova-gt-psu.jpg',
    'gigabyte-b560m-ds3h-motherboard.jpg',
    'samsung-odyssey-g5-curved-monitor.jpg',
    'razer-viper-ultimate-mouse.jpg',
    'audio-technica-at2020-microphone.jpg',
    'nzxt-kraken-x53-rgb-aio-cooler.jpg',
    'be-quiet-pure-rock-2-black-cpu-cooler.jpg',
    'wd-blue-sn570-ssd.jpg',
    'asus-rog-strix-scope-tkl-wireless-keyboard.jpg',
    'logitech-g-pro-x-superlight-mouse.jpg',
    'seagate-backup-plus-slim-portable-drive.jpg',
    'samsung-galaxy-z-fold-4.jpg',
    'sony-a6400-mirrorless-camera.jpg',
    'dji-osmo-mobile-se.jpg',
    'aoc-24g2-monitor.jpg',
    'asus-strix-soar.jpg',
    'thermaltake-toughpower-grand-rgb-psu.jpg',
    'logitech-g920-racing-wheel.jpg',
    'msi-b460m-mortar-motherboard.jpg',
    'phanteks-enthoo-pro-case.jpg',
    'adata-xpg-gammix-d10-ram-16gb.jpg',
    'netgear-ac2000-router.jpg',
    'intel-core-i5-12400-processor.jpg',
    'samsung-870-qvo-ssd.jpg',
    'wd-blue-6tb-hdd.jpg',
    'sony-wh-1000xm4-wireless-headphones.jpg',
    'aoc-g2590px-monitor.jpg',
    'be-quiet-pure-base-500-fx-case.jpg',
    'gigabyte-aorus-gen4-nvme-ssd.jpg',
    'msi-clutch-gm41-mouse.jpg',
    'xpg-sx8200-pro-ssd.jpg',
    'corsair-icue-h100i-elite-cooler.jpg',
    'steelseries-arctis-7-headset.jpg',
    'evga-geforce-gtx-1650-low-profile.jpg',
    'google-pixel-7-pro.jpg',
    'samsung-galaxy-z-flip-4.jpg',
    'sony-a7-iv-mirrorless-camera.jpg',
    'insta360-go-2.jpg',
    'asus-rog-zephyrus-g14-gaming-laptop.jpg',
    'acer-chromebook-spin-713.jpg',
    'iphone-se-2022.jpg',
    'canon-eos-r7-mirrorless-camera.jpg',
    'lenovo-thinkpad-x1-carbon-gen-10.jpg',
    'dji-osmo-mobile-6.jpg',
    'ubiquiti-unifi-security-gateway.jpg',
    'sony-rx100-vii-camera.jpg',
    'google-pixel-buds-pro.jpg',
    'tp-link-deco-mesh-wi-fi.jpg',
    'insta360-one-x2.jpg',
    'synology-diskstation-ds220+.jpg',
    'netgear-nighthawk-pro-gaming-xr500-router.jpg',
    'nikon-z-fc-mirrorless-camera.jpg',
    'apple-airpods-3rd-generation.jpg',
    'eero-pro-6e-mesh-wi-fi.jpg',
    'fujifilm-x-t4-mirrorless-camera.jpg',
    'google-pixel-6a.jpg',
    'anker-577-power-bank.jpg',
    'raspberry-pi-4-model-b.jpg',
    'intel-nuc-12-pro-mini-pc.jpg',
    'asus-rog-strix-xg27uq-monitor.jpg',
    'odyssey-g9-by-samsung.jpg',
    'orange-pi-5-sbc.jpg',
    'geekworm-onion-omega-2.jpg',
    'lg-27gn800-b-monitor.jpg',
    'rock-pi-4-model-b-plus.jpg',
    'apple-mac-mini-m2.jpg',
    'msi-modern-am271-2k-monitor.jpg',
    'pine64-pinephone-pro.jpg',
    'amazon-fire-tv-stick-4k-max.jpg',
    'sceptre-curved-gaming-monitor.jpg',
    'khadas-vim3l.jpg'
];

function searchProduct(productName, range) {
    for (const productImage of productImages) {
        const name = productImage.substring(0,range).replace(/-/g, ' ');
        if (productName.toLowerCase().substring(0,range) === name.toLowerCase()) {
            return productImage;
        }
    }
    return searchProduct(productName, range-1);
}

for (let i = 0; i < products.length; ++i) {
    products[i].id = i+1;
    const types = products[i].type.split(' ').join('/').toLowerCase();
    // let imageName = searchProduct(products[i].name, 60);
    // products[i].image = `/static/img/${types}/${imageName}`;
}

const statistics = new Map();

for (let i = 0; i < products.length; ++i) {
    if (statistics.has(products[i].type)) {
        statistics.set(products[i].type, parseInt(statistics.get(products[i].type))+1);
    } else {
        statistics.set(products[i].type, 1);
    }
}

console.log(statistics);

// importing the fs module
const fs = require("fs");

// converting the JSON object to a string
const data = JSON.stringify(products, null, 2);

// writing the JSON string content to a file
fs.writeFile("./products.json", data, (error) => {
    // throwing the error
    // in case of a writing problem
    if (error) {
        // logging the error
        console.error(error);

        throw error;
    }

    console.log("products.json written correctly");
});