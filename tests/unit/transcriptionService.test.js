const getTranscription = require('../../app/services/transcriptionService.js')
const fs = require('fs')
const path = require('path')

/* eslint-env jest */
describe('TranscriptionService', () => {
  test('should transcribe audio and return transcript', async () => {
    // We read the sample audio file.
    const audioFile = fs.createReadStream(path.resolve(__dirname, '../../app/mocks/output1.mp3'))
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
