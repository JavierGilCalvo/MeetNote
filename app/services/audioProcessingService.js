const { exec } = require('child_process')

// Asegúrate de que el comando sea el adecuado para tu caso de uso
const soxCmd = 'sox input.wav output.wav noisered noise.prof 0.21 norm'

exec(soxCmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`)
    return
  }
  console.log(`stdout: ${stdout}`)
  console.error(`stderr: ${stderr}`)
})

const ffmpeg = require('fluent-ffmpeg')

function compressAudio (inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioBitrate(128)
      .output(outputPath)
      .on('end', () => resolve('Compression finished!'))
      .on('error', err => reject(err.message))
      .run()
  })
}

const startSeconds = 0
const segmentDuration = 30 // Duración de cada fragmento en segundos

function splitAudio (inputPath, outputPath, startSeconds, duration) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(startSeconds)
      .setDuration(duration)
      .output(outputPath)
      .on('end', () => resolve('Splitting finished!'))
      .on('error', err => reject(err.message))
      .run()
  })
}
// Llamar a la función en un bucle, incrementando startSeconds cada vez
