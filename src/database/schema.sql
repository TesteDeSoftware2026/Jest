-- Active: 1782416337511@@127.0.0.1@3306@jest_db
CREATE DATABASE IF NOT EXISTS jest_db;

use efeo;

-- drop na tabela associativa primeiro
DROP TABLE solicitacao;

DROP TABLE usuario;
DROP TABLE politica;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    perfil ENUM('cidadao','admin') DEFAULT 'cidadao' NOT NULL,
    senha VARCHAR(200)
);


CREATE TABLE IF NOT EXISTS politica (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo varchar(100),
    descricao varchar(200),
    publico_alvo varchar(100),
    local_atuacao varchar(100)
);


CREATE TABLE IF NOT EXISTS solicitacao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario int not null,
    id_politica int not null,
    data_solicitacao DATE,
    data_atualizacao DATE,
    status_atual ENUM(
        'em analise', 
        'aprovado', 
        'aguardando documento'
    ) NOT NULL DEFAULT 'aguardando documento',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    FOREIGN KEY (id_politica) 
        REFERENCES politica(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

insert into politica (titulo, descricao, publico_alvo, local_atuacao) 
values (
    'CAPS - Centro de Atenção Psicossocial',
    'Atendimento integral em saúde mental com equipe multidisciplinar',
    'Pessoas com transtornos mentais',
    'Todo o território nacional'
);

insert into politica (titulo, descricao, publico_alvo, local_atuacao) 
values (
    'Atendimento Psicológico Gratuito',
    'Sessões de psicoterapia gratuitas em unidades básicas de saúde',
    'Toda a população que necessite',
    'Capitais e principais municípios'
);

SELECT * from politica;
