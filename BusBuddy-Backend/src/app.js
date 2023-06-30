const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const mysql = require('mysql2')

const app = express();
const {getUser, createUser, getRequest, createRequest} = require('./database.js')
require('dotenv').config()

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

app.post('/FindUser', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.usuarios.findFirst({
      where: {
        email: email,
        password: password
        }
    }); 
    res.json(user);

    
  });

app.get('/user/:id', async (req, res) => {
    const  id = req.params.id;
    const user = getUser(id).then((user) => {
        res.json(user);
})
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


app.post('/CreateUser', async (req, res) => {
    const user = await createUser(req.body).then((user) => {    
        if (user){
                res.json(user);
                
        }
        else{
            res.json({msg: "User not created"});
        }

    })
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
    const lineas = await Prisma.Lineas.findMany(
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

app.get('/paradas/:id', async(req, res) => {
    const { id } = req.params;
    const parada = await prisma.Paradas.findUnique({
        where: {
            id: parseInt(id)
        }
    });
    res.json(parada);
});

// Rutas de solicitudes

app.post('/CrearSolicitud', async(req, res) => {
    const solicitud = await prisma.Solicitudes.create({
        data: req.body,
    });
    res.json(solicitud);
});

app.get('/solicitudes', async(req, res) => {
    const solicitudes = await prisma.Solicitudes.findMany();
    res.json({solicitudes});
});

app.get('/solicitudes/:id', async(req, res) => {
    const { id } = req.params;
    const solicitudes = getRequest(id).then((solicitudes) => {
    res.json(solicitudes);
})
});

module.exports = app;