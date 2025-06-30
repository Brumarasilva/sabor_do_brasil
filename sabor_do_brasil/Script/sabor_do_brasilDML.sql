USE sabor_do_brasil;

INSERT INTO empresa (id, nome, foto) VALUES 
(1,'sabor do brasil','/img/images__2_-removebg-preview.png');

-- Adiciona a coluna Foto se não existir
ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS Foto VARCHAR(255);

-- Garante que os campos principais existem (ajuste os tipos conforme seu modelo)
ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS Nome VARCHAR(100);
ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS Email VARCHAR(100) UNIQUE;
ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS Senha VARCHAR(255);
ALTER TABLE Usuarios ADD COLUMN IF NOT EXISTS Telefone VARCHAR(20);

-- Exemplo de inserção de usuário (opcional, para teste)
-- INSERT INTO Usuarios (Nome, Email, Senha, Foto, Telefone) VALUES ('Teste', 'teste@email.com', 'senha123', '/img/foto.png', '11999999999');

