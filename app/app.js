// Importamos los módulos necesarios
const express = require('express')
const routes = require('./routes/routes')
const cors = require('cors')
require('dotenv').config()

// Iniciamos nuestra aplicación Express
const app = express()

// Configuramos nuestra aplicación para usar json y cors
app.use(cors())
app.use(express.json())

// Definimos el enrutador para manejar las solicitudes
app.use('/api/v1', routes)

// Configuramos la aplicación para escuchar en un puerto específico
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})
