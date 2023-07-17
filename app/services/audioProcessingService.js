const path = require('path')
const ffmpeg = require('fluent-ffmpeg')

function compressAudioTest () {
  console.log('1. Comprimir mucho, perdiendo algo de calidad')
  // 1. Comprimir mucho, perdiendo algo de calidad
  ffmpeg(path.resolve(__dirname, '../mocks/ejemplo_largo.mp3'))
    .audioCodec('libmp3lame')
    .audioQuality(10)
    .save(path.resolve(__dirname, '../mocks/output1.mp3'))
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message)
    })
    .on('end', function () {
      console.log('1. Processing finished !')
      splitAudio()
    })

  console.log('2. Perder poco, maximizando la calidad')
  // 2. Perder poco, maximizando la calidad
  ffmpeg(path.resolve(__dirname, '../mocks/ejemplo_largo.mp3'))
    .audioCodec('flac')
    .save('output2.flac')
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message)
    })
    .on('end', function () {
      console.log('2. Processing finished !')
    })

  console.log('3. Maximizar la relación calidad-compresión')
  // 3. Maximizar la relación calidad-compresión
  ffmpeg(path.resolve(__dirname, '../mocks/ejemplo_largo.mp3'))
    .audioCodec('libmp3lame')
    .audioQuality(5)
    .save(path.resolve(__dirname, '../mocks/output3.mp3'))
    .on('error', function (err) {
      console.log('An error occurred: ' + err.stack)
    })
    .on('end', function () {
      console.log('3. Processing finished !')
    })
}

function splitAudio () {
  // HAY QUE EJECUTAR LOS COMANDOS DE MIERDA USANDO LA LÍNEA DE COMANDOS EN VEZ DE FLUENT_FFMPEG
  const audioFilePath = path.resolve(__dirname, '../mocks/output3.mp3')
  const outputDirectory = path.resolve(__dirname, '../mocks/')
  const maxFileSizeInMB = 10
  const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024

  ffmpeg.ffprobe(audioFilePath, (err, metadata) => {
    if (err) {
      console.error(err)
      return
    }

    const duration = metadata.format.duration
    const numSegments = Math.ceil(duration / (maxFileSizeInBytes / metadata.format.bit_rate))
    const segmentDuration = Math.floor(duration / numSegments)

    for (let i = 0; i < numSegments; i++) {
      const outputFileName = `segment_${i}.wav`
      const outputPath = path.join(outputDirectory, outputFileName)

      ffmpeg(audioFilePath)
        .setStartTime(i * segmentDuration)
        .setDuration(segmentDuration)
        .output(outputPath)
        .on('start', () => console.log(`Started creating ${outputFileName}`))
        .on('error', (err) =>
          console.error(`Error creating ${outputFileName}: ${err}`)
        )
        .on('end', () => console.log(`Finished creating ${outputFileName}`))
        .run()
    }
  })
}

const exec = require('child_process').exec
function compressAudioTestCommand () {
  const inputPath = path.resolve(__dirname, '../mocks/ejemplo_largo.mp3')

  // 1. Comprimir mucho, perdiendo algo de calidad
  console.log('1. Comprimir mucho, perdiendo algo de calidad')
  const outputPathPrimero = path.resolve(__dirname, '../mocks/output1.mp3')
  const comandoPrimero = `ffmpeg -i ${inputPath} -codec:a libmp3lame -q:a 10 ${outputPathPrimero}`
  exec(comandoPrimero, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })

  // 2. Perder poco, maximizando la calidad
  /* console.log('2. Perder poco, maximizando la calidad')
  const outputPathSegundo = path.resolve(__dirname, '../mocks/output2.flac')
  const comandoSegundo = `ffmpeg -i ${inputPath} -codec:a flac ${outputPathSegundo}`
  exec(comandoSegundo, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  }) */

  // 3. Maximizar la relación calidad-compresión
  console.log('3. Maximizar la relación calidad-compresión')
  const outputPathTercero = path.resolve(__dirname, '../mocks/output3.mp3')
  const comandoTercero = `ffmpeg -i ${inputPath} -codec:a libmp3lame -q:a 5 ${outputPathTercero}`
  exec(comandoTercero, (error, stdout, stderr) => {
    if (error) {
      console.log(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    console.log(`stdout: ${stdout}`)
  })
}

const util = require('util')
const execPromise = util.promisify(exec)

async function splitAudioExec () {
  const audioFilePath = path.resolve(__dirname, '../mocks/output3.mp3')
  const outputDirectory = path.resolve(__dirname, '../mocks/')
  const maxFileSizeInMB = 10

  try {
    // Getting the audio metadata
    const { stdout: metadataJSON } = await execPromise(`ffprobe -v quiet -print_format json -show_format "${audioFilePath}"`)
    const metadata = JSON.parse(metadataJSON)
    const duration = parseFloat(metadata.format.duration)
    const bitRate = parseFloat(metadata.format.bit_rate) / 1000
    const segmentDurationInSeconds = Math.floor((maxFileSizeInMB * 1024 * 8) / bitRate)
    const numSegments = Math.ceil(duration / segmentDurationInSeconds)

    for (let i = 0; i < numSegments; i++) {
      const outputFileName = `segment_${i}.mp3`
      const outputPath = `${outputDirectory}/${outputFileName}`

      const command = `ffmpeg -i "${audioFilePath}" -ss ${i * segmentDurationInSeconds} -t ${segmentDurationInSeconds} -b:a 128k "${outputPath}"`

      console.log(`Started creating ${outputFileName}`)
      await execPromise(command)
      console.log(`Finished creating ${outputFileName}`)
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`)
  }
}

module.exports = { compressAudioTestCommand, splitAudioExec }

/*
// const { exec } = require('child_process')

// Asegúrate de que el comando sea el adecuado para tu caso de uso
function soxPrueba () {
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
}

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
} */
// Llamar a la función en un bucle, incrementando startSeconds cada vez

/*
function fragmentAudio () {
  const audioFilePath = path.resolve(__dirname, '../mocks/output3.mp3')
  const outputDirectory = path.resolve(__dirname, '../mocks/')
  const maxFileSizeInMB = 10
  const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024

  ffmpeg.ffprobe(audioFilePath, function (err, metadata) {
    if (err) {
      console.error('Error reading audio file metadata:', err)
      return
    }

    if (!metadata || !metadata.format) {
      console.error('Invalid metadata:', metadata)
      return
    }

    const audioDurationInSeconds = metadata.format.duration
    const numberOfSegments = Math.ceil(audioDurationInSeconds / (maxFileSizeInBytes / metadata.format.bit_rate))

    ffmpeg(audioFilePath)
      .outputOptions([
        '-f segment',
            `-segment_time ${Math.floor(audioDurationInSeconds / numberOfSegments)}`,
            '-c copy'
      ])
      .save(`${outputDirectory}/output%03d.mp3`)
      .on('end', () => console.log('Splitting is complete.'))
      .on('error', (err) => console.log(err))
  })
} */
