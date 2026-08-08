const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  uploadDocumento,
  listarDocumentos,
  listarTodosDocumentos,
  visualizarDocumento,
  excluirDocumento
} = require('../controllers/documentoController');

const autenticarToken = require('../middleware/authMiddleware');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const alunoId = req.params.alunoId;

    const pasta = path.join(
      __dirname,
      '..',
      '..',
      'uploads',
      'alunos',
      alunoId
    );

    fs.mkdirSync(pasta, {
      recursive: true
    });

    cb(null, pasta);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nome =
      `${Date.now()}-${Math.round(Math.random() * 1E9)}${extensao}`;

    cb(null, nome);
  }
});

const upload = multer({
  storage,

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


// LISTAR TODOS OS DOCUMENTOS
router.get(
  '/documentos',
  autenticarToken,
  listarTodosDocumentos
);


// ENVIAR DOCUMENTO PARA UM ALUNO
router.post(
  '/alunos/:alunoId/documentos',
  autenticarToken,
  upload.single('documento'),
  uploadDocumento
);


// LISTAR DOCUMENTOS DE UM ALUNO
router.get(
  '/alunos/:alunoId/documentos',
  autenticarToken,
  listarDocumentos
);


// VISUALIZAR ARQUIVO PROTEGIDO
router.get(
  '/documentos/:id/arquivo',
  autenticarToken,
  visualizarDocumento
);

// EXCLUIR DOCUMENTOS
router.delete(
  '/documentos/:id',
  autenticarToken,
  excluirDocumento
);


module.exports = router;