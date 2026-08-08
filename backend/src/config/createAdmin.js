const bcrypt = require('bcryptjs');
const pool = require('./db');

require('dotenv').config();

async function createAdmin() {
  const nome =
    process.env.ADMIN_NAME || 'Administrador';

  const email =
    process.env.ADMIN_EMAIL;

  const senha =
    process.env.ADMIN_PASSWORD;

  if (!email || !senha) {
    console.error(
      'ADMIN_EMAIL e ADMIN_PASSWORD precisam estar definidos no .env.'
    );

    process.exit(1);
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log(
        'Usuário administrador já existe.'
      );

      return;
    }

    const senhaHash =
      await bcrypt.hash(
        senha,
        12
      );

    await pool.query(
      `
      INSERT INTO usuarios
        (
          nome,
          email,
          senha_hash,
          perfil,
          ativo
        )
      VALUES (?, ?, ?, 'ADMIN', TRUE)
      `,
      [
        nome,
        email,
        senhaHash
      ]
    );

    console.log(
      'Administrador criado com sucesso!'
    );

    console.log(
      `E-mail: ${email}`
    );

  } catch (error) {
    console.error(
      'Erro ao criar administrador:',
      error
    );

  } finally {
    await pool.end();
  }
}

createAdmin();