require('dotenv').config()
const openai = require('openai')
const configuration = new openai.Configuration({ apiKey: process.env.API_OPENAI })

const { SYSTEM_MESSAGE_EXTENDED_SUMMARY, SYSTEM_MESSAGE_EXECUTIVE_SUMMARY, SYSTEM_MESSAGE_NEXT_STEPS_SUMMARY, GPT_3, GPT_4, EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY, MAX_TOKENS_EXTENDED_SUMMARY, MAX_TOKENS_EXECUTIVE_SUMMARY, MAX_TOKENS_NEXT_STEPS, EXTENDED_SUMMARY_TEMPERATURE, EXECUTIVE_SUMMARY_TEMPERATURE, NEXT_STEPS_TEMPERATURE } = require('../constants')

/**
 * Best practices: https://platform.openai.com/docs/guides/gpt-best-practices
 * Code examples: https://github.com/openai/openai-cookbook
 */

const userSummaryExtended = (fragment, context = '') => {
  return {
    role: 'user',
    content: `
      We have a fragment of a meeting transcript and its context. We need a brief summary of that fragment. 
      Make the summary impersonal and avoid specifically mentioning meeting participants, you can use third-person phrases and avoid naming individuals.
      Your response must be in the same language as the FRAGMENT TRANSCRIPT used for your response, NOT in the same language than this paragraph. For example, if the FRAGMENT TRANSCRIPT is in spanish, the summary must be in spanish.

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
        We have a summary of a meeting transcript and its description, we need an executive summary.
        We need first of all, the key points discussed during the meeting.
        Appart from that, this executive summary should also have:
          - A brief description of the purpose and objective of the meeting.
          - Conclusions or important decisions made during the meeting.
        
         Make the summary impersonal and avoid specifically mentioning meeting participants, you can use third-person phrases and avoid naming individuals.
        Your response must be in the same language as the MEETING SUMMARY used for your response, NOT in the same language than this paragraph. For example, if the MEETING SUMMARY is in spanish, the summary must be in spanish.
  
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
        We have a summary of a meeting transcript and its description. We need the next steps. 
        Make the response impersonal and avoid specifically mentioning meeting participants, you can use third-person phrases and avoid naming individuals.
        Your response must be in the same language as the MEETING SUMMARY used for your response, NOT in the same language than this paragraph. For example, if the MEETING SUMMARY is in spanish, the summary must be in spanish.
  
        ${description.length > 0 ? 'Meeting Description: ' + description : ''}
        
        Meeting Summary:
        ${summary}
      `
  }
}

const checkInput = (textToSummarize, purpose, model, context) => {
  if (!textToSummarize || typeof textToSummarize !== 'string') {
    throw new Error('Invalid input: textToSummarize must be a non-empty string.')
  }

  if (!purpose || (purpose !== EXTENDED_SUMMARY && purpose !== EXECUTIVE_SUMMARY && purpose !== NEXT_STEPS_SUMMARY)) {
    throw new Error(`Invalid purpose: purpose must be one of ${EXTENDED_SUMMARY}, ${EXECUTIVE_SUMMARY}, or ${NEXT_STEPS_SUMMARY}.`)
  }

  if (!model || (model !== GPT_3 && model !== GPT_4)) {
    throw new Error(`Invalid model: model must be one of ${GPT_3} or ${GPT_4}.`)
  }
}

const generateParameters = (textToSummarize, purpose, model, context) => {
  checkInput(textToSummarize, purpose, model, context)

  const userMessageSummary = purpose === EXTENDED_SUMMARY
    ? userSummaryExtended(textToSummarize, context)
    : purpose === EXECUTIVE_SUMMARY ? executiveSummary(textToSummarize, context) : nextSteps(textToSummarize, context)

  const systemMessageSummary = purpose === EXTENDED_SUMMARY
    ? SYSTEM_MESSAGE_EXTENDED_SUMMARY
    : purpose === EXECUTIVE_SUMMARY ? SYSTEM_MESSAGE_EXECUTIVE_SUMMARY : SYSTEM_MESSAGE_NEXT_STEPS_SUMMARY

  const maxTokensSummary = purpose === EXTENDED_SUMMARY
    ? MAX_TOKENS_EXTENDED_SUMMARY
    : purpose === EXECUTIVE_SUMMARY
      ? MAX_TOKENS_EXECUTIVE_SUMMARY
      : MAX_TOKENS_NEXT_STEPS

  const temperatureSummary = purpose === EXTENDED_SUMMARY
    ? EXTENDED_SUMMARY_TEMPERATURE
    : purpose === EXECUTIVE_SUMMARY ? EXECUTIVE_SUMMARY_TEMPERATURE : NEXT_STEPS_TEMPERATURE

  return {
    model,
    messages: [
      systemMessageSummary,
      userMessageSummary
    ],
    max_tokens: maxTokensSummary,
    temperature: temperatureSummary
  }
}

async function generateSummary (textToSummarize, purpose, model, context = '') {
  const parameters = generateParameters(textToSummarize, purpose, model, context)

  const openaiChat = new openai.OpenAIApi(configuration)

  const gptResponse = await openaiChat.createChatCompletion(parameters)

  return gptResponse.data.choices[0].message.content
}

module.exports = generateSummary
