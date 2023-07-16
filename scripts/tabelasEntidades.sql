-- Comando em SQL que criarao as entidades com seus respectivos relacionamentos

-- Estrutuura da tabela dos usuarios/estudantes

CREATE TABLE IF NOT EXISTS estudante (
    Matricula int PRIMARY KEY,
    Email VARCHAR(50),
    Senha VARCHAR(25),
    Nome VARCHAR(100),
    Curso VARCHAR(50),
    Adm BOOLEAN DEFAULT 0
);

-- Estrutuura da tabela dos departamentos

CREATE TABLE IF NOT EXISTS departamento (
    Codigo_Departamento int PRIMARY KEY,
    Nome_Departamento VARCHAR(100)
);

-- Estrutuura da tabela dos professores

CREATE TABLE IF NOT EXISTS professor (
    Id_Professor int PRIMARY KEY AUTO_INCREMENT,
    Nome VARCHAR(100),
    fk_Departamento int  -- Professor pertence a um departamento
);

-- Estrutuura da tabela das disciplinas

CREATE TABLE IF NOT EXISTS disciplina (
    Codigo_Disciplina VARCHAR(10) PRIMARY KEY,
    Nome_Disciplina VARCHAR(100),
    fk_Departamento int -- Disciplina pertence a um departamento
);

-- Estrutuura da tabela das turmas

CREATE TABLE IF NOT EXISTS turma (
    Id_Turma int PRIMARY KEY AUTO_INCREMENT,
    Turma int,
    Periodo VARCHAR(25),
    Carga_Horaria int,
    Horario VARCHAR(25),
    Vagas_Ocupadas int,
    Vagas_Totais int,
    Local VARCHAR(25),
    fk_Professor int,  -- Turma minstrada por um professor
    fk_Disciplina VARCHAR(10) -- Turma sobre uma disciplina 
);

-- Estrutuura da tabela das avaliacoes das turmas

CREATE TABLE IF NOT EXISTS avaliacao (
    Id_Avaliacao int PRIMARY KEY AUTO_INCREMENT,
    Data TIMESTAMP, -- Data e horario em que avaliacao foi feita
    Conteudo VARCHAR(500),
    fk_Estudante int, -- Avaliacao possui um autor/estudante 
    fk_Turma int -- Avaliacao e sobre uma turma
);

-- Estrutuura da tabela das denuncias

CREATE TABLE IF NOT EXISTS denuncia (
    Id_Denuncia int PRIMARY KEY AUTO_INCREMENT,
    Data TIMESTAMP, -- Data e horario em que foi realizada a denuncia na avaliacao
    fk_Avaliacao int -- Denuncia em uma avaliacao
);

-- Atribuindo as respectivas chaves estrangeiras

-- Relacionamentos da entidade professor
ALTER TABLE professor ADD FOREIGN KEY (fk_Departamento) REFERENCES departamento(Codigo_Departamento);

-- Relacionamentos da entidade disciplina
ALTER TABLE disciplina ADD FOREIGN KEY (fk_Departamento) REFERENCES departamento(Codigo_Departamento);

-- Relacionamentos da entidade turma
ALTER TABLE turma ADD FOREIGN KEY (fk_Professor) REFERENCES professor(Id_Professor);
ALTER TABLE turma ADD FOREIGN KEY (fk_Disciplina) REFERENCES disciplina(Codigo_Disciplina);

-- Relacionamentos da entidade avaliacao
ALTER TABLE avaliacao ADD FOREIGN KEY (fk_Estudante) REFERENCES estudante(Matricula);
ALTER TABLE avaliacao ADD FOREIGN KEY (fk_Turma) REFERENCES turma(Id_Turma);

-- Relacionamentos da entidade denuncia
ALTER TABLE denuncia ADD FOREIGN KEY (fk_Avaliacao) REFERENCES avaliacao(Id_Avaliacao);



