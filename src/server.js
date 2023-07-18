// const path = require('path');
const express = require('express');
const mysql = require('mysql2');
  
// Estabelece configuracao da conexao com BD
const connectionConfig = {
  host: 'localhost',
  user: 'root', // usuario onde se deseja criar BD no MySQL
  password: 'Leo250262', // senha do usuario
  database: 'leandrodb' // nome do banco de dados a ser criado ou estabelecida a conexao
};


// Cria conexao com infos acima
const con = mysql.createConnection(connectionConfig);

// Tenta conectar conexao com BD
con.connect(function(err) {
  if (err) {
    console.error('Failed to connect to MySQL:', err);
    console.log('Attempting to create a new database...');

    // Nova conexao temporaria cria BD caso ele n exista
    const tempConnectionConfig = { ...connectionConfig, database: null };
    const tempCon = mysql.createConnection(tempConnectionConfig);

    // Usando conexao temporaria para criar novo BD com infos
    tempCon.query('CREATE DATABASE IF NOT EXISTS leandrodb', function(err, result) { // nome do banco de dados deve ser inserido aqui tambem
      if (err) {
        console.error('Failed to create the database:', err);
        return;
      }

      console.log('Database created successfully');

      // Termina sessao da conexao temporaria
      tempCon.end(function(err) {
        if (err) console.error('Failed to close the temporary connection:', err);

        // Conecta conexao original com BD criado
        con.changeUser({ database: 'leandrodb' }, function(err) { // nome do banco de dados deve ser inserido aqui tambem
          if (err) console.error('Failed to switch to the newly created database:', err);
          else console.log('Connected to the newly created database!');
        });
      });
    });
  } else {
    console.log('Connected to MySQL!');
  }
});

// Criacao das tabelas e relacionamentos conforme estabelecido no script
const geraBD = [
  `CREATE TABLE IF NOT EXISTS estudante (
      Matricula int PRIMARY KEY,
      Email VARCHAR(50),
      Senha VARCHAR(25),
      Nome VARCHAR(100),
      Curso VARCHAR(50),
      Foto BLOB,
      Adm BOOLEAN DEFAULT 0
  );`,
 `CREATE TABLE IF NOT EXISTS departamento (
      Codigo_Departamento VARCHAR(25) PRIMARY KEY,
      Nome_Departamento VARCHAR(100)
  );`,
  `CREATE TABLE IF NOT EXISTS professor (
      Id_Professor int PRIMARY KEY AUTO_INCREMENT,
      Nome VARCHAR(100),
      fk_Departamento VARCHAR(25)  -- Professor pertence a um departamento
  );`,
  `CREATE TABLE IF NOT EXISTS disciplina (
      Codigo_Disciplina VARCHAR(25) PRIMARY KEY,
      Nome_Disciplina VARCHAR(100),
      fk_Departamento VARCHAR(25) -- Disciplina pertence a um departamento
  );`,
  `CREATE TABLE IF NOT EXISTS turma (
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
  );`,
  `CREATE TABLE IF NOT EXISTS avaliacao (
      Id_Avaliacao int PRIMARY KEY AUTO_INCREMENT,
      Data TIMESTAMP, -- Data e horario em que avaliacao foi feita
      Conteudo VARCHAR(500),
      fk_Estudante int, -- Avaliacao possui um autor/estudante 
      fk_Turma int -- Avaliacao e sobre uma turma
  );`,
  `CREATE TABLE IF NOT EXISTS denuncia (
      Id_Denuncia int PRIMARY KEY AUTO_INCREMENT,
      Data TIMESTAMP, -- Data e horario em que foi realizada a denuncia na avaliacao
      fk_Avaliacao int -- Denuncia em uma avaliacao
  );`,
  `ALTER TABLE professor ADD FOREIGN KEY (fk_Departamento) REFERENCES departamento(Codigo_Departamento);`,
  `ALTER TABLE disciplina ADD FOREIGN KEY (fk_Departamento) REFERENCES departamento(Codigo_Departamento);`,
  `ALTER TABLE turma ADD FOREIGN KEY (fk_Professor) REFERENCES professor(Id_Professor);`,
  `ALTER TABLE turma ADD FOREIGN KEY (fk_Disciplina) REFERENCES disciplina(Codigo_Disciplina);`,
  `ALTER TABLE avaliacao ADD FOREIGN KEY (fk_Estudante) REFERENCES estudante(Matricula);`,
  `ALTER TABLE avaliacao ADD FOREIGN KEY (fk_Turma) REFERENCES turma(Id_Turma);`,
  `ALTER TABLE denuncia ADD FOREIGN KEY (fk_Avaliacao) REFERENCES avaliacao(Id_Avaliacao);`,
];

// Executa comandos SQL no geraBD

for (let i = 0; i < geraBD.length; i++) {
  con.query(geraBD[i], function (err, result) {
    if (err) {throw err}
    else {console.log(`Tabela ou Relacao ${i + 1} foi executada com sucesso!`);}
  });
}

// Populando BD

