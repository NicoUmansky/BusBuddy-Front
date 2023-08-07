const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const express = require('express');
const mysql = require('mysql2')

const app = express();
const {getUser, getLocation, createUser, getRequest, createRequest} = require('./database.js')
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

  app.get('/findLocation/:latlng', async (req, res) => {
    const { latlng } = req.params;
    const location = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&key=" + process.env.API_KEY;
    
    fetch(location)
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        res.json(data.results[0].formatted_address);
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      });
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

app.get('/Findlinea/:nro', async (req, res) => {
    const { nro } = req.params; 
    const lineas = await prisma.Lineas.findUnique({
        where: {
            linea: parseInt(nro)
        }        
    });
    if (lineas){
    res.json(lineas.id);
    }
    else{
        res.json(null);
    }
});

app.post('/Crearlinea', async(req, res) => {
    const linea = await prisma.Lineas.create({
        data: req.body,
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

app.post('/CreateParadas/:id', async(req, res) => {
    const { id } = req.params;
    var data = req.body;
    data.id_linea = parseInt(id);
    const parada = await prisma.Paradas.create({
        data: data
    });
    res.json(parada);
});

async function addParadas(direccion, latitude, longitude, id_linea){
    latitude = String(latitude);
    longitude = String(longitude);
    const creacion = fetch("http://localhost:3001/CreateParadas/" + id_linea, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            latitud: latitude,
            longitud:longitude,
            direccion: direccion
    
        })
        }).then(response => response.json())
        .then(response => {
            console.log(response);
        });

    return creacion;
    }

// addParadas("2833 RIVADAVIA AV.",-34.610177,-58.406543,2);

app.get('/paradas/', async(req, res) => {
    const parada = await prisma.Paradas.findMany();
    res.json(parada);
});

app.get('/paradas/:id_linea', async(req, res) => {
    const { id_linea } = req.params;
    const parada = await prisma.Paradas.findMany({
        where: {
            id_linea: parseInt(id_linea)
        }
    });
    res.json(parada);
});


// Rutas de solicitudes

app.post('/CrearSolicitud/', async(req, res) => {
    const solicitud = await prisma.Solicitudes.create({
        data: req.body,
    });
    res.json(solicitud.id);
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