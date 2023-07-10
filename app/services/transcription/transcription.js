require('dotenv').config()

const { Configuration, OpenAIApi } = require('openai')

const getTranscription = async (audio, explanationGuide) => {
  const configuration = new Configuration({
    apiKey: process.env.API_OPENAI
  })
  const openai = new OpenAIApi(configuration)
  const resp = await openai.createTranscription(
    audio,
    'whisper-1',
    explanationGuide
  )
  return resp
}

module.exports = getTranscription
