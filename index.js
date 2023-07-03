require('dotenv').config()
const useReplicate = require('./src/modules/transcription/transcription')

console.log('Comenzamos la replicación...')

useReplicate().then(() => {
    console.log('TRANSCRITO!')
})

