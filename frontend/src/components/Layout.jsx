import {
  Home,
  Users,
  FileText,
  UserCog,
  LogOut
} from 'lucide-react';

import {
  NavLink,
  Outlet,
  useNavigate
} from 'react-router-dom';

import logo from '../assets/logo.jpeg';

import './Layout.css';

function Layout() {
  const navigate = useNavigate();

  const usuarioSalvo =
    localStorage.getItem('usuario');

  const usuario = usuarioSalvo
    ? JSON.parse(usuarioSalvo)
    : null;

  function sair() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/');
  }

  return (
    <div className="app-layout">

      <aside className="layout-sidebar">

        <div className="layout-brand">

          <img
            src={logo}
            alt="CCAAU"
            className="layout-logo"
          />

          <div>
            <strong>CCAAU</strong>
            <span>Gestão de Alunos</span>
          </div>

        </div>

        <nav className="layout-nav">

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? 'layout-nav-item active'
                : 'layout-nav-item'
            }
          >
            <Home size={20} />
            Início
          </NavLink>

          <NavLink
            to="/alunos"
            className={({ isActive }) =>
              isActive
                ? 'layout-nav-item active'
                : 'layout-nav-item'
            }
          >
            <Users size={20} />
            Alunos
          </NavLink>

          <NavLink
            to="/documentos"
            className={({ isActive }) =>
              isActive
                ? 'layout-nav-item active'
                : 'layout-nav-item'
            }
          >
            <FileText size={20} />
            Documentos
          </NavLink>

          {usuario?.perfil === 'ADMIN' && (
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                isActive
                  ? 'layout-nav-item active'
                  : 'layout-nav-item'
              }
            >
              <UserCog size={20} />
              Usuários
            </NavLink>
          )}

        </nav>

        <div className="layout-user">

          <div className="layout-user-avatar">
            {usuario?.nome?.charAt(0) || 'U'}
          </div>

          <div className="layout-user-info">
            <strong>
              {usuario?.nome || 'Usuário'}
            </strong>

            <span>
              {usuario?.perfil || ''}
            </span>
          </div>

        </div>

        <button
          type="button"
          className="layout-logout"
          onClick={sair}
        >
          <LogOut size={19} />
          Sair
        </button>

      </aside>

      <main className="layout-content">
        <Outlet />
      </main>

    </div>
  );
}

export default Layout;