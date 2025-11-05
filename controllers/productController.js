const Product = require('../models/productModel');

const createProduct = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || !price || !description) {
            return res.status(422).json({ success: false, msg: "Nome e preço do produto são obrigatórios" });
        }

        const newProduct = await Product.create({ name, price, description, createdBy: req.user._id });
        return res.status(201).json(newProduct);

    } catch (err) {
        console.error('Create product error:', err)
        return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
    }
};

module.exports = {
    createProduct
};
