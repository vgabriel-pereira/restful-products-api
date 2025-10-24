const mongoose = require('mongoose')
const Users = require('../models/userModels')
const bcrypt = require('bcrypt')

async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) return res.status(422).json({ msg: "Usuario/Senha são obrigatórios" })

        const user = await Users.findOne({ email: email })
        if (!user) return res.status(401).json({ msg: "Usuario ou Senha Invalido" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch || !user) return res.status(401).json({ msg: "Usuario ou Senha Invalido" })

        return res.status(200).json({ msg: "Logado com sucesso" })
    } catch (err) {
        if (err.errors)
            return res
                .status(422)
                .json({ msg: "Nome e preço do produto são obrigatórios" });
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
}

module.exports = { login }