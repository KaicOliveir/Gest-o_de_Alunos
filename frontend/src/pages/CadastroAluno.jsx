import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import DadosPessoaisForm from '../components/alunos/DadosPessoaisForm';
import EnderecoForm from '../components/alunos/EnderecoForm';
import ResponsavelForm from '../components/alunos/ResponsavelForm';
import DocumentosForm from '../components/alunos/DocumentosForm';

import './CadastroAluno.css';

function CadastroAluno() {
  const navigate = useNavigate();

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [aluno, setAluno] = useState({
    nome: '',
    cpf: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const [responsavel, setResponsavel] = useState({
    nome: '',
    tipo: 'MAE',
    cpf: '',
    telefone: '',
    email: '',
    parentesco: ''
  });

  const [responsaveis, setResponsaveis] = useState([]);

  const [documento, setDocumento] = useState({
    tipo_documento: 'OUTRO',
    arquivo: null
  });

  const [documentos, setDocumentos] = useState([]);

  function handleAlunoChange(event) {
    const { name, value } = event.target;

    setAluno((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  function handleResponsavelChange(event) {
    const { name, value } = event.target;

    setResponsavel((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  function adicionarResponsavel() {
    if (!responsavel.nome.trim()) {
      setErro(
        'Informe o nome do responsável antes de adicioná-lo.'
      );
      return;
    }

    setErro('');

    setResponsaveis((anteriores) => [
      ...anteriores,
      responsavel
    ]);

    setResponsavel({
      nome: '',
      tipo: 'MAE',
      cpf: '',
      telefone: '',
      email: '',
      parentesco: ''
    });
  }

  function adicionarDocumento() {
    if (!documento.arquivo) {
      setErro(
        'Selecione um arquivo antes de adicionar o documento.'
      );
      return;
    }

    setErro('');

    setDocumentos((anteriores) => [
      ...anteriores,
      documento
    ]);

    setDocumento({
      tipo_documento: 'OUTRO',
      arquivo: null
    });
  }

  async function salvarAluno(event) {
    event.preventDefault();

    try {
      setSalvando(true);
      setErro('');

      // 1. Criar o aluno
      const responseAluno = await api.post(
        '/api/alunos',
        aluno
      );

      const alunoCriado = responseAluno.data.aluno;
      const alunoId = alunoCriado.id;

      // 2. Cadastrar responsáveis
      for (const item of responsaveis) {
        await api.post(
          `/api/alunos/${alunoId}/responsaveis`,
          item
        );
      }

      // 3. Enviar documentos
      for (const item of documentos) {
        const formData = new FormData();

        formData.append(
          'tipo_documento',
          item.tipo_documento
        );

        formData.append(
          'documento',
          item.arquivo
        );

        await api.post(
          `/api/alunos/${alunoId}/documentos`,
          formData
        );
      }

      // Por enquanto voltamos para a listagem.
      // Depois criaremos a página /alunos/:id.
      navigate(`/alunos/${alunoId}`);

    } catch (error) {
      console.error(
        'Erro ao cadastrar aluno:',
        error
      );

      setErro(
        error.response?.data?.message ||
        'Não foi possível cadastrar o aluno.'
      );

    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="cadastro-page">

      <header className="cadastro-header">

        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => navigate('/alunos')}
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h1>Cadastrar aluno</h1>

          <p>
            Preencha os dados abaixo para criar um novo cadastro.
          </p>
        </div>

      </header>

      <form
        className="cadastro-form"
        onSubmit={salvarAluno}
      >

        {erro && (
          <div className="cadastro-error">
            {erro}
          </div>
        )}

        <DadosPessoaisForm
          dados={aluno}
          onChange={handleAlunoChange}
        />

        <EnderecoForm
          dados={aluno}
          onChange={handleAlunoChange}
        />

        <ResponsavelForm
          responsavel={responsavel}
          onChange={handleResponsavelChange}
          adicionar={adicionarResponsavel}
          responsaveis={responsaveis}
        />

        <DocumentosForm
          documento={documento}
          setDocumento={setDocumento}
          adicionar={adicionarDocumento}
          documentos={documentos}
        />

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/alunos')}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="save-button"
            disabled={salvando}
          >
            <Save size={18} />

            {salvando
              ? 'Salvando...'
              : 'Salvar aluno'
            }
          </button>

        </div>

      </form>

    </div>
  );
}

export default CadastroAluno;