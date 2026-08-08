function DadosPessoaisForm({ dados, onChange }) {
  return (
    <section className="form-section">
      <div className="form-section-header">
        <h2>Dados pessoais</h2>
        <p>Informações principais do aluno.</p>
      </div>

      <div className="form-grid">

        <div className="field field-full">
          <label>Nome completo *</label>
          <input
            name="nome"
            value={dados.nome}
            onChange={onChange}
            placeholder="Digite o nome completo"
            required
          />
        </div>

        <div className="field">
          <label>CPF *</label>
          <input
            name="cpf"
            value={dados.cpf}
            onChange={onChange}
            placeholder="000.000.000-00"
            required
          />
        </div>

        <div className="field">
          <label>Data de nascimento *</label>
          <input
            type="date"
            name="data_nascimento"
            value={dados.data_nascimento}
            onChange={onChange}
            required
          />
        </div>

        <div className="field">
          <label>Telefone</label>
          <input
            name="telefone"
            value={dados.telefone}
            onChange={onChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="field">
          <label>E-mail</label>
          <input
            type="email"
            name="email"
            value={dados.email}
            onChange={onChange}
            placeholder="email@exemplo.com"
          />
        </div>

      </div>
    </section>
  );
}

export default DadosPessoaisForm;