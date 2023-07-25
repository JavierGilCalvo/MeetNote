const { generateSummary } = require('./summaryService')
const { EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY } = require('../constants')

async function generateDocument (transcriptionFragments) {
  let fullSummary = ''

  // Generate summaries for each transcription fragment and combine them into a full summary
  for (const fragment of transcriptionFragments) {
    const summary = await generateSummary(fragment, EXTENDED_SUMMARY, 'gpt-3.5-turbo', '')
    fullSummary += summary.text
  }

  // Generate the executive overview from the full summary
  const executiveOverview = await generateSummary(fullSummary, EXECUTIVE_SUMMARY, 'gpt-3.5-turbo', '')

  // Generate the next steps from the full summary
  const nextSteps = await generateSummary(fullSummary, NEXT_STEPS_SUMMARY, 'gpt-3.5-turbo', '')

  // Create the document
  const document = {
    executiveOverview,
    fullSummary,
    nextSteps
  }

  // Here, you can choose to write the document to a file, send it in an email, etc.

  return document
}

module.exports = { generateDocument }
