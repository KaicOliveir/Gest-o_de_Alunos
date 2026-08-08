import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import CadastroAluno from './pages/CadastroAluno';
import AlunoDetalhes from './pages/AlunoDetalhes';
import Documentos from './pages/Documentos';
import Usuarios from './pages/Usuarios';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/"
          element={<Login />}
        />

        {/* ÁREA PROTEGIDA */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/alunos"
            element={<Alunos />}
          />

          <Route
            path="/alunos/novo"
            element={<CadastroAluno />}
          />

          <Route
            path="/alunos/:id"
            element={<AlunoDetalhes />}
          />

          <Route
            path="/documentos"
            element={<Documentos />}
          />

          <Route
            path="/usuarios"
            element={<Usuarios />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;