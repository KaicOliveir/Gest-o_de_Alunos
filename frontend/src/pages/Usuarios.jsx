import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  UserPlus,
  UserCheck,
  UserX
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import './Usuarios.css';

function Usuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);

  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil: 'OPERADOR'
  });

  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get('/api/usuarios');

      setUsuarios(response.data.usuarios || []);

    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
        'Não foi possível carregar os usuários.'
      );

    } finally {
      setCarregando(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setNovoUsuario((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function cadastrarUsuario(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro('');

      await api.post(
        '/api/usuarios',
        novoUsuario
      );

      setNovoUsuario({
        nome: '',
        email: '',
        senha: '',
        perfil: 'OPERADOR'
      });

      setMostrarFormulario(false);

      await carregarUsuarios();

    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
        'Não foi possível cadastrar o usuário.'
      );

    } finally {
      setSalvando(false);
    }
  }

  async function inativarUsuario(id) {
    const confirmou = window.confirm(
      'Deseja inativar este usuário?'
    );

    if (!confirmou) {
      return;
    }

    try {
      await api.delete(`/api/usuarios/${id}`);

      await carregarUsuarios();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Não foi possível inativar o usuário.'
      );
    }
  }

  async function reativarUsuario(id) {
    const confirmou = window.confirm(
      'Deseja reativar este usuário?'
    );

    if (!confirmou) {
      return;
    }

    try {
      await api.patch(
        `/api/usuarios/${id}/reativar`
      );

      await carregarUsuarios();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        'Não foi possível reativar o usuário.'
      );
    }
  }

  return (
    <div className="usuarios-page">

      <header className="usuarios-header">

        <div>
          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate('/dashboard')
            }
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h1>Usuários</h1>

          <p>
            Gerencie os usuários autorizados a acessar o sistema.
          </p>
        </div>

        <button
          type="button"
          className="novo-usuario-button"
          onClick={() =>
            setMostrarFormulario(
              !mostrarFormulario
            )
          }
        >
          <UserPlus size={19} />
          Novo usuário
        </button>

      </header>

      {erro && (
        <div className="usuarios-error">
          {erro}
        </div>
      )}

      {mostrarFormulario && (
        <form
          className="usuario-form"
          onSubmit={cadastrarUsuario}
        >

          <div className="field field-wide">
            <label>Nome *</label>

            <input
              name="nome"
              value={novoUsuario.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>E-mail *</label>

            <input
              type="email"
              name="email"
              value={novoUsuario.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Senha *</label>

            <input
              type="password"
              name="senha"
              value={novoUsuario.senha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field">
            <label>Perfil *</label>

            <select
              name="perfil"
              value={novoUsuario.perfil}
              onChange={handleChange}
            >
              <option value="OPERADOR">
                Operador
              </option>

              <option value="ADMIN">
                Administrador
              </option>
            </select>
          </div>

          <div className="usuario-form-actions">

            <button
              type="button"
              className="cancel-button-small"
              onClick={() =>
                setMostrarFormulario(false)
              }
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="save-button-small"
              disabled={salvando}
            >
              {salvando
                ? 'Salvando...'
                : 'Cadastrar usuário'
              }
            </button>

          </div>

        </form>
      )}

      <section className="usuarios-card">

        {carregando ? (
          <div className="usuarios-status">
            Carregando usuários...
          </div>
        ) : (
          <div className="usuarios-table-wrapper">

            <table className="usuarios-table">

              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Perfil</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>

                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>

                    <td>
                      <strong>
                        {usuario.nome}
                      </strong>
                    </td>

                    <td>
                      {usuario.email}
                    </td>

                    <td>
                      <span className="perfil-badge">
                        {usuario.perfil}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          usuario.status === 'ATIVO'
                            ? 'status status-ativo'
                            : 'status status-inativo'
                        }
                      >
                        {usuario.status}
                      </span>
                    </td>

                    <td>
                      {usuario.status === 'ATIVO' ? (
                        <button
                          type="button"
                          className="usuario-inativar-button"
                          onClick={() =>
                            inativarUsuario(
                              usuario.id
                            )
                          }
                        >
                          <UserX size={16} />
                          Inativar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="usuario-reativar-button"
                          onClick={() =>
                            reativarUsuario(
                              usuario.id
                            )
                          }
                        >
                          <UserCheck size={16} />
                          Reativar
                        </button>
                      )}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </section>

    </div>
  );
}

export default Usuarios;