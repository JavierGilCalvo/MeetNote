const getTranscription = require('../../app/services/transcriptionService.js')
const splitAudio = require('../../app/services/splitAudioService.js')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const testInputFilesDirectory = path.resolve(__dirname, '../inputTestFiles')
const testOutputFilesDirectory = path.resolve(__dirname, '../outputTestFiles')
let segments = []

/* eslint-env jest */
describe('TranscriptionService', () => {
  describe('splitAudio', () => {
    it('splits the audio into segments', async () => {
      // Arrange
      const audioFilePath = path.join(testInputFilesDirectory, 'long_example.mp3')

      // Act
      segments = await splitAudio(audioFilePath, testOutputFilesDirectory)
      // Assert
      expect(segments).toBeDefined()
      expect(segments.length).toBeGreaterThan(0)
      // additional assertions...
    })
  })

  describe('transcribeSegment', () => {
    test('should transcribe audio and return transcript', async () => {
      const id = uuid.v4()
      const outputFilePrefix = `output_${id}_`
      const promptExplanation =
      `Por favor, proporciona una transcripción precisa y literal del audio. 
      Debería reflejar fielmente lo que se dijo, incluyendo cualquier pausa o repetición. 
      La transcripción debe mantenerse en primera persona y no interpretar ni añadir nada que no esté explícitamente dicho en el audio.
      Tampoco se deben añadir fillers que no aportan nada a lo que se está diciendo.`
      // We read the sample audio file.
      for (const segment of segments) {
        // We attempt transcription.
        const { data: { text } } = await getTranscription(path.join(testOutputFilesDirectory, segment), promptExplanation)

        fs.writeFileSync(path.join(testOutputFilesDirectory, outputFilePrefix + '%03d.txt'), text)
        // We verify that the result is a string (if your function returns an object with more data, you should adjust this).
        expect(typeof text).toBe('string')

        // We verify that the result is not empty.
        expect(text).not.toBe('')

        // We can even check that the length of the string is reasonable (adjust the value according to our needs).
        expect(text.length).toBeGreaterThan(100) // This value may vary depending on the sample audio.
      }
    })
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
