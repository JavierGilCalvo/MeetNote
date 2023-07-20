const getTranscription = require('../../app/services/transcriptionService.js')
const splitAudio = require('../../app/services/splitAudioService.js')
const fs = require('fs')
const path = require('path')

const testInputFilesDirectory = path.resolve(__dirname, '../inputTestFiles')
const testOutputFilesDirectory = path.resolve(__dirname, '../outputTestFiles')

/* eslint-env jest */
describe('TranscriptionService', () => {
  describe('splitAudio', () => {
    it('splits the audio into segments', async () => {
      // Arrange
      const audioFilePath = `${testInputFilesDirectory}/short_example.mp3`

      // Act
      const segments = await splitAudio(audioFilePath, testOutputFilesDirectory, 120)
      // Assert
      expect(segments).toBeDefined()
      expect(segments.length).toBeGreaterThan(0)
      // additional assertions...
    })
  })

  describe('transcribeSegment', () => {
    test('should transcribe audio and return transcript', async () => {
      // We read the sample audio file.
      const audioFile = fs.createReadStream(`${testInputFilesDirectory}/short_example.m4a`)
      const promptExplanation =
      `Por favor, proporciona una transcripción precisa y literal del audio. 
      Debería reflejar fielmente lo que se dijo, incluyendo cualquier pausa o repetición. 
      La transcripción debe mantenerse en primera persona y no interpretar ni añadir nada que no esté explícitamente dicho en el audio.
      Tampoco se deben añadir fillers que no aportan nada a lo que se está diciendo.`

      // We attempt transcription.
      const { data: { text } } = await getTranscription(audioFile, promptExplanation)

      // We verify that the result is a string (if your function returns an object with more data, you should adjust this).
      expect(typeof text).toBe('string')

      // We verify that the result is not empty.
      expect(text).not.toBe('')

      // We can even check that the length of the string is reasonable (adjust the value according to our needs).
      expect(text.length).toBeGreaterThan(100) // This value may vary depending on the sample audio.
    })
  })

  afterAll(() => {
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
  })
})
