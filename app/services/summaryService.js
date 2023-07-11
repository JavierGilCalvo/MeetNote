require('dotenv').config()
const openai = require('openai')

openai.apiKey = process.env.API_OPENAI

/**
 * Best practices: https://platform.openai.com/docs/guides/gpt-best-practices
 * Code examples: https://github.com/openai/openai-cookbook
 *
 *
 */
async function generateSummary (transcript, description) {
  try {
    const gptResponse = await openai.Completion.create({
      engine: 'davinci',
      prompt: `We have a meeting transcript and its description. We need a summary, the most important points, action items, and next steps.

            Meeting Description:
            ${description}

            Meeting Transcript:
            ${transcript}

            Summary:
            `,
      temperature: 0.2,
      max_tokens: 300
    })

    const summary = gptResponse.data.choices[0].text.trim()

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
