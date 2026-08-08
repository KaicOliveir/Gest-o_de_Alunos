const express = require('express');
const autenticarToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/perfil', autenticarToken, (req, res) => {
    res.json({
        message: 'Você está autenticado!',
        usuario: req.usuario
    });
});

module.exports = router;