const populaBD = [
  `INSERT INTO estudante (Matricula, Email,
    Senha, Nome, Curso, Adm)
    VALUES (211020900, 'leobelko@aluno.unb.br',
    'teste', 'Leandro Kornelius', 'Computacao', 1);`,
  `INSERT INTO estudante (Matricula, Email,
    Senha, Nome, Curso, Adm)
    VALUES (211020901, 'user1@aluno.unb.br', 'teste', 'user1', 'Engenheria de Computacao', DEFAULT),
    (211020902, 'user2aluno.unb.br', 'teste', 'user2', 'Ciencia da Computacao', DEFAULT),
    (211020903, 'user3@aluno.unb.br', 'teste', 'user3', 'Computacao', DEFAULT),
    (211020904, 'user4@aluno.unb.br', 'teste', 'user4', 'Curso Teste', DEFAULT);`,
  `INSERT INTO departamento (Codigo_Departamento, Nome_Departamento)
    VALUES ('548', 'DEPTO ECONOMIA - BRASILIA'), 
    ('508', 'DEPTO CIENCIAS DA COMPUTACAO - BRASILIA'),
    ('481', 'DEPTO ANTROPOLOGIA - BRASILIA');`,
  `INSERT INTO disciplina (Codigo_Disciplina, Nome_Disciplina, fk_Departamento)
    VALUES ('CIC0004', 'ALGORITMOS E PROGRAMACAO DE COMPUTADORES', 508), 
    ('CIC0002', 'FUNDAMENTOS TEORICOS DA COMPUTACAO', 508), 
    ('ECO0128', 'INTRODUCAO A ECONOMETRIA', 548), 
    ('DAN0014', 'ANTROPOLOGIA VISUAL', 481);`,
  `INSERT INTO professor (Nome, fk_Departamento) -- em func do auto_increment o id sera omitido e adicionado automaticamente
    VALUES ('Maristela Holanda', 508), 
    ('Pedro Berger', 508), 
    ('Penaloza', 548), 
    ('Professor Antropologia', 481);`,
  `INSERT INTO turma (Turma, Periodo, Carga_Horaria, Horario, Vagas_Ocupadas, Vagas_Totais, Local, fk_Professor, fk_Disciplina)
    VALUES (10, '2022.1', 90, '345N12', 0, 48, 'PJC BT 036', 1, 'CIC0004'), 
    (1, '2022.1', 60, '35N34', 0, 20, 'ICC AT 164', 2, 'CIC0002'), 
    (2, '2022.1', 60, '35M12', 0, 35, 'PJC BT 040', 3, 'ECO0128'), 
    (3, '2022.1', 60, '24T34', 0, 40, 'PJC BT 044', 4, 'DAN0014');`,
  `INSERT INTO avaliacao (Data, Conteudo, fk_Estudante, fk_Turma) -- em func do auto_increment o id sera omitido e adicionado automaticamente
  VALUES (NOW(), 'Excelente professora!', 211020901, 1), 
    (NOW(), 'Tive que trancar, mas ate o momento tava de boas.', 211020902, 1),
    (NOW(), 'Professor coerente.', 211020901, 2), 
    (NOW(), 'Achei a materia bem difícil, mas o professor e gente boa', 211020902, 3), 
    (NOW(), 'Top!', 211020902, 4), -- inserido para testar denuncia ignorada
    (NOW(), 'tuti tuti!', 211020903, 4), -- inserido para testar denuncia atendida
    (NOW(), 'Uma merda!', 211020904, 4); -- inserido para testar denuncia atendida e usuario deletado`,
  `INSERT INTO denuncia (Data, fk_Avaliacao) -- em func do auto_increment o id sera omitido e adicionado automaticamente
    VALUES (NOW(), 1), 
    (NOW(), 2), 
    (NOW(), 3), 
    (NOW(), 5), 
    (NOW(), 6), 
    (NOW(), 7);`,
];


// Executa comandos estabelecidos no populaBD

for (let i = 0; i < populaBD.length; i++) {
  con.query(populaBD[i], function (err, result) {
    if (err) {throw err}
    else {console.log(`Populando entidade ${i + 1} foi executada com sucesso!`);}
  });
}


// Criacao das Views e Procedures

const auxiliosBD = [
  `CREATE VIEW denuncia_view AS 
    SELECT denuncia.Data, avaliacao.Conteudo
    FROM denuncia, avaliacao
    WHERE denuncia.fk_Avaliacao = avaliacao.Id_Avaliacao
    ORDER BY denuncia.Data;`,
  `CREATE VIEW avaliacao_view AS
    SELECT avaliacao.Data, avaliacao.Conteudo, professor.Nome, disciplina.Nome_Disciplina
    FROM avaliacao
    JOIN turma ON avaliacao.fk_Turma = turma.Id_Turma 
    JOIN professor ON turma.fk_Professor = professor.Id_Professor 
    JOIN disciplina ON turma.fk_Disciplina = disciplina.Codigo_Disciplina
    ORDER BY avaliacao.Data DESC;`,
  `CREATE PROCEDURE delete_avaliacao(IN id_avaliacao INT)
    BEGIN
        START TRANSACTION;

        DELETE FROM denuncia WHERE denuncia.fk_Avaliacao = id_avaliacao;

        DELETE FROM avaliacao WHERE avaliacao.Id_Avaliacao = id_avaliacao;

        COMMIT;
    END`,
];


