CREATE DATABASE sabor_do_brasil;
USE sabor_do_brasil;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    senha VARCHAR(100),
    telefone VARCHAR(20),
    data_cadastro DATE,
    status ENUM('ativo', 'inativo')
);

CREATE TABLE empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    cnpj VARCHAR(20),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_categoria VARCHAR(100)
);

CREATE TABLE produto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(100),
    descricao TEXT,
    preco DECIMAL(6,2),
    quantidade_estoque INT,
    id_categoria INT,
    id_empresa INT,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id),
    FOREIGN KEY (id_empresa) REFERENCES empresa(id)
);

CREATE TABLE publicacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_publicacao VARCHAR(255),
    conteudo TEXT,
    data_publicacao DATE,
    tipo_publicacao TEXT,
    id_empresa INT,
    id_usuario INT,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);

CREATE TABLE curtidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_publicacao INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_publicacao) REFERENCES publicacao(id)
);

CREATE TABLE comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_publicacao INT,
    texto_comentario TEXT,
    data_comentario DATE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_publicacao) REFERENCES publicacao(id)
);
 
