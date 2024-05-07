const products = require('../data/products.json');

exports.getProducts = (req, res) => {
    res.status(200).json({
        status: 'success',
        response: products
    });
};

exports.getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        res.status(404).json({
            status: 'error',
            message: 'Id not found.',
        });
        return;
    }
    for (const product of products) {
        if (product.id === id) {
            res.status(200).json({
                status: 'success',
                response: product
            });
            return;
        }
    }
    res.status(404).json({
        status: 'error',
        message: 'Product not found.',
    });
};

exports.getProductsByType = (req, res) => {
    let type = req.url.query.get('category');
    const typeList = type.split('>');
    for (const i in typeList) {
        typeList[i] = typeList[i].charAt(0).toUpperCase() + typeList[i].substring(1).toLowerCase();
    }
    type = typeList.join(' ');
    const result = [];
    products.forEach(product => {
        if (product.type === type) {
            result.push(product);
        }
    });
    res.status(200).json({
        status: 'success',
        response: result
    })
};