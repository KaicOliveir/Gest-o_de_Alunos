const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        message: 'E-mail e senha são obrigatórios.'
      });
    }

    const [usuarios] = await pool.query(
      `
      SELECT
        id,
        nome,
        email,
        senha_hash,
        perfil,
        ativo
      FROM usuarios
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        message: 'E-mail ou senha inválidos.'
      });
    }

    const usuario = usuarios[0];

    if (!usuario.ativo) {
      return res.status(403).json({
        message:
          'Usuário inativo. Procure um administrador.'
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaValida) {
      return res.status(401).json({
        message: 'E-mail ou senha inválidos.'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    return res.json({
      message: 'Login realizado com sucesso.',

      token,

      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        ativo: Boolean(usuario.ativo)
      }
    });

  } catch (error) {
    console.error(
      'Erro no login:',
      error
    );

    return res.status(500).json({
      message: 'Erro interno do servidor.'
    });
  }
}

module.exports = {
  login
};