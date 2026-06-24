-- Active: 1781899678783@@127.0.0.1@3306@jest_db
CREATE DATABASE IF NOT EXISTS jest_db;

use jest_db;

DROP TABLE usuario;

CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    perfil ENUM('cidadao','admin') DEFAULT 'cidadao' NOT NULL,
    senha VARCHAR(200)
);

SELECT * from usuario;