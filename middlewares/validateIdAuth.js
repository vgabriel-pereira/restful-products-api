const mongoose = require('mongoose');
const User = require('../models/userModels');

async function validateId(req, res, next) {
 try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ msg: "Parâmetro inválido" });
    const usuarioEncontrado = await User.findOne({ _id: id });
    req.user = usuarioEncontrado;
    if (!usuarioEncontrado)
      return res.status(404).json({ msg: "Usuário não encontrado" });
    next();
  } catch (err) {
    console.error('Validate ID error:', err);
    return res.status(500).json({ success: false, msg: "Erro interno do servidor" });
  }
}

module.exports = validateId;