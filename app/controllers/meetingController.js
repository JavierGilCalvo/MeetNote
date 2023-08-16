const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

// Constants and Utils
const { EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY, GPT_4, TEMP_AUDIO_DIR_NAME, TEMP_MEETING_REPORT_DIR_NAME } = require('../constants')
// const removeFile = require('../utils')

// Services
const splitAudio = require('../services/splitAudioService')
const getTranscription = require('../services/transcriptionService')
const generateSummary = require('../services/summaryService')

// Output Directories
const OUTPUT_AUDIO_TEMP_PATH = path.resolve(__dirname, TEMP_AUDIO_DIR_NAME)
const OUTPUT_MEETING_REPORT_TEMP_PATH = path.resolve(__dirname, TEMP_MEETING_REPORT_DIR_NAME)

exports.processMeeting = async (req, res) => {
  const { description } = req.body
  const audioFilePath = req.file.path // Ruta del archivo cargado
  try {
    // Transcription
    const transcriptionFragments = await getTranscriptionFragments(audioFilePath, description) // Assuming you're sending the file path

    // Meeting Report
    const meetingReport = await generateMeetingReport(transcriptionFragments, description)

    // Document
    const document = await generateDocument(meetingReport)

    // You can combine these results into an appropriate response object
    res.json(document)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getTranscriptionFragments = async (audioFilePath, description) => {
  const transcriptionFragments = []
  try {
    const audioFragments = await splitAudio(audioFilePath)
    // Remove the original audio since we already have its fragments
    // removeFile(audioFilePath)

    for (const fragment of audioFragments) {
      // We attempt transcription.
      const fragmentPath = path.join(OUTPUT_AUDIO_TEMP_PATH, fragment)
      const { data: { text } } = await getTranscription(fragmentPath, description)
      transcriptionFragments.push(text)

      // Remove the temporal fragment already transcripted
      // removeFile(fragmentPath)
    }

    return transcriptionFragments
  } catch (err) {
    console.log('Error while transcripting: ' + err)
  }
}

const generateMeetingReport = async (transcriptionFragments, description = '') => {
  try {
    let fullSummary = ''

    // Generate summaries for each transcription fragment and combine them into a full summary
    for (const fragment of transcriptionFragments) {
      const summary = await generateSummary(fragment, EXTENDED_SUMMARY, GPT_4, description)
      fullSummary += summary
    }

    // Generate the executive overview from the full summary
    const executiveSummary = await generateSummary(fullSummary, EXECUTIVE_SUMMARY, GPT_4, description)

    // Generate the next steps from the full summary
    const nextSteps = await generateSummary(fullSummary, NEXT_STEPS_SUMMARY, GPT_4, description)

    // Create the document object
    const document = {
      executiveSummary,
      fullSummary,
      nextSteps
    }

    return document
  } catch (err) {
    console.log('Error while generating meeting report: ' + err)
  }
}

async function generateDocument (meetingReport) {
  const id = uuid.v4()
  const outputFilePrefix = `output_${id}_`

  const documentText = `
   ${meetingReport.executiveSummary}\n
   ${meetingReport.fullSummary}\n
   ${meetingReport.nextSteps}\n
`
  fs.writeFileSync(path.join(OUTPUT_MEETING_REPORT_TEMP_PATH, outputFilePrefix + '.txt'), documentText)

  return documentText
}
