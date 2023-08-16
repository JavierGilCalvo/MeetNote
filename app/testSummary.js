const generateSummary = require('./services/summaryService')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const { EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY, GPT_4, TEMP_MEETING_REPORT_DIR_NAME } = require('./constants')

const OUTPUT_MEETING_REPORT_TEMP_PATH = path.resolve(__dirname, TEMP_MEETING_REPORT_DIR_NAME)
const INPUT_TEST_PATH = path.resolve(__dirname, './mocks')

const descriptionTranscription = `El texto trata sobre un webinar organizado por la Asociación de Empresarios y Empresarias TIXE 
de Dos Hermanas en colaboración con el Ayuntamiento. 
El tema principal del webinar es la comunicación en la empresa, especialmente en momentos complicados o de incertidumbre, 
como los vividos durante la pandemia.`

const generateMeetingReport = async (transcriptionFragments, description = '') => {
  try {
    let fullSummary = ''
    let context = description

    // Generate summaries for each transcription fragment and combine them into a full summary
    for (const fragment of transcriptionFragments) {
      const summary = await generateSummary(fragment, EXTENDED_SUMMARY, GPT_4, context)
      fullSummary += summary
      context = summary
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
  if (!fs.existsSync(OUTPUT_MEETING_REPORT_TEMP_PATH)) {
    fs.mkdirSync(OUTPUT_MEETING_REPORT_TEMP_PATH, { recursive: true })
  }

  const id = uuid.v4()
  const outputFilePrefix = `output_${id}_`

  const documentText = `
   ${meetingReport.executiveSummary}\n
  Summary:\n
   ${meetingReport.fullSummary}\n
   ${meetingReport.nextSteps}\n
`
  fs.writeFileSync(path.join(OUTPUT_MEETING_REPORT_TEMP_PATH, outputFilePrefix + '.txt'), documentText)
}

const getFilesNames = () => {
  const files = fs.readdirSync(INPUT_TEST_PATH)
  return files
}

async function testSummary () {
  const filesToProcess = getFilesNames()
  const fragments = []
  for (const file of filesToProcess) {
    const fragment = fs.readFileSync(path.resolve(INPUT_TEST_PATH, file),
      { encoding: 'utf8', flag: 'r' })
    fragments.push(fragment)
  }

  const document = await generateMeetingReport(fragments, descriptionTranscription)
  await generateDocument(document)
}

testSummary()
