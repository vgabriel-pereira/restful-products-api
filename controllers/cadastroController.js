const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const user = require('../models/userModels')

async function cadastro(req, res) {
    try {
        console.log('REQ BODY:', req.body)
        const { nome, email, password } = req.body

        if (!nome || !email || !password) return res.status(400).json({msg: 'Campos obrigatórios faltando' })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const novoUsuario = await user.create({ nome: nome, email: email, password: hashPassword })
        const { password: _, ...usuarioSemSenha } = novoUsuario.toObject()
        return res.status(201).json(usuarioSemSenha)
    } catch (err) {
        console.error(err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(409).json({ msg: "Email já cadastrado" });
        }
        return res.status(500).json({msg: "Erro ao criar usuário" })
    }
}

module.exports = { cadastro }