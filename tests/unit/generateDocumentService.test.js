const generateDocument = require('../../app/services/generateDocumentService.js')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

/* eslint-env jest */
describe('GenerateDocumentService', () => {
  test('should generate a summary and its document', async () => {
    const id = uuid.v4()
    const outputFilePrefix = `output_${id}_`
    const textDescription =
        `El texto trata sobre un webinar organizado por la Asociación de Empresarios y Empresarias TIXE 
        de Dos Hermanas en colaboración con el Ayuntamiento. El tema principal del webinar es la comunicación en la empresa, 
        especialmente en momentos complicados o de incertidumbre, como los vividos durante la pandemia.`
        // We read the sample audio file.

    const { data: { text } } = await getTranscription(audioFile, promptExplanation)

    fs.writeFileSync(path.join(testOutputFilesDirectory, outputFilePrefix + '%03d.txt'), text)
    // We verify that the result is a string (if your function returns an object with more data, you should adjust this).
    expect(typeof text).toBe('string')

    // We verify that the result is not empty.
    expect(text).not.toBe('')

    // We can even check that the length of the string is reasonable (adjust the value according to our needs).
    expect(text.length).toBeGreaterThan(100) // This value may vary depending on the sample audio.
  })

  /* afterAll(() => {
    // After all tests, we remove the content of the test directory
    if (fs.existsSync(testOutputFilesDirectory)) {
      const files = fs.readdirSync(testOutputFilesDirectory)
      for (const file of files) {
        // Skip .gitkeep
        if (file !== '.gitkeep') {
          fs.unlinkSync(path.join(testOutputFilesDirectory, file))
        }
      }
    }
  }) */
})
