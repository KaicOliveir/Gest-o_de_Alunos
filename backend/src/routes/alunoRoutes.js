const express = require('express');

const {
  criarAluno,
  listarAlunos,
  buscarAlunoPorId,
  atualizarAluno,
  inativarAluno,
  reativarAluno
} = require('../controllers/alunoController');

const autenticarToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', autenticarToken, criarAluno);
router.get('/', autenticarToken, listarAlunos);
router.get('/:id', autenticarToken, buscarAlunoPorId);
router.put('/:id', autenticarToken, atualizarAluno);
router.delete('/:id', autenticarToken, inativarAluno);
router.patch('/:id/reativar', autenticarToken,reativarAluno);

module.exports = router;