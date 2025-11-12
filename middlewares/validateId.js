const mongoose = require('mongoose');
const Produtos = require('../models/productModel');

async function validateId(req, res, next) {
 try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Parâmetro inválido" });
    const produtoEncontrado = await Produtos.findOne({ _id: id });
    req.produto = produtoEncontrado;
    if (!produtoEncontrado)
      return res.status(404).json({ msg: "Produto não encontrado" });
    next();
  } catch (err) {
    console.error('Validate ID error:', err);
    return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
  }
}

module.exports = validateId;