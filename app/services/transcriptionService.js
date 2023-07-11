require('dotenv').config()

const { Configuration, OpenAIApi } = require('openai')

const getTranscription = async (audio, promptExplanation) => {
  const configuration = new Configuration({
    apiKey: process.env.API_OPENAI
  })
  const openai = new OpenAIApi(configuration)
  const resp = await openai.createTranscription(
    audio,
    'whisper-1',
    promptExplanation
  )
  return resp
}

module.exports = getTranscription
