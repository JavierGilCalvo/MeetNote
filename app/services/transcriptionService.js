require('dotenv').config()

const { Configuration, OpenAIApi } = require('openai')
const maxBodyLength = 23 * 1024 * 1024
const maxContentLength = 23 * 1024 * 1024

const getTranscription = async (audio, promptExplanation) => {
  const configuration = new Configuration({
    apiKey: process.env.API_OPENAI
  })
  const openai = new OpenAIApi(configuration)
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
  return resp
}

module.exports = getTranscription
