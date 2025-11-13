const { mongo } = require('mongoose');
const Product = require('../models/productModel');

async function createProduct(req, res) {
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
}

async function getProducts(req, res) {
    try {
        const products = await Product.find();
        return res.status(200).json(products);
    } catch (err) {
        console.error('Get products error:', err)
        return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
    }
}

async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findOne({ _id: id });
        return res.status(200).json(product);

    } catch (err) {
        console.error('Get product by ID error:', err)
        return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
    }
}

async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;

        

        if (!name || !price) {
            return res.status(422).json({ msg: "Nome e preço do produto são obrigatórios" });
        }

        const product = await Product.findOneAndUpdate(
            { _id: id },
            { name, price, description },
            { new: true }
        );

        return res.status(200).json(product);

    } catch (err) {
        if (err instanceof mongo.MongoError && err.code === 11000) {
            return res.status(409).json({ success: false, msg: "Conflito de dados ao atualizar o produto" });
        }
        console.error('Update product error:', err);
        return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
    }
}

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        await Product.deleteOne({ _id: id });
        return res.status(204).send();
    } catch (err) {
        console.error('Delete product error:', err);
        return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
