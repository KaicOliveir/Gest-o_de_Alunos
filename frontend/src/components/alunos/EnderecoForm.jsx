function EnderecoForm({ dados, onChange }) {
  return (
    <section className="form-section">

      <div className="form-section-header">
        <h2>Endereço</h2>
        <p>Dados de residência do aluno.</p>
      </div>

      <div className="form-grid">

        <div className="field">
          <label>CEP</label>
          <input
            name="cep"
            value={dados.cep}
            onChange={onChange}
            placeholder="00000-000"
          />
        </div>

        <div className="field field-wide">
          <label>Endereço</label>
          <input
            name="endereco"
            value={dados.endereco}
            onChange={onChange}
            placeholder="Rua, avenida..."
          />
        </div>

        <div className="field">
          <label>Número</label>
          <input
            name="numero"
            value={dados.numero}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Complemento</label>
          <input
            name="complemento"
            value={dados.complemento}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Bairro</label>
          <input
            name="bairro"
            value={dados.bairro}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Cidade</label>
          <input
            name="cidade"
            value={dados.cidade}
            onChange={onChange}
          />
        </div>

        <div className="field">
          <label>Estado</label>
          <input
            name="estado"
            maxLength="2"
            value={dados.estado}
            onChange={onChange}
            placeholder="BA"
          />
        </div>

      </div>
    </section>
  );
}

export default EnderecoForm;