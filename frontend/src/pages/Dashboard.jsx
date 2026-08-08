import {
  useEffect,
  useState
} from 'react';

import {
  Users,
  FileText,
  UserPlus,
  Search,
  UserCheck,
  UserX
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [resumo, setResumo] = useState({
    alunos: {
      total: 0,
      ativos: 0,
      inativos: 0
    },

    documentos: {
      total: 0
    }
  });

  const [
    carregandoResumo,
    setCarregandoResumo
  ] = useState(true);

  const usuarioSalvo =
    localStorage.getItem('usuario');

  const usuario = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  useEffect(() => {
    carregarResumo();
  }, []);

  async function carregarResumo() {
    try {
      setCarregandoResumo(true);

      const response = await api.get(
        '/api/dashboard/resumo'
      );

      setResumo(response.data);

    } catch (error) {
      console.error(
        'Erro ao carregar dashboard:',
        error
      );

    } finally {
      setCarregandoResumo(false);
    }
  }

  return (
    <div className="dashboard-content">

      <header className="dashboard-header">

        <div>

          <h1>
            Olá, {usuario?.nome || 'Usuário'}!
          </h1>

          <p>
            Bem-vindo ao Sistema de Gestão de Alunos.
          </p>

        </div>

      </header>

      <section className="dashboard-cards">

        <div className="info-card">

          <div className="info-card-icon">
            <Users size={26} />
          </div>

          <div>
            <span>
              Alunos cadastrados
            </span>

            <strong>
              {carregandoResumo
                ? '...'
                : resumo.alunos.total
              }
            </strong>
          </div>

        </div>

        <div className="info-card">

          <div className="info-card-icon">
            <UserCheck size={26} />
          </div>

          <div>
            <span>
              Alunos ativos
            </span>

            <strong>
              {carregandoResumo
                ? '...'
                : resumo.alunos.ativos
              }
            </strong>
          </div>

        </div>

        <div className="info-card">

          <div className="info-card-icon gray">
            <UserX size={26} />
          </div>

          <div>
            <span>
              Alunos inativos
            </span>

            <strong>
              {carregandoResumo
                ? '...'
                : resumo.alunos.inativos
              }
            </strong>
          </div>

        </div>

        <div className="info-card">

          <div className="info-card-icon yellow">
            <FileText size={26} />
          </div>

          <div>
            <span>
              Documentos
            </span>

            <strong>
              {carregandoResumo
                ? '...'
                : resumo.documentos.total
              }
            </strong>
          </div>

        </div>

      </section>

      <section className="quick-actions">

        <div className="section-title">

          <h2>
            Ações rápidas
          </h2>

          <p>
            Acesse as principais funções do sistema.
          </p>

        </div>

        <div className="quick-actions-grid">

          <button
            type="button"
            className="action-card"
            onClick={() =>
              navigate('/alunos/novo')
            }
          >
            <UserPlus size={28} />

            <div>
              <strong>
                Cadastrar aluno
              </strong>

              <span>
                Adicionar um novo aluno
              </span>
            </div>

          </button>

          <button
            type="button"
            className="action-card"
            onClick={() =>
              navigate('/alunos')
            }
          >
            <Search size={28} />

            <div>
              <strong>
                Buscar aluno
              </strong>

              <span>
                Consultar alunos cadastrados
              </span>
            </div>

          </button>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;