function ResponsavelForm({
  responsavel,
  onChange,
  adicionar,
  responsaveis
}) {
  return (
    <section className="form-section">

      <div className="form-section-header">
        <h2>Responsáveis</h2>
        <p>Adicione um ou mais responsáveis pelo aluno.</p>
      </div>

      <div className="form-grid">

        <div className="field field-wide">
          <label>Nome do responsável</label>
          <input
            name="nome"
            value={responsavel.nome}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Tipo</label>
          <select
            name="tipo"
            value={responsavel.tipo}
            onChange={onChange}
          >
            <option value="MAE">Mãe</option>
            <option value="PAI">Pai</option>
            <option value="RESPONSAVEL_LEGAL">
              Responsável legal
            </option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>

        <div className="field">
          <label>CPF</label>
          <input
            name="cpf"
            value={responsavel.cpf}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Telefone</label>
          <input
            name="telefone"
            value={responsavel.telefone}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={responsavel.email}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Parentesco</label>
          <input
            name="parentesco"
            value={responsavel.parentesco}
            onChange={onChange}
          />
        </div>

      </div>

      <button
        type="button"
        className="secondary-button"
        onClick={adicionar}
      >
        + Adicionar responsável
      </button>

      {responsaveis.length > 0 && (
        <div className="items-list">
          {responsaveis.map((item, index) => (
            <div
              key={`${item.nome}-${index}`}
              className="item-card"
            >
              <strong>{item.nome}</strong>
              <span>
                {item.parentesco || item.tipo}
                {item.telefone
                  ? ` • ${item.telefone}`
                  : ''}
              </span>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}

export default ResponsavelForm;