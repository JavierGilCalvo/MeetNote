const { exec } = require('child_process')
const fs = require('fs').promises
const path = require('path')
const util = require('util')
const execPromisified = util.promisify(exec)
const uuid = require('uuid')

async function splitAudio (audioFilePath, outputDirectory, segmentDuration) {
// Generate a unique ID for this transcription
  const id = uuid.v4()
  const outputFilePrefix = `output_${id}_`

  const command = `ffmpeg -i ${audioFilePath} -f segment -segment_time ${segmentDuration} -c copy ${path.join(outputDirectory, outputFilePrefix + '%03d.mp3')}`

  try {
    await execPromisified(command)

    // Read the output directory and filter out the segments
    const files = await fs.readdir(outputDirectory)

    // Filter only the segments and return them
    const segments = files.filter(file => file.startsWith(outputFilePrefix) && file.endsWith('.mp3'))
    return segments
  } catch (error) {
    console.log(`error: ${error.message}`)
  }
}

module.exports = splitAudio
