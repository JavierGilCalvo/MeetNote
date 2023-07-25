module.exports = {
  SYSTEM_MESSAGE: {
    role: 'system',
    content: 'You are an expert summary agent, you are able to summarize a transcription of a meeting, propose next steps and action items.'
  },
  EXTENDED_SUMMARY: 'EXTENDED_SUMMARY',
  EXECUTIVE_SUMMARY: 'EXECUTIVE_SUMMARY',
  NEXT_STEPS_SUMMARY: 'NEXT_STEPS_SUMMARY',
  EXTENDED_SUMMARY_TEMPERATURE: 0.3,
  EXECUTIVE_SUMMARY_TEMPERATURE: 0.4,
  NEXT_STEPS_TEMPERATURE: 0.6,
  MAX_TOKENS_EXTENDED_SUMMARY: 2000,
  MAX_TOKENS_EXECUTIVE_SUMMARY: 1000,
  MAX_TOKENS_NEXT_STEPS: 500
}
