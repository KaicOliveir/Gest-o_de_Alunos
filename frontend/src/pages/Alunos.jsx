import { useEffect, useState } from 'react';
import {
  Search,
  UserPlus,
  Users,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import './Alunos.css';

function Alunos() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarAlunos();
  }, []);

  async function carregarAlunos() {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get('/api/alunos');

      setAlunos(response.data.alunos || []);

    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
        'Não foi possível carregar os alunos.'
      );

    } finally {
      setCarregando(false);
    }
  }

  const alunosFiltrados = alunos.filter((aluno) => {
    const termo = busca.toLowerCase();

    return (
      aluno.nome?.toLowerCase().includes(termo) ||
      aluno.cpf?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="alunos-page">

      <div className="alunos-header">

        <div>
          <button
            className="back-button"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h1>Alunos</h1>

          <p>
            Consulte e gerencie os alunos cadastrados.
          </p>
        </div>

        <button
          className="novo-aluno-button"
          onClick={() => navigate('/alunos/novo')}
        >
          <UserPlus size={20} />
          Cadastrar aluno
        </button>

      </div>

      <div className="alunos-card">

        <div className="alunos-toolbar">

          <div className="search-box">
            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por nome ou CPF"
              value={busca}
              onChange={(event) =>
                setBusca(event.target.value)
              }
            />
          </div>

          <div className="total-alunos">
            <Users size={18} />

            {alunosFiltrados.length} aluno(s)
          </div>

        </div>

        {carregando && (
          <div className="alunos-status">
            Carregando alunos...
          </div>
        )}

        {erro && (
          <div className="alunos-error">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          alunosFiltrados.length === 0 && (
            <div className="alunos-empty">
              Nenhum aluno encontrado.
            </div>
          )}

        {!carregando &&
          !erro &&
          alunosFiltrados.length > 0 && (
            <div className="alunos-table-wrapper">

              <table className="alunos-table">

                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Telefone</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {alunosFiltrados.map((aluno) => (
                    <tr key={aluno.id}>

                      <td>
                        <strong>
                          {aluno.nome}
                        </strong>
                      </td>

                      <td>
                        {aluno.cpf}
                      </td>

                      <td>
                        {aluno.telefone || '-'}
                      </td>

                      <td>
                        {aluno.cidade
                          ? `${aluno.cidade}${
                              aluno.estado
                                ? ` - ${aluno.estado}`
                                : ''
                            }`
                          : '-'
                        }
                      </td>

                      <td>
                        <span
                          className={
                            aluno.status === 'ATIVO'
                              ? 'status status-ativo'
                              : 'status status-inativo'
                          }
                        >
                          {aluno.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="ver-aluno-button"
                          onClick={() =>
                            navigate(`/alunos/${aluno.id}`)
                          }
                        >
                          Ver cadastro
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

      </div>

    </div>
  );
}

export default Alunos;