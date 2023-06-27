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
            id: id
        }
        });
    return {message: "Hola"}
}

module.exports = { getUser}