// Executa SQL da criacao das procedures e views

for (let i = 0; i < auxiliosBD.length; i++) {
  con.query(auxiliosBD[i], function (err, result) {
    if (err) {throw err}
    else {console.log(`Colocando view ou procedure ${i + 1} que foi executada com sucesso!`);}
  });
}


const app = express();
const multer = require('multer')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Inicia servidor e indica porta
app.listen(3000, function() {
    console.log(`Server listening on port ${3000}`);
});

app.get('/', function(req, res){
  res.render('index.ejs');
})

app.post('/criarEstudanteData', upload.single('foto'), function (req, res) {
  let matricula = req.body.matricula;
  let email = req.body.email;
  let senha = req.body.senha;
  let nome = req.body.nome;
  let curso = req.body.curso;
  let foto = req.file.buffer;

  console.log(matricula, email, senha, nome, curso, foto);

  let check_estudante = 'SELECT * FROM estudante WHERE Matricula = ?';

  con.query(check_estudante, [matricula], function (err, result) {
    if (err) throw err;
    if (result.length === 0) { // caso n exista no bd validations to insert
      if (!email.endsWith('@aluno.unb.br')) { // verificacao do email 
        res.render('criarestudante.ejs', { // email errado, mando aviso ao front
          resultEmailValidation: { emailCorrect: false }
        });
      } else { // caso contrario, posso inserir no bd 
        let create_estudante =
          'INSERT INTO estudante (Matricula, Email, Senha, Nome, Curso, Foto) VALUES (?, ?, ?, ?, ?, ?)';
        let values = [
          matricula,
          email,
          senha,
          nome, 
          curso,
          foto
        ];

        con.query(create_estudante, values, function (err, result) {
          if (err) throw err;
          console.log('Estudante criado');
          res.render('loginestudante.ejs', {
            resultSenhaValidation: { senhaCorrect: true }
          });     
        });
      }
    } else {
      console.log('Estudante ja existe, direcionando para login...')
      res.render('loginestudante.ejs', {
        resultSenhaValidation: { senhaCorrect: true }
      });     
    }
  });
});

app.get('/criarEstudante', function(req, res) {
  res.render('criarestudante.ejs', { 
    resultEmailValidation: { emailCorrect: true } 
  });
})

app.post('/loginEstudanteData', function (req, res) {
  let matricula = req.body.matricula;
  let senha = req.body.senha;

  console.log(matricula, senha);

  let check_estudante = 'SELECT * FROM estudante WHERE Matricula = ?';

  con.query(check_estudante, [matricula], function (err, result) {
    if (err) throw err;
    if (result.length === 0) { // caso n exista estudante com matricula no bd preciso direcionar a criacao do usuario
      console.log('Estudante n existe, direcionando para sign-up...');
      res.render('criarestudante.ejs', {
        resultEmailValidation: { emailCorrect: true }
      });
    } else { // estudante com matricula existe em result
      if (result[0].Senha !== senha) {
        res.render('loginestudante.ejs', {
          resultSenhaValidation: { senhaCorrect: false }
        });        
      } else { // existe e senha esta correta
        res.render('feedestudante.ejs', {
          resultLogin: { estudanteInfo: result[0] }
        });
      }
    }
  });
});

app.get('/loginEstudante', function(req, res) {
  res.render('loginestudante.ejs', {
    resultSenhaValidation: { senhaCorrect: true }
  });
});

app.get('/updateEstudante', function(req, res) {
  let matricula = req.query.matricula;

  let check_estudante = 'SELECT * FROM estudante WHERE Matricula = ?';

  con.query(check_estudante, [matricula], function(err, result) {
    if (err) throw err;

    if (result.length === 0) {
      res.render('criarestudante.ejs', {
        resultEmailValidation: { emailCorrect: true }
      });
    } else {
      res.render('updateestudante.ejs', { estudanteInfo: result[0] });
    }
  });
});

app.post('/updateEstudanteData', function(req, res) {
  let matricula = req.query.matricula; 
  let nome = req.body.nome;
  let curso = req.body.curso;

  console.log('Received form data:');
  console.log('Matricula:', matricula);
  console.log('Nome:', nome);
  console.log('Curso:', curso);

  let updateEstudante = 'UPDATE estudante SET Nome = ?, Curso = ? WHERE Matricula = ?';

  con.query(updateEstudante, [nome, curso, matricula], function(err, result) {
    if (err) throw err;

    let check_estudante = 'SELECT * FROM estudante WHERE Matricula = ?';

    con.query(check_estudante, [matricula], function (err, result) {
      if (err) throw err;

      if (result.length === 0) {
        res.render('criarestudante.ejs', {
          resultEmailValidation: { emailCorrect: true }
        });
      } else {
        res.render('feedestudante.ejs', {
          resultLogin: { estudanteInfo: result[0] }
        });
      }
    });
  });
});



