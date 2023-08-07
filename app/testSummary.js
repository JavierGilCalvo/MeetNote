const fs = require('fs')
const path = require('path')

const generateSummary = require('./services/summaryService.js')
const { EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY, GPT_4 } = require('./constants.js')

const testInputFilesDirectory = path.resolve(__dirname, '../tests/inputTestFiles')
const testOutputFilesDirectory = path.resolve(__dirname, '../tests/outputTestFiles')

const transcriptionFilePath = path.join(testInputFilesDirectory, 'short_text.txt')
const textToSumm = fs.readFileSync(transcriptionFilePath, 'utf8')

const context = `El texto trata sobre un webinar organizado por la Asociación de Empresarios y Empresarias TIXE 
de Dos Hermanas en colaboración con el Ayuntamiento. 
El tema principal del webinar es la comunicación en la empresa, especialmente en momentos complicados o de incertidumbre, 
como los vividos durante la pandemia.`

const executiveSumm = async (summary) => {
  const executiveSummary = await generateSummary(summary, EXECUTIVE_SUMMARY, GPT_4, context)
  // Guarda el executiveSummary en un archivo txt
  fs.writeFile(path.join(testOutputFilesDirectory, 'executive_summary.txt'), executiveSummary, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err)
    } else {
      console.log(`El executiveSummary se ha guardado en ${testOutputFilesDirectory}`)
    }
  })
}

const completeSumm = async () => {
  const summary = await generateSummary(textToSumm, EXTENDED_SUMMARY, GPT_4, context)

  // Guarda el executiveSummary en un archivo txt
  fs.writeFile(path.join(testOutputFilesDirectory, 'full_summary.txt'), summary, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err)
    } else {
      console.log(`El summary se ha guardado en ${testOutputFilesDirectory}`)
    }
  })

  return summary
}

const nextSteps = async (summary) => {
  const nextSteps = await generateSummary(summary, NEXT_STEPS_SUMMARY, GPT_4, context)

  // Guarda el executiveSummary en un archivo txt
  fs.writeFile(path.join(testOutputFilesDirectory, 'next_steps.txt'), nextSteps, (err) => {
    if (err) {
      console.error('Error al guardar el archivo:', err)
    } else {
      console.log(`El nextSteps se ha guardado en ${testOutputFilesDirectory}`)
    }
  })
}

async function testSummary () {
  const summ = await completeSumm()
  await executiveSumm(summ)
  await nextSteps(summ)
}

testSummary()
