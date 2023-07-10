// Importamos los módulos necesarios
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

// Importamos nuestros controladores
const transcriptController = require('./controllers/transcriptController')
const summaryController = require('./controllers/summaryController')

// Iniciamos nuestra aplicación Express
const app = express()

// Configuramos nuestra aplicación para usar bodyParser y cors
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Definimos una ruta para manejar las solicitudes de transcripción
app.post('/transcript', transcriptController.getTranscript)

// Definimos una ruta para manejar las solicitudes de resumen
app.post('/summary', summaryController.getSummary)

// Configuramos la aplicación para escuchar en un puerto específico
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor en marcha en el puerto ${PORT}`)
})

const useReplicate = require('./src/modules/transcription/transcription')

console.log('Comenzamos la replicación...')

useReplicate().then(() => {
  console.log('TRANSCRITO!')
})
