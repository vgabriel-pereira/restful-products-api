const User = require('../models/userModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 

async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) return res.status(422).json({ success: false, msg: "Usuario/Senha são obrigatórios" })

        const user = await Users.findOne({ email: email }).select('+password')
        if (!user) return res.status(401).json({ success: false, msg: "Credenciais inválidas" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ success: false, msg: "Credenciais inválidas" })

        const userPayload = {
            id: user._id,
            name: user.name,
            email: user.email
        }

        const secret = process.env.JWT_SECRET
        if (!secret) {
            console.error('Login error: JWT_SECRET não definido no ambiente')
            return res.status(500).json({ success: false, message: 'Configuração do servidor incorreta' })
        }

        const token = jwt.sign(userPayload, secret, { expiresIn: '1h' })

        res.set('Authorization', `Bearer ${token}`)

        return res.status(200).json({
            success: true,
            message: "Logado com sucesso",
            data: {
                user: userPayload,
                token: token
            }
        })
    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ success: false, message: "Erro interno do servidor" });
    }
}

module.exports = { login }