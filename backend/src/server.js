const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const responsavelRoutes = require('./routes/responsavelRoutes');
const documentoRoutes = require('./routes/documentoRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'API do Sistema de Alunos funcionando!'
    });
});

app.use('/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api', responsavelRoutes);
app.use('/api', documentoRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/usuarios', usuarioRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});