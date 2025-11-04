const jwt = require('jsonwebtoken');

// /middlewares/auth.js

/**
 * Middleware de autenticação JWT para Express.
 * Usa process.env.JWT_SECRET como segredo.
 * Aceita token em:
 *  - header Authorization: "Bearer <token>"
 *  - req.cookies.token (se cookie-parser estiver configurado)
 */
module.exports = function auth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const cookieToken = req.cookies && req.cookies.token;
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : (authHeader || cookieToken);

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // anexar dados do usuário/claim ao req
        req.user = payload;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
};