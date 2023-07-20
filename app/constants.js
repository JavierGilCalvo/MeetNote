module.exports = {
  SYSTEM_MESSAGE: 'You are an expert summary agent, you are able to summarize a transcription of a meeting, propose next steps and action items.',
  USER_MESSAGE: `We have a meeting transcript and its description. We need a brief summary and the most important points, action items, and next steps. Detect the language of the transcription and give a response
      in the same one.
      Meeting Transcript:
      `,
  MAX_TOKENS: 3500
}
