const { exec } = require('child_process')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')
const util = require('util')
const execPromisified = util.promisify(exec)
const uuid = require('uuid')
const { TEMP_AUDIO_DIR_NAME, AUDIO_FRAGMENT_DURATION } = require('../constants')

const OUTPUT_TEMP_PATH = path.resolve(__dirname, TEMP_AUDIO_DIR_NAME)

async function splitAudio (audioFilePath, outputDirectory = OUTPUT_TEMP_PATH) {
  if (!fs.existsSync(OUTPUT_TEMP_PATH)) {
    fs.mkdirSync(OUTPUT_TEMP_PATH, { recursive: true })
  }

  // Generate a unique ID for this transcription
  const id = uuid.v4()
  const outputFilePrefix = `output_${id}_`

  const command = `ffmpeg -i ${audioFilePath} -f segment -segment_time ${AUDIO_FRAGMENT_DURATION} -c copy ${path.join(outputDirectory, outputFilePrefix + '%03d.mp3')}`

  try {
    await execPromisified(command)

    // Read the output directory and filter out the segments
    const files = await fsPromises.readdir(outputDirectory)

    // Filter only the segments and return them
    const segments = files.filter(file => file.startsWith(outputFilePrefix) && file.endsWith('.mp3'))
    return segments
  } catch (error) {
    console.log(`Error while spliting the audio: ${error.message}`)
  }
}

module.exports = splitAudio
