require('dotenv').config()
const openai = require('openai')
openai.apiKey = process.env.API_OPENAI
const { SYSTEM_MESSAGE, EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, MAX_TOKENS_EXTENDED_SUMMARY, MAX_TOKENS_EXECUTIVE_SUMMARY, MAX_TOKENS_NEXT_STEPS, EXTENDED_SUMMARY_TEMPERATURE, EXECUTIVE_SUMMARY_TEMPERATURE, NEXT_STEPS_TEMPERATURE } = require('../constants')

/**
 * Best practices: https://platform.openai.com/docs/guides/gpt-best-practices
 * Code examples: https://github.com/openai/openai-cookbook
 */

const userSummaryExtended = (fragment, context = '') => {
  return {
    role: 'user',
    content: `
      We have a fragment of a meeting transcript and its context. We need a brief summary of that fragment. 
      Detect the language of the transcription and give a response in the same one.

      ${context.length > 0 ? 'Fragment Context: ' + context : ''}
      
      Fragment Transcript:
      ${fragment}
    `
  }
}

const executiveSummary = (summary, description = '') => {
  return {
    role: 'user',
    content: `
        We have a summary of a meeting transcript and its description. We need the the most important points and an executive overview. 
        Detect the language of the transcription and give a response in the same one.
  
        ${description.length > 0 ? 'Meeting Description: ' + description : ''}
        
        Meeting Summary:
        ${summary}
      `
  }
}

const nextSteps = (summary, description = '') => {
  return {
    role: 'user',
    content: `
        We have a summary of a meeting transcript and its description. We need the action items and next steps. 
        Detect the language of the transcription and give a response in the same one.
  
        ${description.length > 0 ? 'Meeting Description: ' + description : ''}
        
        Meeting Summary:
        ${summary}
      `
  }
}

const generateParameters = (textToSummarize, purpose, model, context) => {
  const userMessageSummary = purpose === EXTENDED_SUMMARY ? userSummaryExtended(textToSummarize, context) : purpose === EXECUTIVE_SUMMARY ? executiveSummary(textToSummarize, context) : nextSteps(textToSummarize, context)
  const maxTokensSummary = purpose === EXTENDED_SUMMARY ? MAX_TOKENS_EXTENDED_SUMMARY : purpose === EXECUTIVE_SUMMARY ? MAX_TOKENS_EXECUTIVE_SUMMARY : MAX_TOKENS_NEXT_STEPS
  const temperatureSummary = purpose === EXTENDED_SUMMARY ? EXTENDED_SUMMARY_TEMPERATURE : purpose === EXECUTIVE_SUMMARY ? EXECUTIVE_SUMMARY_TEMPERATURE : NEXT_STEPS_TEMPERATURE

  return {
    model,
    messages: [
      SYSTEM_MESSAGE,
      userMessageSummary
    ],
    max_tokens: maxTokensSummary,
    temperature: temperatureSummary
  }
}

async function generateSummary (textToSummarize, purpose, model, context = '') {
  const parameters = generateParameters(textToSummarize, purpose, model, context)

  const gptResponse = await openai.createChatCompletion(parameters)

  return gptResponse.data.choices[0].message.content
}

module.exports = {
  generateSummary
}
