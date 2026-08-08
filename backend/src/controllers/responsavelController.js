const pool = require('../config/db');

async function criarResponsavel(req, res) {
    try {
        const { alunoId } = req.params;

        const {
            nome,
            tipo,
            cpf,
            telefone,
            email,
            parentesco
        } = req.body;

        if (!nome || !tipo) {
            return res.status(400).json({
                message: 'Nome e tipo do responsável são obrigatórios.'
            });
        }

        const tiposValidos = [
            'PAI',
            'MAE',
            'RESPONSAVEL_LEGAL',
            'OUTRO'
        ];

        if (!tiposValidos.includes(tipo)) {
            return res.status(400).json({
                message: 'Tipo de responsável inválido.'
            });
        }

        const [alunos] = await pool.query(
            'SELECT id FROM alunos WHERE id = ? LIMIT 1',
            [alunoId]
        );

        if (alunos.length === 0) {
            return res.status(404).json({
                message: 'Aluno não encontrado.'
            });
        }

        const [resultado] = await pool.query(
            `INSERT INTO responsaveis (
                aluno_id,
                nome,
                tipo,
                cpf,
                telefone,
                email,
                parentesco
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                alunoId,
                nome,
                tipo,
                cpf || null,
                telefone || null,
                email || null,
                parentesco || null
            ]
        );

        const [responsavel] = await pool.query(
            `SELECT
                id,
                aluno_id,
                nome,
                tipo,
                cpf,
                telefone,
                email,
                parentesco,
                created_at
             FROM responsaveis
             WHERE id = ?`,
            [resultado.insertId]
        );

        return res.status(201).json({
            message: 'Responsável cadastrado com sucesso.',
            responsavel: responsavel[0]
        });

    } catch (error) {
        console.error('Erro ao cadastrar responsável:', error);

        return res.status(500).json({
            message: 'Erro interno ao cadastrar responsável.'
        });
    }
}

async function listarResponsaveis(req, res) {
    try {
        const { alunoId } = req.params;

        const [responsaveis] = await pool.query(
            `SELECT
                id,
                aluno_id,
                nome,
                tipo,
                cpf,
                telefone,
                email,
                parentesco,
                created_at
             FROM responsaveis
             WHERE aluno_id = ?
             ORDER BY nome ASC`,
            [alunoId]
        );

        return res.json({
            total: responsaveis.length,
            responsaveis
        });

    } catch (error) {
        console.error('Erro ao listar responsáveis:', error);

        return res.status(500).json({
            message: 'Erro interno ao listar responsáveis.'
        });
    }
}

module.exports = {
    criarResponsavel,
    listarResponsaveis
};