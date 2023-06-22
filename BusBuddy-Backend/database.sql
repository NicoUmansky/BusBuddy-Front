CREATE DATABASE BusBuddy_DB;
USE BusBuddy_DB;

CREATE TABLE Usuarios (
    id INT NOT NULL AUTO_INCREMENT,
    nombreapellido VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

-- CREATE TABLE Colectiveros (
--     id INT NOT NULL AUTO_INCREMENT,
--     linea VARCHAR(50) NOT NULL,
--     nombreapellido VARCHAR(50) NOT NULL,
--     PRIMARY KEY (id)
-- );

CREATE TABLE Colectivo (
    id INT NOT NULL AUTO_INCREMENT,
    linea VARCHAR(50) NOT NULL,
    interno VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Paradas (
    id INT NOT NULL AUTO_INCREMENT,
    linea VARCHAR(50) NOT NULL,
    latitud VARCHAR(50) NOT NULL,
    longitud VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Solicitudes (
    id INT NOT NULL AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_linea INT NOT NULL,
    paradaDestino INT NOT NULL,
    paradaInicio INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Lineas (
    id INT NOT NULL AUTO_INCREMENT,
    linea VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);
