const path = require('path');
const crypto = require('crypto');

const pool = require('../config/db');
const supabase = require('../config/supabase');

const BUCKET =
  process.env.SUPABASE_BUCKET || 'documentos-alunos';


// =====================================================
// UPLOAD DE DOCUMENTO
// =====================================================

async function uploadDocumento(req, res) {
  let caminhoSupabase = null;

  try {
    const { alunoId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        message: 'Nenhum arquivo foi enviado.'
      });
    }

    const { tipo_documento } = req.body;

    if (!tipo_documento) {
      return res.status(400).json({
        message:
          'O tipo do documento é obrigatório.'
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
      return res.status(400).json({
        message: 'Tipo de documento inválido.'
      });
    }

    // Confere se o aluno existe
    const [alunos] = await pool.query(
      `
      SELECT id
      FROM alunos
      WHERE id = ?
      LIMIT 1
      `,
      [alunoId]
    );

    if (alunos.length === 0) {
      return res.status(404).json({
        message: 'Aluno não encontrado.'
      });
    }

    // Extensão original do arquivo
    const extensao = path.extname(
      req.file.originalname
    );

    // Nome único
    const nomeArmazenado =
      `${Date.now()}-${crypto.randomUUID()}${extensao}`;

    // Caminho dentro do bucket
    caminhoSupabase =
      `alunos/${alunoId}/${nomeArmazenado}`;

    // Envia para o Supabase Storage
    const { error: uploadError } =
      await supabase.storage
        .from(BUCKET)
        .upload(
          caminhoSupabase,
          req.file.buffer,
          {
            contentType: req.file.mimetype,
            upsert: false
          }
        );

    if (uploadError) {
      console.error(
        'Erro do Supabase no upload:',
        uploadError
      );

      return res.status(500).json({
        message:
          'Não foi possível armazenar o documento.'
      });
    }

    // Salva metadados no MySQL
    const [resultado] = await pool.query(
      `
      INSERT INTO documentos (
        aluno_id,
        tipo_documento,
        nome_original,
        nome_armazenado,
        caminho_arquivo,
        mime_type,
        tamanho_bytes,
        enviado_por
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        alunoId,
        tipo_documento,
        req.file.originalname,
        nomeArmazenado,
        caminhoSupabase,
        req.file.mimetype,
        req.file.size,
        req.usuario.id
      ]
    );

    return res.status(201).json({
      message:
        'Documento enviado com sucesso.',

      documento: {
        id: resultado.insertId,
        aluno_id: Number(alunoId),
        tipo_documento,
        nome_original:
          req.file.originalname,
        nome_armazenado:
          nomeArmazenado,
        caminho_arquivo:
          caminhoSupabase,
        mime_type:
          req.file.mimetype,
        tamanho_bytes:
          req.file.size
      }
    });

  } catch (error) {
    console.error(
      'Erro ao enviar documento:',
      error
    );

    // Se o upload chegou ao Supabase mas
    // o banco falhou, remove o arquivo
    // para não deixar objeto órfão.
    if (caminhoSupabase) {
      try {
        await supabase.storage
          .from(BUCKET)
          .remove([caminhoSupabase]);

      } catch (cleanupError) {
        console.error(
          'Erro ao limpar arquivo do Supabase:',
          cleanupError
        );
      }
    }

    return res.status(500).json({
      message:
        'Erro interno ao enviar documento.'
    });
  }
}


// =====================================================
// LISTAR DOCUMENTOS DE UM ALUNO
// =====================================================

async function listarDocumentos(req, res) {
  try {
    const { alunoId } = req.params;

    const [documentos] = await pool.query(
      `
      SELECT
        id,
        aluno_id,
        tipo_documento,
        nome_original,
        nome_armazenado,
        caminho_arquivo,
        mime_type,
        tamanho_bytes,
        enviado_por,
        created_at
      FROM documentos
      WHERE aluno_id = ?
      ORDER BY created_at DESC
      `,
      [alunoId]
    );

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


// =====================================================
// LISTAR TODOS OS DOCUMENTOS
// =====================================================

async function listarTodosDocumentos(req, res) {
  try {
    const [documentos] = await pool.query(
      `
      SELECT
        documentos.id,
        documentos.aluno_id,
        documentos.tipo_documento,
        documentos.nome_original,
        documentos.nome_armazenado,
        documentos.caminho_arquivo,
        documentos.mime_type,
        documentos.tamanho_bytes,
        documentos.created_at,

        alunos.nome AS aluno_nome,
        alunos.cpf AS aluno_cpf

      FROM documentos

      INNER JOIN alunos
        ON alunos.id = documentos.aluno_id

      ORDER BY documentos.created_at DESC
      `
    );

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


// =====================================================
// VISUALIZAR DOCUMENTO
// =====================================================

async function visualizarDocumento(req, res) {
  try {
    const { id } = req.params;

    const [documentos] = await pool.query(
      `
      SELECT
        id,
        aluno_id,
        nome_original,
        caminho_arquivo,
        mime_type

      FROM documentos

      WHERE id = ?

      LIMIT 1
      `,
      [id]
    );

    if (documentos.length === 0) {
      return res.status(404).json({
        message:
          'Documento não encontrado.'
      });
    }

    const documento = documentos[0];

    if (!documento.caminho_arquivo) {
      return res.status(404).json({
        message:
          'Caminho do documento não encontrado.'
      });
    }

    // Faz download diretamente do bucket privado
    const {
      data,
      error: downloadError
    } = await supabase.storage
      .from(BUCKET)
      .download(
        documento.caminho_arquivo
      );

    if (downloadError || !data) {
      console.error(
        'Erro ao baixar arquivo do Supabase:',
        downloadError
      );

      return res.status(404).json({
        message:
          'Arquivo não encontrado no armazenamento.'
      });
    }

    // Converte Blob para Buffer
    const arrayBuffer =
      await data.arrayBuffer();

    const buffer =
      Buffer.from(arrayBuffer);

    res.setHeader(
      'Content-Type',
      documento.mime_type ||
        'application/octet-stream'
    );

    res.setHeader(
      'Content-Disposition',
      `inline; filename="${encodeURIComponent(
        documento.nome_original
      )}"`
    );

    return res.send(buffer);

  } catch (error) {
    console.error(
      'Erro ao visualizar documento:',
      error
    );

    return res.status(500).json({
      message:
        'Erro interno ao visualizar documento.'
    });
  }
}


// =====================================================
// EXCLUIR DOCUMENTO
// =====================================================

async function excluirDocumento(req, res) {
  try {
    const { id } = req.params;

    const [documentos] = await pool.query(
      `
      SELECT
        id,
        caminho_arquivo,
        nome_original

      FROM documentos

      WHERE id = ?

      LIMIT 1
      `,
      [id]
    );

    if (documentos.length === 0) {
      return res.status(404).json({
        message:
          'Documento não encontrado.'
      });
    }

    const documento = documentos[0];

    if (documento.caminho_arquivo) {
      const {
        error: removeError
      } = await supabase.storage
        .from(BUCKET)
        .remove([
          documento.caminho_arquivo
        ]);

      if (removeError) {
        console.error(
          'Erro ao remover arquivo do Supabase:',
          removeError
        );

        return res.status(500).json({
          message:
            'Não foi possível excluir o arquivo do armazenamento.'
        });
      }
    }

    await pool.query(
      `
      DELETE FROM documentos
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      message:
        'Documento excluído com sucesso.'
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


module.exports = {
  uploadDocumento,
  listarDocumentos,
  listarTodosDocumentos,
  visualizarDocumento,
  excluirDocumento
};