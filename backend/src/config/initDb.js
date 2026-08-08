const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function initDatabase() {
    try {
        const schemaPath = path.join(
            __dirname,
            '..',
            '..',
            '..',
            'database',
            'schema.sql'
        );

        const schema = fs.readFileSync(schemaPath, 'utf8');

        const connection = await pool.getConnection();

        await connection.query({
            sql: schema,
            values: []
        });

        connection.release();

        console.log('Banco de dados inicializado com sucesso!');
    } catch (error) {
        console.error('Erro ao inicializar banco:', error);
    } finally {
        await pool.end();
    }
}

initDatabase();