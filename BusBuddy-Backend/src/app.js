const { Prisma } = require('@prisma/client');
const express = require('express');
const mysql = require('mysql2')

const app = express();

require('dotenv').config()
 const connection = mysql.createConnection(process.env.DATABASE_URL)
// console.log('Connected to PlanetScale!')
// connection.end()

const { PrismaClient } = require('@prisma/client');
const { parse } = require('dotenv');
const prisma = new PrismaClient()

app.use(express.json());
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

// Rutas de usuarios
app.get('/users', async(req, res) => {
    const users = await prisma.Usuarios.findMany();
    res.json({users});
});

app.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.Usuarios.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    res.json(user);
    
});

app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.Usuarios.update({
        where: {
            id: parseInt(id)
        },
        data: req.body
    });
    res.json(user);
});


app.post('/user', async (req, res) => {
    const user = await prisma.Usuarios.create({
        data: req.body
    });
    res.json(user);
});

app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.Usuarios.delete({
        where: {
            id: parseInt(id)
        }
    });
    res.send({msg: "User deleted successfully"});
});

// Rutas de lineas

app.get('/lineas', async(req, res) => {
    const lineas = await prisma.Lineas.findMany(
        {
            include: {
                colectivos: true,
            }
        }
    );
    
    res.json({lineas});
});

app.get('/lineas/:id', async (req, res) => {
    const { id } = req.params;
    const linea = await prisma.Lineas.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            colectivos: true,
            paradas: true,
        }
    });
    res.json(linea);
});

// Rutas de Colectivos

app.post('/colectivos/:id', async(req, res) => {
    const { id } = req.params;
    const parada = await prisma.Colectivo.create({
        data: req.body,
    });
    res.json(parada);
});

// Rutas de Paradas

app.post('/paradas/:id', async(req, res) => {
    const { id } = req.params;
    const parada = await prisma.Paradas.create({
        data: req.body,
    });
    res.json(parada);
});

module.exports = app;