const express = require('express');

const {
  obterResumo
} = require('../controllers/dashboardController');

const autenticarToken =
  require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/resumo',
  autenticarToken,
  obterResumo
);

module.exports = router;