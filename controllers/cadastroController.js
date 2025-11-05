const bcrypt = require('bcrypt')
const User = require('../models/userModels')

async function cadastro(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) return res.status(400).json({ success: false, msg: 'Campos obrigatórios faltando' })

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        const novoUsuario = await User.create({ name: name, email: email, password: hashPassword })

        const { password: _, ...usuarioSemSenha } = novoUsuario.toObject()
        return res.status(201).json({ success: true, msg: 'Usuário criado', data: usuarioSemSenha })
    } catch (err) {
        console.error('Cadastro error:', err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            return res.status(409).json({ success: false, msg: "Email já cadastrado" });
        }
        return res.status(500).json({ success: false, msg: "Erro ao criar usuário" })
    }
}

module.exports = { cadastro }