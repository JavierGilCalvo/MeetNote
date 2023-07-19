require('dotenv').config()
const openai = require('openai')
openai.apiKey = process.env.API_OPENAI
const { SYSTEM_MESSAGE, USER_MESSAGE, MAX_TOKENS } = require('../constants')

/**
 * Best practices: https://platform.openai.com/docs/guides/gpt-best-practices
 * Code examples: https://github.com/openai/openai-cookbook
 *
 *
 */
async function generateSummary (transcript, description = '') {
  try {
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_MESSAGE },
        {
          role: 'user',
          content: USER_MESSAGE + (description.length > 0 ? 'Meeting Description: ' + description : '') + '\n' + transcript
        }
      ],
      max_tokens: MAX_TOKENS
    })

    const summary = gptResponse.data.choices[0].message.content.trimEnd().trimStart()

    const actionPromptResponse = await openai.Completion.create({
      engine: 'davinci',
      prompt: `${summary}\n\nAction Items:`,
      temperature: 0.2,
      max_tokens: 200
    })

    const actionItems = actionPromptResponse.data.choices[0].text.trim()

    const nextStepsResponse = await openai.Completion.create({
      engine: 'davinci',
      prompt: `${summary}\n${actionItems}\n\nNext Steps:`,
      temperature: 0.2,
      max_tokens: 200
    })

    const nextSteps = nextStepsResponse.data.choices[0].text.trim()

    return { summary, actionItems, nextSteps }
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  generateSummary
}
