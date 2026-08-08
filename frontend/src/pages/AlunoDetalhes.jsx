import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  User,
  Users,
  FileText,
  Upload,
  Pencil,
  Save,
  UserX,
  UserCheck,
  Trash2
} from 'lucide-react';

import api from '../services/api';

import './AlunoDetalhes.css';

function AlunoDetalhes() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [aluno, setAluno] = useState(null);
  const [responsaveis, setResponsaveis] = useState([]);
  const [documentos, setDocumentos] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  // Edição do aluno
  const [editando, setEditando] = useState(false);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);
  const [alunoEditado, setAlunoEditado] = useState(null);

  // Inativação / Reativação
  const [inativandoAluno, setInativandoAluno] = useState(false);
  const [reativandoAluno, setReativandoAluno] = useState(false);

  // Responsáveis
  const [mostrarResponsavel, setMostrarResponsavel] =
    useState(false);

  const [salvandoResponsavel, setSalvandoResponsavel] =
    useState(false);

  const [novoResponsavel, setNovoResponsavel] = useState({
    nome: '',
    tipo: 'MAE',
    cpf: '',
    telefone: '',
    email: '',
    parentesco: ''
  });

  // Documentos
  const [mostrarUpload, setMostrarUpload] = useState(false);
  const [enviandoDocumento, setEnviandoDocumento] =
    useState(false);

  const [novoDocumento, setNovoDocumento] = useState({
    tipo_documento: 'OUTRO',
    arquivo: null
  });

  useEffect(() => {
    carregarDados();
  }, [id]);

  async function carregarDados() {
    try {
      setCarregando(true);
      setErro('');

      const [
        responseAluno,
        responseResponsaveis,
        responseDocumentos
      ] = await Promise.all([
        api.get(`/api/alunos/${id}`),
        api.get(`/api/alunos/${id}/responsaveis`),
        api.get(`/api/alunos/${id}/documentos`)
      ]);

      setAluno(responseAluno.data.aluno);
      setAlunoEditado(responseAluno.data.aluno);

      setResponsaveis(
        responseResponsaveis.data.responsaveis || []
      );

      setDocumentos(
        responseDocumentos.data.documentos || []
      );

    } catch (error) {
      console.error(
        'Erro ao carregar cadastro:',
        error
      );

      setErro(
        error.response?.data?.message ||
        'Não foi possível carregar o cadastro do aluno.'
      );

    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // EDIÇÃO DO ALUNO
  // =====================================================

  function iniciarEdicao() {
    setAlunoEditado({
      ...aluno
    });

    setEditando(true);
  }

  function cancelarEdicao() {
    setAlunoEditado({
      ...aluno
    });

    setEditando(false);
  }

  function handleEdicaoChange(event) {
    const { name, value } = event.target;

    setAlunoEditado((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function salvarEdicao() {
    try {
      setSalvandoEdicao(true);

      await api.put(
        `/api/alunos/${id}`,
        {
          nome: alunoEditado.nome,
          cpf: alunoEditado.cpf,

          data_nascimento:
            alunoEditado.data_nascimento
              ?.substring(0, 10),

          telefone:
            alunoEditado.telefone || '',

          email:
            alunoEditado.email || '',

          endereco:
            alunoEditado.endereco || '',

          numero:
            alunoEditado.numero || '',

          complemento:
            alunoEditado.complemento || '',

          bairro:
            alunoEditado.bairro || '',

          cidade:
            alunoEditado.cidade || '',

          estado:
            alunoEditado.estado || '',

          cep:
            alunoEditado.cep || ''
        }
      );

      await carregarDados();

      setEditando(false);

    } catch (error) {
      console.error(
        'Erro ao atualizar aluno:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Não foi possível atualizar o aluno.'
      );

    } finally {
      setSalvandoEdicao(false);
    }
  }

  async function excluirDocumento(documento) {
    const confirmou = window.confirm(
      `Deseja excluir o documento "${documento.nome_original}"?`
    );

    if (!confirmou) {
      return;
    }

    try {
      await api.delete(
        `/api/documentos/${documento.id}`
      );

      await carregarDados();

    } catch (error) {
      console.error(
        'Erro ao excluir documento:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Não foi possível excluir o documento.'
      );
    }
  }

  // =====================================================
  // INATIVAR / REATIVAR
  // =====================================================

  async function inativarAluno() {
    const confirmou = window.confirm(
      'Tem certeza que deseja inativar este aluno? O cadastro não será apagado.'
    );

    if (!confirmou) {
      return;
    }

    try {
      setInativandoAluno(true);

      await api.delete(
        `/api/alunos/${id}`
      );

      await carregarDados();

    } catch (error) {
      console.error(
        'Erro ao inativar aluno:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Não foi possível inativar o aluno.'
      );

    } finally {
      setInativandoAluno(false);
    }
  }

  async function reativarAluno() {
    const confirmou = window.confirm(
      'Deseja reativar este aluno?'
    );

    if (!confirmou) {
      return;
    }

    try {
      setReativandoAluno(true);

      await api.patch(
        `/api/alunos/${id}/reativar`
      );

      await carregarDados();

    } catch (error) {
      console.error(
        'Erro ao reativar aluno:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Não foi possível reativar o aluno.'
      );

    } finally {
      setReativandoAluno(false);
    }
  }

  // =====================================================
  // RESPONSÁVEIS
  // =====================================================

  function handleNovoResponsavelChange(event) {
    const { name, value } = event.target;

    setNovoResponsavel((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function adicionarNovoResponsavel(event) {
    event.preventDefault();

    if (!novoResponsavel.nome.trim()) {
      alert(
        'Informe o nome do responsável.'
      );
      return;
    }

    try {
      setSalvandoResponsavel(true);

      await api.post(
        `/api/alunos/${id}/responsaveis`,
        novoResponsavel
      );

      setNovoResponsavel({
        nome: '',
        tipo: 'MAE',
        cpf: '',
        telefone: '',
        email: '',
        parentesco: ''
      });

      setMostrarResponsavel(false);

      await carregarDados();

    } catch (error) {
      console.error(
        'Erro ao cadastrar responsável:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Não foi possível cadastrar o responsável.'
      );

    } finally {
      setSalvandoResponsavel(false);
    }
  }

  function cancelarNovoResponsavel() {
    setMostrarResponsavel(false);

    setNovoResponsavel({
      nome: '',
      tipo: 'MAE',
      cpf: '',
      telefone: '',
      email: '',
      parentesco: ''
    });
  }

  // =====================================================
  // DOCUMENTOS
  // =====================================================

  async function abrirDocumento(documento) {
    try {
      const response = await api.get(
        `/api/documentos/${documento.id}/arquivo`,
        {
          responseType: 'blob'
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob(
            [response.data],
            {
              type: documento.mime_type
            }
          )
        );

      window.open(
        url,
        '_blank'
      );

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 10000);

    } catch (error) {
      console.error(
        'Erro ao visualizar documento:',
        error
      );

      alert(
        'Não foi possível abrir o documento.'
      );
    }
  }

  async function enviarNovoDocumento(event) {
    event.preventDefault();

    if (!novoDocumento.arquivo) {
      alert(
        'Selecione um arquivo.'
      );
      return;
    }

    try {
      setEnviandoDocumento(true);

      const formData =
        new FormData();

      formData.append(
        'tipo_documento',
        novoDocumento.tipo_documento
      );

      formData.append(
        'documento',
        novoDocumento.arquivo
      );

      await api.post(
        `/api/alunos/${id}/documentos`,
        formData
      );

      setNovoDocumento({
        tipo_documento: 'OUTRO',
        arquivo: null
      });

      setMostrarUpload(false);

      await carregarDados();

    } catch (error) {
      console.error(
        'Erro ao enviar documento:',
        error
      );

      alert(
        error.response?.data?.message ||
        'Não foi possível enviar o documento.'
      );

    } finally {
      setEnviandoDocumento(false);
    }
  }

  function cancelarUpload() {
    setMostrarUpload(false);

    setNovoDocumento({
      tipo_documento: 'OUTRO',
      arquivo: null
    });
  }

  // =====================================================
  // ESTADOS DE CARREGAMENTO
  // =====================================================

  if (carregando) {
    return (
      <div className="detalhes-status">
        Carregando cadastro...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="detalhes-status erro">
        {erro}
      </div>
    );
  }

  if (!aluno) {
    return (
      <div className="detalhes-status">
        Aluno não encontrado.
      </div>
    );
  }

  return (
    <div className="detalhes-page">

      {/* CABEÇALHO */}

      <header className="detalhes-header">

        <div>

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate('/alunos')
            }
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <h1>
            {aluno.nome}
          </h1>

          <p>
            Visualize os dados, responsáveis e documentos.
          </p>

        </div>

        <div className="detalhes-header-actions">

          <span
            className={
              aluno.status === 'ATIVO'
                ? 'status status-ativo'
                : 'status status-inativo'
            }
          >
            {aluno.status}
          </span>

          {aluno.status === 'ATIVO' ? (

            <button
              type="button"
              className="inativar-button"
              onClick={inativarAluno}
              disabled={inativandoAluno}
            >
              <UserX size={17} />

              {inativandoAluno
                ? 'Inativando...'
                : 'Inativar aluno'
              }
            </button>

          ) : (

            <button
              type="button"
              className="reativar-button"
              onClick={reativarAluno}
              disabled={reativandoAluno}
            >
              <UserCheck size={17} />

              {reativandoAluno
                ? 'Reativando...'
                : 'Reativar aluno'
              }
            </button>

          )}

        </div>

      </header>

      {/* DADOS PESSOAIS */}

      <section className="detalhes-card">

        <div className="detalhes-card-title detalhes-card-title-actions">

          <div>
            <User size={21} />
            <h2>Dados pessoais</h2>
          </div>

          {!editando ? (

            <button
              type="button"
              className="add-button"
              onClick={iniciarEdicao}
            >
              <Pencil size={17} />
              Editar cadastro
            </button>

          ) : (

            <div className="edicao-actions">

              <button
                type="button"
                className="cancel-button-small"
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="save-button-small"
                onClick={salvarEdicao}
                disabled={salvandoEdicao}
              >
                <Save size={16} />

                {salvandoEdicao
                  ? 'Salvando...'
                  : 'Salvar alterações'
                }
              </button>

            </div>

          )}

        </div>

        {!editando ? (

          <div className="dados-grid">

            <div>
              <span>Nome</span>
              <strong>
                {aluno.nome}
              </strong>
            </div>

            <div>
              <span>CPF</span>
              <strong>
                {aluno.cpf}
              </strong>
            </div>

            <div>
              <span>
                Data de nascimento
              </span>

              <strong>
                {aluno.data_nascimento
                  ? new Date(
                      aluno.data_nascimento
                    ).toLocaleDateString(
                      'pt-BR'
                    )
                  : '-'
                }
              </strong>
            </div>

            <div>
              <span>Telefone</span>

              <strong>
                {aluno.telefone || '-'}
              </strong>
            </div>

            <div>
              <span>E-mail</span>

              <strong>
                {aluno.email || '-'}
              </strong>
            </div>

            <div>
              <span>CEP</span>

              <strong>
                {aluno.cep || '-'}
              </strong>
            </div>

            <div className="dados-full">

              <span>
                Endereço
              </span>

              <strong>
                {[
                  aluno.endereco,
                  aluno.numero,
                  aluno.complemento,
                  aluno.bairro,
                  aluno.cidade,
                  aluno.estado
                ]
                  .filter(Boolean)
                  .join(', ') || '-'
                }
              </strong>

            </div>

          </div>

        ) : (

          <div className="edit-grid">

            <div className="field field-full">

              <label>
                Nome completo *
              </label>

              <input
                name="nome"
                value={
                  alunoEditado?.nome || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>CPF *</label>

              <input
                name="cpf"
                value={
                  alunoEditado?.cpf || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Data de nascimento *
              </label>

              <input
                type="date"
                name="data_nascimento"
                value={
                  alunoEditado
                    ?.data_nascimento
                    ? alunoEditado
                        .data_nascimento
                        .substring(0, 10)
                    : ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Telefone
              </label>

              <input
                name="telefone"
                value={
                  alunoEditado
                    ?.telefone || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                E-mail
              </label>

              <input
                type="email"
                name="email"
                value={
                  alunoEditado
                    ?.email || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>CEP</label>

              <input
                name="cep"
                value={
                  alunoEditado
                    ?.cep || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field field-wide">

              <label>
                Endereço
              </label>

              <input
                name="endereco"
                value={
                  alunoEditado
                    ?.endereco || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Número
              </label>

              <input
                name="numero"
                value={
                  alunoEditado
                    ?.numero || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Complemento
              </label>

              <input
                name="complemento"
                value={
                  alunoEditado
                    ?.complemento || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Bairro
              </label>

              <input
                name="bairro"
                value={
                  alunoEditado
                    ?.bairro || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Cidade
              </label>

              <input
                name="cidade"
                value={
                  alunoEditado
                    ?.cidade || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

            <div className="field">

              <label>
                Estado
              </label>

              <input
                name="estado"
                maxLength="2"
                value={
                  alunoEditado
                    ?.estado || ''
                }
                onChange={
                  handleEdicaoChange
                }
              />

            </div>

          </div>

        )}

      </section>

      {/* RESPONSÁVEIS */}

      <section className="detalhes-card">

        <div className="detalhes-card-title detalhes-card-title-actions">

          <div>
            <Users size={21} />
            <h2>Responsáveis</h2>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={() =>
              setMostrarResponsavel(
                !mostrarResponsavel
              )
            }
          >
            + Novo responsável
          </button>

        </div>

        {mostrarResponsavel && (

          <form
            className="novo-responsavel-form"
            onSubmit={
              adicionarNovoResponsavel
            }
          >

            <div className="field field-wide">

              <label>
                Nome *
              </label>

              <input
                name="nome"
                value={
                  novoResponsavel.nome
                }
                onChange={
                  handleNovoResponsavelChange
                }
                placeholder="Nome completo"
                required
              />

            </div>

            <div className="field">

              <label>
                Tipo
              </label>

              <select
                name="tipo"
                value={
                  novoResponsavel.tipo
                }
                onChange={
                  handleNovoResponsavelChange
                }
              >

                <option value="MAE">
                  Mãe
                </option>

                <option value="PAI">
                  Pai
                </option>

                <option value="RESPONSAVEL_LEGAL">
                  Responsável legal
                </option>

                <option value="OUTRO">
                  Outro
                </option>

              </select>

            </div>

            <div className="field">

              <label>
                CPF
              </label>

              <input
                name="cpf"
                value={
                  novoResponsavel.cpf
                }
                onChange={
                  handleNovoResponsavelChange
                }
                placeholder="000.000.000-00"
              />

            </div>

            <div className="field">

              <label>
                Telefone
              </label>

              <input
                name="telefone"
                value={
                  novoResponsavel.telefone
                }
                onChange={
                  handleNovoResponsavelChange
                }
                placeholder="(00) 00000-0000"
              />

            </div>

            <div className="field">

              <label>
                E-mail
              </label>

              <input
                type="email"
                name="email"
                value={
                  novoResponsavel.email
                }
                onChange={
                  handleNovoResponsavelChange
                }
                placeholder="email@exemplo.com"
              />

            </div>

            <div className="field">

              <label>
                Parentesco
              </label>

              <input
                name="parentesco"
                value={
                  novoResponsavel.parentesco
                }
                onChange={
                  handleNovoResponsavelChange
                }
                placeholder="Ex.: Mãe, Pai, Tia..."
              />

            </div>

            <div className="novo-responsavel-actions">

              <button
                type="button"
                className="cancel-button-small"
                onClick={
                  cancelarNovoResponsavel
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="save-button-small"
                disabled={
                  salvandoResponsavel
                }
              >
                {salvandoResponsavel
                  ? 'Salvando...'
                  : 'Adicionar responsável'
                }
              </button>

            </div>

          </form>

        )}

        {responsaveis.length === 0 ? (

          <p className="empty-text">
            Nenhum responsável cadastrado.
          </p>

        ) : (

          <div className="responsaveis-list">

            {responsaveis.map(
              (responsavel) => (

                <div
                  className="responsavel-card"
                  key={responsavel.id}
                >

                  <strong>
                    {responsavel.nome}
                  </strong>

                  <span>
                    {responsavel.parentesco ||
                      responsavel.tipo}
                  </span>

                  <span>
                    {responsavel.telefone ||
                      'Sem telefone'}
                  </span>

                  {responsavel.email && (
                    <span>
                      {responsavel.email}
                    </span>
                  )}

                </div>

              )
            )}

          </div>

        )}

      </section>

      {/* DOCUMENTOS */}

      <section className="detalhes-card">

        <div className="detalhes-card-title detalhes-card-title-actions">

          <div>
            <FileText size={21} />
            <h2>Documentos</h2>
          </div>

          <button
            type="button"
            className="add-button"
            onClick={() =>
              setMostrarUpload(
                !mostrarUpload
              )
            }
          >
            <Upload size={18} />
            Novo documento
          </button>

        </div>

        {mostrarUpload && (

          <form
            className="novo-documento-form"
            onSubmit={
              enviarNovoDocumento
            }
          >

            <div className="field">

              <label>
                Tipo do documento
              </label>

              <select
                value={
                  novoDocumento
                    .tipo_documento
                }
                onChange={(event) =>
                  setNovoDocumento({
                    ...novoDocumento,
                    tipo_documento:
                      event.target.value
                  })
                }
              >

                <option value="CPF">
                  CPF
                </option>

                <option value="RG">
                  RG
                </option>

                <option value="CERTIDAO_NASCIMENTO">
                  Certidão de nascimento
                </option>

                <option value="COMPROVANTE_RESIDENCIA">
                  Comprovante de residência
                </option>

                <option value="DOCUMENTO_RESPONSAVEL">
                  Documento do responsável
                </option>

                <option value="OUTRO">
                  Outro
                </option>

              </select>

            </div>

            <div className="field documento-file">

              <label>
                Arquivo
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) =>
                  setNovoDocumento({
                    ...novoDocumento,
                    arquivo:
                      event.target
                        .files[0] ||
                      null
                  })
                }
              />

            </div>

            <div className="novo-documento-actions">

              <button
                type="button"
                className="cancel-button-small"
                onClick={cancelarUpload}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="save-button-small"
                disabled={
                  enviandoDocumento
                }
              >
                {enviandoDocumento
                  ? 'Enviando...'
                  : 'Enviar documento'
                }
              </button>

            </div>

          </form>

        )}

        {documentos.length === 0 ? (

          <p className="empty-text">
            Nenhum documento anexado.
          </p>

        ) : (

          <div className="documentos-list">

            {documentos.map(
              (documento) => (

                <div
                  className="documento-card"
                  key={documento.id}
                >

                  <div>

                    <strong>
                      {
                        documento.tipo_documento
                      }
                    </strong>

                    <span>
                      {
                        documento.nome_original
                      }
                    </span>

                  </div>

                  <div className="documento-actions">

                    <button
                      type="button"
                      className="visualizar-documento-button"
                      onClick={() =>
                        abrirDocumento(documento)
                      }
                    >
                      Visualizar
                    </button>

                    <button
                      type="button"
                      className="excluir-documento-button"
                      onClick={() =>
                        excluirDocumento(documento)
                      }
                    >
                      <Trash2 size={16} />
                      Excluir
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default AlunoDetalhes;