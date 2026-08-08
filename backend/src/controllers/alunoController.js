const pool = require('../config/db');

async function criarAluno(req, res) {
    try {
        const {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep
        } = req.body;

        // Validações básicas
        if (!nome || !cpf || !data_nascimento) {
            return res.status(400).json({
                message: 'Nome, CPF e data de nascimento são obrigatórios.'
            });
        }

        // Verificar se CPF já existe
        const [alunoExistente] = await pool.query(
            'SELECT id FROM alunos WHERE cpf = ? LIMIT 1',
            [cpf]
        );

        if (alunoExistente.length > 0) {
            return res.status(409).json({
                message: 'Já existe um aluno cadastrado com este CPF.'
            });
        }

        // Cadastrar aluno
        const [resultado] = await pool.query(
            `INSERT INTO alunos (
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                criado_por
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome,
                cpf,
                data_nascimento,
                telefone || null,
                email || null,
                endereco || null,
                numero || null,
                complemento || null,
                bairro || null,
                cidade || null,
                estado || null,
                cep || null,
                req.usuario.id
            ]
        );

        const [novoAluno] = await pool.query(
            `SELECT
                id,
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                status,
                criado_por,
                created_at
             FROM alunos
             WHERE id = ?`,
            [resultado.insertId]
        );

        return res.status(201).json({
            message: 'Aluno cadastrado com sucesso.',
            aluno: novoAluno[0]
        });

    } catch (error) {
        console.error('Erro ao cadastrar aluno:', error);

        return res.status(500).json({
            message: 'Erro interno ao cadastrar aluno.'
        });
    }
}

async function listarAlunos(req, res) {
    try {
        const [alunos] = await pool.query(`
            SELECT
                id,
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                cidade,
                estado,
                status,
                created_at
            FROM alunos
            ORDER BY nome ASC
        `);

        return res.json({
            total: alunos.length,
            alunos
        });

    } catch (error) {
        console.error('Erro ao listar alunos:', error);

        return res.status(500).json({
            message: 'Erro interno ao listar alunos.'
        });
    }
}

async function buscarAlunoPorId(req, res) {
    try {
        const { id } = req.params;

        const [alunos] = await pool.query(
            `SELECT
                id,
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                status,
                criado_por,
                created_at,
                updated_at
             FROM alunos
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (alunos.length === 0) {
            return res.status(404).json({
                message: 'Aluno não encontrado.'
            });
        }

        return res.json({
            aluno: alunos[0]
        });

    } catch (error) {
        console.error('Erro ao buscar aluno:', error);

        return res.status(500).json({
            message: 'Erro interno ao buscar aluno.'
        });
    }
}

async function atualizarAluno(req, res) {
    try {
        const { id } = req.params;

        const {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            endereco,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            cep
        } = req.body;

        if (!nome || !cpf || !data_nascimento) {
            return res.status(400).json({
                message: 'Nome, CPF e data de nascimento são obrigatórios.'
            });
        }

        // Verifica se o aluno existe
        const [alunoExistente] = await pool.query(
            'SELECT id FROM alunos WHERE id = ? LIMIT 1',
            [id]
        );

        if (alunoExistente.length === 0) {
            return res.status(404).json({
                message: 'Aluno não encontrado.'
            });
        }

        // Verifica se outro aluno possui o mesmo CPF
        const [cpfExistente] = await pool.query(
            'SELECT id FROM alunos WHERE cpf = ? AND id <> ? LIMIT 1',
            [cpf, id]
        );

        if (cpfExistente.length > 0) {
            return res.status(409).json({
                message: 'Este CPF já pertence a outro aluno.'
            });
        }

        await pool.query(
            `UPDATE alunos SET
                nome = ?,
                cpf = ?,
                data_nascimento = ?,
                telefone = ?,
                email = ?,
                endereco = ?,
                numero = ?,
                complemento = ?,
                bairro = ?,
                cidade = ?,
                estado = ?,
                cep = ?
             WHERE id = ?`,
            [
                nome,
                cpf,
                data_nascimento,
                telefone || null,
                email || null,
                endereco || null,
                numero || null,
                complemento || null,
                bairro || null,
                cidade || null,
                estado || null,
                cep || null,
                id
            ]
        );

        const [alunoAtualizado] = await pool.query(
            `SELECT
                id,
                nome,
                cpf,
                data_nascimento,
                telefone,
                email,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
                cep,
                status,
                criado_por,
                created_at,
                updated_at
             FROM alunos
             WHERE id = ?`,
            [id]
        );

        return res.json({
            message: 'Aluno atualizado com sucesso.',
            aluno: alunoAtualizado[0]
        });

    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);

        return res.status(500).json({
            message: 'Erro interno ao atualizar aluno.'
        });
    }
}
async function inativarAluno(req, res) {
    try {
        const { id } = req.params;

        const [resultado] = await pool.query(
            `UPDATE alunos
             SET status = 'INATIVO'
             WHERE id = ?
             AND status = 'ATIVO'`,
            [id]
        );

        if (resultado.affectedRows === 0) {
            const [aluno] = await pool.query(
                'SELECT id, status FROM alunos WHERE id = ? LIMIT 1',
                [id]
            );

            if (aluno.length === 0) {
                return res.status(404).json({
                    message: 'Aluno não encontrado.'
                });
            }

            return res.status(400).json({
                message: 'O aluno já está inativo.'
            });
        }

        return res.json({
            message: 'Aluno inativado com sucesso.'
        });

    } catch (error) {
        console.error('Erro ao inativar aluno:', error);

        return res.status(500).json({
            message: 'Erro interno ao inativar aluno.'
        });
    }
}

async function reativarAluno(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await pool.query(
      `UPDATE alunos
       SET status = 'ATIVO'
       WHERE id = ?
       AND status = 'INATIVO'`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      const [aluno] = await pool.query(
        'SELECT id, status FROM alunos WHERE id = ? LIMIT 1',
        [id]
      );

      if (aluno.length === 0) {
        return res.status(404).json({
          message: 'Aluno não encontrado.'
        });
      }

      return res.status(400).json({
        message: 'O aluno já está ativo.'
      });
    }

    return res.json({
      message: 'Aluno reativado com sucesso.'
    });

  } catch (error) {
    console.error('Erro ao reativar aluno:', error);

    return res.status(500).json({
      message: 'Erro interno ao reativar aluno.'
    });
  }
}

module.exports = {
    criarAluno,
    listarAlunos,
    buscarAlunoPorId,
    atualizarAluno,
    inativarAluno,
    reativarAluno
};