module.exports = {
  SYSTEM_MESSAGE_EXTENDED_SUMMARY: {
    role: 'system',
    content: 'You are an expert summary agent, you are able to summarize a fragment of a meeting transcript'
  },
  SYSTEM_MESSAGE_EXECUTIVE_SUMMARY: {
    role: 'system',
    content: 'You are an expert summary agent, you are able to summarize the most important points of a meeting summary, organize them in bullets and after that, generate an executive overview.'
  },
  SYSTEM_MESSAGE_NEXT_STEPS_SUMMARY: {
    role: 'system',
    content: 'You are an expert business strategist, you are able to propose next steps and actionable items from a meeting summary, in order to maximize the outcome of that meeting.'
  },
  EXTENDED_SUMMARY: 'EXTENDED_SUMMARY',
  EXECUTIVE_SUMMARY: 'EXECUTIVE_SUMMARY',
  NEXT_STEPS_SUMMARY: 'NEXT_STEPS_SUMMARY',
  EXTENDED_SUMMARY_TEMPERATURE: 0.2,
  EXECUTIVE_SUMMARY_TEMPERATURE: 0.3,
  NEXT_STEPS_TEMPERATURE: 0.6,
  MAX_TOKENS_EXTENDED_SUMMARY: 2000,
  MAX_TOKENS_EXECUTIVE_SUMMARY: 1000,
  MAX_TOKENS_NEXT_STEPS: 500,
  GPT_3: 'gpt-3.5-turbo-16k',
  GPT_4: 'gpt-4'
}
