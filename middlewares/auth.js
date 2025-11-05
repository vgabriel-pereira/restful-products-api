const jwt = require('jsonwebtoken');
const User = require('../models/userModels');

module.exports = async function auth(req, res, next) {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        console.error('Auth error: JWT_SECRET não definido no ambiente')
        return res.status(500).json({ success: false, message: 'Configuração do servidor incorreta' })
    }

    const authHeader = req.headers.authorization
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : authHeader

    if (!token) {
        return res.status(401).json({ success: false, error: 'Token não fornecido' })
    }

    try {
        const payload = jwt.verify(token, secret)

        if (!payload || !payload.id) {
            return res.status(401).json({ success: false, error: 'Token inválido' })
        }
        const user = await User.findById(payload.id).select('-password')
        if (!user) {
            return res.status(401).json({ success: false, error: 'Usuário não encontrado' })
        }

        req.user = user
        next()
    } catch (err) {
        console.error('Auth verify error:', err.message || err)
        return res.status(401).json({ success: false, error: 'Token inválido ou expirado' })
    }
};