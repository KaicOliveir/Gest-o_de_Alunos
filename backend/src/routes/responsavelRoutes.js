const express = require('express');

const {
    criarResponsavel,
    listarResponsaveis
} = require('../controllers/responsavelController');

const autenticarToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
    '/alunos/:alunoId/responsaveis',
    autenticarToken,
    criarResponsavel
);

router.get(
    '/alunos/:alunoId/responsaveis',
    autenticarToken,
    listarResponsaveis
);

module.exports = router;