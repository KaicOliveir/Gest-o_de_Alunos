const express = require('express');

const {
  listarUsuarios,
  criarUsuario,
  inativarUsuario,
  reativarUsuario
} = require('../controllers/usuarioController');

const autenticarToken =
  require('../middleware/authMiddleware');

const somenteAdmin =
  require('../middleware/adminMiddleware');

const router = express.Router();

router.get(
  '/',
  autenticarToken,
  somenteAdmin,
  listarUsuarios
);

router.post(
  '/',
  autenticarToken,
  somenteAdmin,
  criarUsuario
);

router.delete(
  '/:id',
  autenticarToken,
  somenteAdmin,
  inativarUsuario
);

router.patch(
  '/:id/reativar',
  autenticarToken,
  somenteAdmin,
  reativarUsuario
);

module.exports = router;