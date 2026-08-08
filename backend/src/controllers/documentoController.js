const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

async function uploadDocumento(req, res) {
    try {
        const { alunoId } = req.params;

        if (!req.file) {
            return res.status(400).json({
                message: 'Nenhum arquivo foi enviado.'
            });
        }

        const {
            tipo_documento
        } = req.body;

        if (!tipo_documento) {
            return res.status(400).json({
                message: 'O tipo do documento é obrigatório.'
            });
        }

        const tiposValidos = [
            'CPF',
            'RG',
            'CERTIDAO_NASCIMENTO',
            'COMPROVANTE_RESIDENCIA',
            'DOCUMENTO_RESPONSAVEL',
            'OUTRO'
        ];

        if (!tiposValidos.includes(tipo_documento)) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message: 'Tipo de documento inválido.'
            });
        }

        const [alunos] = await pool.query(
            'SELECT id FROM alunos WHERE id = ? LIMIT 1',
            [alunoId]
        );

        if (alunos.length === 0) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                message: 'Aluno não encontrado.'
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO documentos (
                aluno_id,
                tipo_documento,
                nome_original,
                nome_armazenado,
                caminho_arquivo,
                mime_type,
                tamanho_bytes,
                enviado_por
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                alunoId,
                tipo_documento,
                req.file.originalname,
                req.file.filename,
                req.file.path,
                req.file.mimetype,
                req.file.size,
                req.usuario.id
            ]
        );

        return res.status(201).json({
            message: 'Documento enviado com sucesso.',
            documento: {
                id: resultado.insertId,
                aluno_id: Number(alunoId),
                tipo_documento,
                nome_original: req.file.originalname,
                tamanho_bytes: req.file.size
            }
        });

    } catch (error) {
        console.error('Erro ao enviar documento:', error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
            message: 'Erro interno ao enviar documento.'
        });
    }
}

async function excluirDocumento(req, res) {
  try {
    const { id } = req.params;

    const [documentos] = await pool.query(
      `
      SELECT
        id,
        caminho_arquivo
      FROM documentos
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (documentos.length === 0) {
      return res.status(404).json({
        message: 'Documento não encontrado.'
      });
    }

    const documento = documentos[0];

    if (
      documento.caminho_arquivo &&
      fs.existsSync(documento.caminho_arquivo)
    ) {
      fs.unlinkSync(documento.caminho_arquivo);
    }

    await pool.query(
      `
      DELETE FROM documentos
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      message: 'Documento excluído com sucesso.'
    });

  } catch (error) {
    console.error(
      'Erro ao excluir documento:',
      error
    );

    return res.status(500).json({
      message:
        'Erro interno ao excluir documento.'
    });
  }
}

async function listarDocumentos(req, res) {
    try {
        const { alunoId } = req.params;

        const [documentos] = await pool.query(
            `SELECT
                id,
                aluno_id,
                tipo_documento,
                nome_original,
                mime_type,
                tamanho_bytes,
                enviado_por,
                created_at
             FROM documentos
             WHERE aluno_id = ?
             ORDER BY created_at DESC`,
            [alunoId]
        );

        return res.json({
            total: documentos.length,
            documentos
        });

    } catch (error) {
        console.error('Erro ao listar documentos:', error);

        return res.status(500).json({
            message: 'Erro interno ao listar documentos.'
        });
    }
}

async function visualizarDocumento(req, res) {
    try {
        const { id } = req.params;

        const [documentos] = await pool.query(
            `SELECT
                id,
                aluno_id,
                nome_original,
                caminho_arquivo,
                mime_type
             FROM documentos
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (documentos.length === 0) {
            return res.status(404).json({
                message: 'Documento não encontrado.'
            });
        }

        const documento = documentos[0];

        if (!fs.existsSync(documento.caminho_arquivo)) {
            return res.status(404).json({
                message: 'Arquivo não encontrado no armazenamento.'
            });
        }

        res.setHeader(
            'Content-Type',
            documento.mime_type || 'application/octet-stream'
        );

        res.setHeader(
            'Content-Disposition',
            `inline; filename="${encodeURIComponent(documento.nome_original)}"`
        );

        return res.sendFile(
            path.resolve(documento.caminho_arquivo)
        );

    } catch (error) {
        console.error('Erro ao visualizar documento:', error);

        return res.status(500).json({
            message: 'Erro interno ao visualizar documento.'
        });
    }
}

async function listarTodosDocumentos(req, res) {
  try {
    const [documentos] = await pool.query(`
      SELECT
        documentos.id,
        documentos.aluno_id,
        documentos.tipo_documento,
        documentos.nome_original,
        documentos.mime_type,
        documentos.tamanho_bytes,
        documentos.created_at,
        alunos.nome AS aluno_nome,
        alunos.cpf AS aluno_cpf
      FROM documentos
      INNER JOIN alunos
        ON alunos.id = documentos.aluno_id
      ORDER BY documentos.created_at DESC
    `);

    return res.json({
      total: documentos.length,
      documentos
    });

  } catch (error) {
    console.error(
      'Erro ao listar documentos:',
      error
    );

    return res.status(500).json({
      message:
        'Erro interno ao listar documentos.'
    });
  }
}

module.exports = {
  uploadDocumento,
  listarDocumentos,
  listarTodosDocumentos,
  visualizarDocumento,
  excluirDocumento
};