import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Search,
  FileText,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';

import './Documentos.css';

function Documentos() {
  const navigate = useNavigate();

  const [documentos, setDocumentos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarDocumentos();
  }, []);

  async function carregarDocumentos() {
    try {
      setCarregando(true);
      setErro('');

      const response = await api.get(
        '/api/documentos'
      );

      setDocumentos(
        response.data.documentos || []
      );

    } catch (error) {
      console.error(
        'Erro ao carregar documentos:',
        error
      );

      setErro(
        error.response?.data?.message ||
        'Não foi possível carregar os documentos.'
      );

    } finally {
      setCarregando(false);
    }
  }

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

  const documentosFiltrados =
    documentos.filter((documento) => {
      const termo = busca
        .trim()
        .toLowerCase();

      if (!termo) {
        return true;
      }

      return (
        documento.nome_original
          ?.toLowerCase()
          .includes(termo) ||

        documento.aluno_nome
          ?.toLowerCase()
          .includes(termo) ||

        documento.aluno_cpf
          ?.toLowerCase()
          .includes(termo) ||

        documento.tipo_documento
          ?.toLowerCase()
          .includes(termo)
      );
    });

  function formatarTipo(tipo) {
    const tipos = {
      CPF: 'CPF',
      RG: 'RG',
      CERTIDAO_NASCIMENTO:
        'Certidão de nascimento',
      COMPROVANTE_RESIDENCIA:
        'Comprovante de residência',
      DOCUMENTO_RESPONSAVEL:
        'Documento do responsável',
      OUTRO: 'Outro'
    };

    return tipos[tipo] || tipo;
  }

  function formatarData(data) {
    if (!data) {
      return '-';
    }

    return new Date(data)
      .toLocaleDateString('pt-BR');
  }

  return (
    <div className="documentos-page">

      <header className="documentos-header">

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

          <h1>Documentos</h1>

          <p>
            Consulte os documentos anexados
            aos alunos.
          </p>

        </div>

      </header>

      <section className="documentos-card">

        <div className="documentos-toolbar">

          <div className="search-box">

            <Search size={19} />

            <input
              type="text"
              placeholder="Buscar por aluno, CPF, arquivo ou tipo"
              value={busca}
              onChange={(event) =>
                setBusca(
                  event.target.value
                )
              }
            />

          </div>

          <div className="documentos-total">

            <FileText size={18} />

            {documentosFiltrados.length}
            {' '}
            documento(s)

          </div>

        </div>

        {carregando && (
          <div className="documentos-status">
            Carregando documentos...
          </div>
        )}

        {erro && (
          <div className="documentos-error">
            {erro}
          </div>
        )}

        {!carregando &&
          !erro &&
          documentosFiltrados.length === 0 && (
            <div className="documentos-empty">
              Nenhum documento encontrado.
            </div>
          )}

        {!carregando &&
          !erro &&
          documentosFiltrados.length > 0 && (

            <div className="documentos-table-wrapper">

              <table className="documentos-table">

                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Arquivo</th>
                    <th>Aluno</th>
                    <th>CPF do aluno</th>
                    <th>Data</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {documentosFiltrados.map(
                    (documento) => (

                      <tr key={documento.id}>

                        <td>
                          <span className="documento-tipo">
                            {formatarTipo(
                              documento.tipo_documento
                            )}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {documento.nome_original}
                          </strong>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="aluno-link"
                            onClick={() =>
                              navigate(
                                `/alunos/${documento.aluno_id}`
                              )
                            }
                          >
                            {documento.aluno_nome}
                          </button>
                        </td>

                        <td>
                          {documento.aluno_cpf}
                        </td>

                        <td>
                          {formatarData(
                            documento.created_at
                          )}
                        </td>

                        <td>

                          <button
                            type="button"
                            className="visualizar-documento-button"
                            onClick={() =>
                              abrirDocumento(
                                documento
                              )
                            }
                          >
                            <ExternalLink
                              size={16}
                            />

                            Visualizar
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

      </section>

    </div>
  );
}

export default Documentos;