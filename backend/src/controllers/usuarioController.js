const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function listarUsuarios(req, res) {
  try {
    const [usuarios] = await pool.query(`
      SELECT
        id,
        nome,
        email,
        perfil,
        ativo,
        created_at,
        updated_at
      FROM usuarios
      ORDER BY nome ASC
    `);

    const usuariosFormatados = usuarios.map((usuario) => ({
      ...usuario,
      ativo: Boolean(usuario.ativo),
      status: usuario.ativo ? 'ATIVO' : 'INATIVO'
    }));

    return res.json({
      total: usuariosFormatados.length,
      usuarios: usuariosFormatados
    });

  } catch (error) {
    console.error('Erro ao listar usuários:', error);

    return res.status(500).json({
      message: 'Erro interno ao listar usuários.'
    });
  }
}

async function criarUsuario(req, res) {
  try {
    let {
      nome,
      email,
      senha,
      perfil
    } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        message: 'Nome, e-mail, senha e perfil são obrigatórios.'
      });
    }

    nome = nome.trim();
    email = email.trim().toLowerCase();

    if (senha.length < 6) {
      return res.status(400).json({
        message: 'A senha deve possuir pelo menos 6 caracteres.'
      });
    }

    const perfisValidos = [
      'ADMIN',
      'OPERADOR'
    ];

    if (!perfisValidos.includes(perfil)) {
      return res.status(400).json({
        message: 'Perfil inválido.'
      });
    }

    const [emailExistente] = await pool.query(
      `
      SELECT id
      FROM usuarios
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (emailExistente.length > 0) {
      return res.status(409).json({
        message: 'Já existe um usuário com este e-mail.'
      });
    }

    const senhaHash = await bcrypt.hash(
      senha,
      10
    );

    const [resultado] = await pool.query(
      `
      INSERT INTO usuarios (
        nome,
        email,
        senha_hash,
        perfil,
        ativo
      )
      VALUES (?, ?, ?, ?, TRUE)
      `,
      [
        nome,
        email,
        senhaHash,
        perfil
      ]
    );

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',

      usuario: {
        id: resultado.insertId,
        nome,
        email,
        perfil,
        ativo: true,
        status: 'ATIVO'
      }
    });

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);

    return res.status(500).json({
      message: 'Erro interno ao cadastrar usuário.'
    });
  }
}

async function inativarUsuario(req, res) {
  try {
    const { id } = req.params;

    if (Number(id) === Number(req.usuario.id)) {
      return res.status(400).json({
        message: 'Você não pode inativar o próprio usuário.'
      });
    }

    const [resultado] = await pool.query(
      `
      UPDATE usuarios
      SET ativo = FALSE
      WHERE id = ?
      AND ativo = TRUE
      `,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado ou já está inativo.'
      });
    }

    return res.json({
      message: 'Usuário inativado com sucesso.'
    });

  } catch (error) {
    console.error('Erro ao inativar usuário:', error);

    return res.status(500).json({
      message: 'Erro interno ao inativar usuário.'
    });
  }
}

async function reativarUsuario(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(
      `
      UPDATE usuarios
      SET ativo = TRUE
      WHERE id = ?
      AND ativo = FALSE
      `,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        message: 'Usuário não encontrado ou já está ativo.'
      });
    }

    return res.json({
      message: 'Usuário reativado com sucesso.'
    });

  } catch (error) {
    console.error('Erro ao reativar usuário:', error);

    return res.status(500).json({
      message: 'Erro interno ao reativar usuário.'
    });
  }
}

module.exports = {
  listarUsuarios,
  criarUsuario,
  inativarUsuario,
  reativarUsuario
};