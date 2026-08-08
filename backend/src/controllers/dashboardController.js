const pool = require('../config/db');

async function obterResumo(req, res) {
  try {
    const [[totalAlunos]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM alunos
    `);

    const [[alunosAtivos]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM alunos
      WHERE status = 'ATIVO'
    `);

    const [[alunosInativos]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM alunos
      WHERE status = 'INATIVO'
    `);

    const [[totalDocumentos]] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM documentos
    `);

    return res.json({
      alunos: {
        total: totalAlunos.total,
        ativos: alunosAtivos.total,
        inativos: alunosInativos.total
      },
      documentos: {
        total: totalDocumentos.total
      }
    });

  } catch (error) {
    console.error(
      'Erro ao carregar resumo do dashboard:',
      error
    );

    return res.status(500).json({
      message:
        'Erro interno ao carregar o dashboard.'
    });
  }
}

module.exports = {
  obterResumo
};