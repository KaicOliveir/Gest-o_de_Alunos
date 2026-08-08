const express = require('express');
const multer = require('multer');

const {
  uploadDocumento,
  listarDocumentos,
  listarTodosDocumentos,
  visualizarDocumento,
  excluirDocumento
} = require('../controllers/documentoController');

const autenticarToken =
  require('../middleware/authMiddleware');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      'application/pdf',
      'image/jpeg',
      'image/png'
    ];

    if (!tiposPermitidos.includes(file.mimetype)) {
      return cb(
        new Error(
          'Formato de arquivo não permitido. Use PDF, JPG ou PNG.'
        )
      );
    }

    cb(null, true);
  }
});

router.get(
  '/documentos',
  autenticarToken,
  listarTodosDocumentos
);

router.post(
  '/alunos/:alunoId/documentos',
  autenticarToken,
  upload.single('documento'),
  uploadDocumento
);

router.get(
  '/alunos/:alunoId/documentos',
  autenticarToken,
  listarDocumentos
);

router.get(
  '/documentos/:id/arquivo',
  autenticarToken,
  visualizarDocumento
);

router.delete(
  '/documentos/:id',
  autenticarToken,
  excluirDocumento
);

module.exports = router;