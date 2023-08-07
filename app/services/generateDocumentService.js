const fs = require('fs')
const uuid = require('uuid')
const path = require('path')
const { generateSummary } = require('./summaryService')
const { EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY, GPT_3 } = require('../constants')

async function generateDocument (transcriptionFragments, description, outputDirectory) {
  const id = uuid.v4()
  const outputFilePrefix = `output_${id}_`
  let fullSummary = ''

  // Generate summaries for each transcription fragment and combine them into a full summary
  for (const fragment of transcriptionFragments) {
    const summary = await generateSummary(fragment, EXTENDED_SUMMARY, GPT_3, description)
    fullSummary += summary.text
  }

  // Generate the executive overview from the full summary
  const executiveSummary = await generateSummary(fullSummary, EXECUTIVE_SUMMARY, GPT_3, description)

  // Generate the next steps from the full summary
  const nextSteps = await generateSummary(fullSummary, NEXT_STEPS_SUMMARY, GPT_3, description)

  // Create the document
  const document = {
    executiveSummary,
    fullSummary,
    nextSteps
  }

  const documentText = `
  Executive Summary: ${document.executiveOverview}\n
  Summary: ${document.fullSummary}\n
  Next Steps: ${document.nextSteps}\n
`
  fs.writeFileSync(path.join(outputDirectory, outputFilePrefix + '%03d.txt'), documentText)

  return document
}
module.exports = { generateDocument }
