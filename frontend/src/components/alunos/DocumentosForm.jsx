function DocumentosForm({
  documento,
  setDocumento,
  adicionar,
  documentos
}) {
  return (
    <section className="form-section">

      <div className="form-section-header">
        <h2>Documentos</h2>
        <p>
          Anexe documentos do aluno. Aceitamos PDF, JPG e PNG.
        </p>
      </div>

      <div className="form-grid">

        <div className="field">
          <label>Tipo do documento</label>

          <select
            value={documento.tipo_documento}
            onChange={(event) =>
              setDocumento({
                ...documento,
                tipo_documento: event.target.value
              })
            }
          >
            <option value="CPF">CPF</option>
            <option value="RG">RG</option>
            <option value="CERTIDAO_NASCIMENTO">
              Certidão de nascimento
            </option>
            <option value="COMPROVANTE_RESIDENCIA">
              Comprovante de residência
            </option>
            <option value="DOCUMENTO_RESPONSAVEL">
              Documento do responsável
            </option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        <div className="field field-wide">
          <label>Arquivo</label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(event) =>
              setDocumento({
                ...documento,
                arquivo: event.target.files[0] || null
              })
            }
          />
        </div>

      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={adicionar}
      >
        + Adicionar documento
      </button>

      {documentos.length > 0 && (
        <div className="items-list">
          {documentos.map((item, index) => (
            <div
              key={`${item.arquivo?.name}-${index}`}
              className="item-card"
            >
              <strong>{item.tipo_documento}</strong>
              <span>
                {item.arquivo?.name}
              </span>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}

export default DocumentosForm;