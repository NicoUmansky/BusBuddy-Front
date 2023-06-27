const mysql = require('mysql2');

require('dotenv').config()


const connection = mysql.createConnection(process.env.DATABASE_URL)
// console.log('Connected to PlanetScale!')
// connection.end()

const { PrismaClient } = require('@prisma/client');
const { parse } = require('dotenv');
const prisma = new PrismaClient()

async function getUser(id){
    const user = await prisma.Usuarios.findUnique({
        where: {
            id: parseInt(id)
        }
        });
    return user
}

async function createUser(user){
    const newUser = await prisma.Usuarios.create({
        data: user
    });
    return newUser
}

async function getRequest(id){
    const request = await prisma.Solicitudes.findUnique({
        where: {
            id: parseInt(id)
        },        
        select: {
            linea: true,
            usuario: true,
            parada: true,
        }
        });
    return request
}

async function createRequest(request){
    const newRequest = await prisma.Solicitudes.create({
        data: parse(request)
    });

    return newRequest
}


module.exports = { getUser, createUser, getRequest, createRequest}