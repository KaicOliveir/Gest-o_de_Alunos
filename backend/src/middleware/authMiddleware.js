const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token de acesso não informado.'
        });
    }

    const partes = authHeader.split(' ');

    if (partes.length !== 2 || partes[0] !== 'Bearer') {
        return res.status(401).json({
            message: 'Formato de token inválido.'
        });
    }

    const token = partes[1];

    try {
        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Token inválido ou expirado.'
        });
    }
}

module.exports = autenticarToken;