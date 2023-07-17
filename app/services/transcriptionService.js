require('dotenv').config()

const { Configuration, OpenAIApi } = require('openai')
const maxBodyLength = 23 * 1024 * 1024
const maxContentLength = 23 * 1024 * 1024

const getTranscription = async (audio, promptExplanation) => {
  console.log('Obteniendo API_KEY...')
  const configuration = new Configuration({
    apiKey: process.env.API_OPENAI
  })
  console.log(process.env.API_OPENAI)
  const openai = new OpenAIApi(configuration)
  console.log('Creando transcripción...')
  const resp = await openai.createTranscription(
    audio,
    'whisper-1',
    promptExplanation,
    'json',
    0,
    'es',
    {
      maxContentLength,
      maxBodyLength
    }
  )
  console.log('¡Transcripción Creada!')
  return resp
}

module.exports = getTranscription
