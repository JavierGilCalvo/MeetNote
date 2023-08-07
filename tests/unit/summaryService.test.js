const fs = require('fs')
const path = require('path')

const generateSummary = require('../../app/services/summaryService.js')
const { EXTENDED_SUMMARY, EXECUTIVE_SUMMARY, NEXT_STEPS_SUMMARY, GPT_3, GPT_4 } = require('../../app/constants')

const testInputFilesDirectory = path.resolve(__dirname, '../inputTestFiles')
const testOutputFilesDirectory = path.resolve(__dirname, '../outputTestFiles')

const transcriptionFilePath = path.join(testInputFilesDirectory, 'short_text.txt')
const textToSumm = fs.readFileSync(transcriptionFilePath, 'utf8')

const specialTextFilePath = path.join(testInputFilesDirectory, 'special_characters_example.txt')
const specialText = fs.readFileSync(specialTextFilePath, 'utf8')

const context = `El texto trata sobre un webinar organizado por la Asociación de Empresarios y Empresarias TIXE 
de Dos Hermanas en colaboración con el Ayuntamiento. 
El tema principal del webinar es la comunicación en la empresa, especialmente en momentos complicados o de incertidumbre, 
como los vividos durante la pandemia.`

/* eslint-env jest */
describe('SummaryService', () => {
  it('should return an executive summary', async () => {
    jest.setTimeout(20 * 1000)
    const executiveSummary = await generateSummary(textToSumm, EXECUTIVE_SUMMARY, GPT_3, context)

    expect(executiveSummary).toBeDefined()
    expect(executiveSummary.length).toBeLessThan(textToSumm.length)

    // Guarda el executiveSummary en un archivo txt
    fs.writeFile(path.join(testOutputFilesDirectory, 'executive_summary.txt'), executiveSummary, (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err)
      } else {
        console.log(`El executiveSummary se ha guardado en ${testOutputFilesDirectory}`)
      }
    })
  })

  it('should return a complete summary', async () => {
    jest.setTimeout(10 * 1000)
    const summary = await generateSummary(textToSumm, EXTENDED_SUMMARY, GPT_3, context)

    expect(summary).toBeDefined()
    expect(summary.length).toBeLessThan(textToSumm.length)

    // Guarda el executiveSummary en un archivo txt
    fs.writeFile(path.join(testOutputFilesDirectory, 'full_summary.txt'), summary, (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err)
      } else {
        console.log(`El summary se ha guardado en ${testOutputFilesDirectory}`)
      }
    })
  })

  it('should return the next steps', async () => {
    jest.setTimeout(10 * 1000)
    const nextSteps = await generateSummary(textToSumm, NEXT_STEPS_SUMMARY, GPT_3, context)

    expect(nextSteps).toBeDefined()
    expect(nextSteps.length).toBeLessThan(textToSumm.length)

    // Guarda el executiveSummary en un archivo txt
    fs.writeFile(path.join(testOutputFilesDirectory, 'next_steps.txt'), nextSteps, (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err)
      } else {
        console.log(`El nextSteps se ha guardado en ${testOutputFilesDirectory}`)
      }
    })
  })

  it('should return an empty string for an empty input', async () => {
    try {
      await generateSummary('', EXTENDED_SUMMARY, GPT_3)
      // Si la función no lanza un error, llegamos a este punto y el test fallará
      expect(true).toBe(false)
    } catch (error) {
      // Captura el error lanzado por la función generateSummary
      expect(error.message).toBe('Invalid input: textToSummarize must be a non-empty string.')
      // Si el test llega a este punto, la función ha lanzado el error esperado
    }
  })

  it('should handle null input', async () => {
    try {
      await generateSummary(null, EXTENDED_SUMMARY, GPT_3, null)
      // Si la función no lanza un error, llegamos a este punto y el test fallará
      expect(true).toBe(false)
    } catch (error) {
      // Captura el error lanzado por la función generateSummary
      expect(error.message).toBe('Invalid input: textToSummarize must be a non-empty string.')
      // Si el test llega a este punto, la función ha lanzado el error esperado
    }
  })

  it('should handle undefined input', async () => {
    try {
      await generateSummary(undefined, EXTENDED_SUMMARY, GPT_3, undefined)
      // Si la función no lanza un error, llegamos a este punto y el test fallará
      expect(true).toBe(false)
    } catch (error) {
      // Captura el error lanzado por la función generateSummary
      expect(error.message).toBe('Invalid input: textToSummarize must be a non-empty string.')
      // Si el test llega a este punto, la función ha lanzado el error esperado
    }
  })

  it('should handle a wrong purpose', async () => {
    try {
      await generateSummary(textToSumm, '', GPT_3, context)
      // Si la función no lanza un error, llegamos a este punto y el test fallará
      expect(true).toBe(false)
    } catch (error) {
      // Captura el error lanzado por la función generateSummary
      expect(error.message).toBe(`Invalid purpose: purpose must be one of ${EXTENDED_SUMMARY}, ${EXECUTIVE_SUMMARY}, or ${NEXT_STEPS_SUMMARY}.`)
      // Si el test llega a este punto, la función ha lanzado el error esperado
    }
  })

  it('should handle a wrong model', async () => {
    try {
      await generateSummary(textToSumm, EXTENDED_SUMMARY, '', context)
      // Si la función no lanza un error, llegamos a este punto y el test fallará
      expect(true).toBe(false)
    } catch (error) {
      // Captura el error lanzado por la función generateSummary
      expect(error.message).toBe(`Invalid model: model must be one of ${GPT_3} or ${GPT_4}.`)
      // Si el test llega a este punto, la función ha lanzado el error esperado
    }
  })

  it('should handle text with special characters', async () => {
    const specialContext = `Los caracteres especiales enriquecen la comunicación escrita y la programación, 
    aportando claridad y precisión a los mensajes.
     Son fundamentales para evitar malentendidos y mantener una ortografía correcta. 
     En resumen, son elementos esenciales que mejoran la comunicación en todas sus formas.`
    const summary = await generateSummary(specialText, EXTENDED_SUMMARY, GPT_3, specialContext)

    expect(summary).toBeDefined()
  })
})
