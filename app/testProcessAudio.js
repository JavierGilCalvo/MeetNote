// const { compressAudioTestCommand, splitAudioExec } = require('./services/audioProcessingService')
const getTranscription = require('./services/transcriptionService.js')
const splitAudio = require('./services/splitAudioService.js')
const fs = require('fs')
const path = require('path')

// compressAudioTestCommand()
// splitAudioExec()

async function pruebaTranscripcionMasDiez (audioFilePath) {
  const audioFile = fs.createReadStream(audioFilePath)
  const promptExplanation =
        `Por favor, proporciona una transcripción precisa y literal del audio.
        Debería reflejar fielmente lo que se dijo, incluyendo cualquier pausa o repetición.
        La transcripción debe mantenerse en primera persona y no interpretar ni añadir nada que no esté explícitamente dicho en el audio.
        Tampoco se deben añadir fillers que no aportan nada a lo que se está diciendo.`

  // We attempt transcription.
  console.log(`Transcribiendo el segmento con el siguiente path: ${audioFilePath}`)
  const { data: { text } } = await getTranscription(audioFile, promptExplanation)
  const outputPath = path.resolve(__dirname, './mocks/results/resultadoPrueba.txt')
  try {
    fs.writeFileSync(outputPath, text)
    console.log('Archivo escrito con éxito')
  } catch (err) {
    console.error('Ha ocurrido un error al escribir el archivo:', err)
  }
}

splitAudio(path.resolve(__dirname, './mocks/ejemplo_largo.mp3'), path.resolve(__dirname, './mocks/results'), 1200).then(segments => {
  segments.forEach(segment => {
    console.log(`Transcribiendo el siguiente segmento: ${segment}`)
    pruebaTranscripcionMasDiez(path.resolve(__dirname, `./mocks/${segment}`))
  })
})