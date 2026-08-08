CREATE TABLE IF NOT EXISTS usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,

    senha_hash VARCHAR(255) NOT NULL,

    perfil ENUM(
        'ADMIN',
        'OPERADOR'
    ) NOT NULL DEFAULT 'OPERADOR',

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS alunos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    nome VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,

    data_nascimento DATE NOT NULL,

    telefone VARCHAR(20),
    email VARCHAR(150),

    endereco VARCHAR(255),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep VARCHAR(10),

    status ENUM(
        'ATIVO',
        'INATIVO'
    ) NOT NULL DEFAULT 'ATIVO',

    criado_por INT UNSIGNED,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_alunos_criado_por
        FOREIGN KEY (criado_por)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS responsaveis (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    aluno_id INT UNSIGNED NOT NULL,

    nome VARCHAR(150) NOT NULL,

    tipo ENUM(
        'PAI',
        'MAE',
        'RESPONSAVEL_LEGAL',
        'OUTRO'
    ) NOT NULL DEFAULT 'OUTRO',

    cpf VARCHAR(14),
    telefone VARCHAR(20),
    email VARCHAR(150),
    parentesco VARCHAR(100),

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_responsaveis_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE IF NOT EXISTS documentos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    aluno_id INT UNSIGNED NOT NULL,

    tipo_documento ENUM(
        'CPF',
        'RG',
        'CERTIDAO_NASCIMENTO',
        'COMPROVANTE_RESIDENCIA',
        'DOCUMENTO_RESPONSAVEL',
        'OUTRO'
    ) NOT NULL DEFAULT 'OUTRO',

    nome_original VARCHAR(255) NOT NULL,
    nome_armazenado VARCHAR(255) NOT NULL,
    caminho_arquivo VARCHAR(500) NOT NULL,

    mime_type VARCHAR(100),
    tamanho_bytes BIGINT UNSIGNED,

    enviado_por INT UNSIGNED,

    created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_documentos_aluno
        FOREIGN KEY (aluno_id)
        REFERENCES alunos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_documentos_usuario
        FOREIGN KEY (enviado_por)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);


CREATE INDEX idx_alunos_nome
ON alunos(nome);

CREATE INDEX idx_alunos_cpf
ON alunos(cpf);

CREATE INDEX idx_responsaveis_aluno
ON responsaveis(aluno_id);

CREATE INDEX idx_documentos_aluno
ON documentos(aluno_id);