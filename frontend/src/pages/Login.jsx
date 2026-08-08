import { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo.jpeg';
import api from '../services/api';

import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      const { token, usuario } = response.data;

      localStorage.setItem('token', token);

      localStorage.setItem(
        'usuario',
        JSON.stringify(usuario)
      );

      navigate('/dashboard');

    } catch (error) {
      console.error(error);

      const mensagem =
        error.response?.data?.message ||
        'Não foi possível realizar o login.';

      setErro(mensagem);

    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-page">

      <div className="login-circle login-circle-one" />
      <div className="login-circle login-circle-two" />

      <main className="login-card">

        <div className="login-logo-container">
          <img
            src={logo}
            alt="Logo do Centro Comunitário de Apoio e Articulação de Umburanas"
            className="login-logo"
          />
        </div>

        <div className="login-header">
          <h1>Sistema de Gestão de Alunos</h1>

          <p>
            Centro Comunitário de Apoio e Articulação de Umburanas
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {erro && (
            <div className="login-error">
              {erro}
            </div>
          )}

          <div className="form-group">

            <label htmlFor="email">
              E-mail
            </label>

            <div className="input-container">

              <Mail
                size={20}
                className="input-icon"
              />

              <input
                id="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />

            </div>
          </div>

          <div className="form-group">

            <label htmlFor="senha">
              Senha
            </label>

            <div className="input-container">

              <Lock
                size={20}
                className="input-icon"
              />

              <input
                id="senha"
                type={mostrarSenha ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                aria-label={
                  mostrarSenha
                    ? 'Ocultar senha'
                    : 'Mostrar senha'
                }
              >
                {mostrarSenha
                  ? <EyeOff size={20} />
                  : <Eye size={20} />
                }
              </button>

            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={carregando}
          >

            {carregando ? (
              <>
                <LoaderCircle
                  size={20}
                  className="loading-icon"
                />

                Entrando...
              </>
            ) : (
              'Entrar'
            )}

          </button>

        </form>

        <div className="login-security">
          Acesso restrito aos usuários autorizados
        </div>

        <footer className="login-footer">
          CCAAU • Sistema de Gestão de Alunos
        </footer>

      </main>

    </div>
  );
}

export default Login;