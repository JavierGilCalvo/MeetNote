const getTranscription = require('./services/transcriptionService.js')
const splitAudio = require('./services/splitAudioService.js')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const testInputFilesDirectory = path.resolve(__dirname, '../tests/inputTestFiles')
const testOutputFilesDirectory = path.resolve(__dirname, '../tests/outputTestFiles')
let segments = []

async function pruebaSplit () {
  // Arrange
  const audioFilePath = path.join(testInputFilesDirectory, 'long_example.mp3')

  // Act
  segments = await splitAudio(audioFilePath, testOutputFilesDirectory)
}

async function pruebaTranscript () {
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
    const indexSegment = segments.indexOf(segment)
    fs.writeFileSync(path.join(testOutputFilesDirectory, outputFilePrefix + '_0' + indexSegment + '.txt'), text)
  }
}

async function pruebaAudio () {
  await pruebaSplit()
  await pruebaTranscript()
}

pruebaAudio()
