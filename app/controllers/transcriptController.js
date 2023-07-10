const fs = require('fs')
const path = require('path')

// Services
const transcriptService = require('../services/transcription/transcription')

exports.getTranscript = async (req, res) => {
  try {
    // Aquí tenemos que coger el audio
    fs.createReadStream(path.resolve(__dirname, 'mocks/ejemplo_corto.m4a'))
    const transcript = await transcriptService.getTranscript(req.body.audio, req.body.explanation)
    res.json({ transcript })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

/*
const fs = require('fs')
EN CASO DE QUE SE DECIDA QUE LOS USUARIOS PUEDEN GUARDAR LA TRANSCRIPCIÓN, DE MOMENTO, NO
function saveStaticDataToFile (path, textToSave) {
  try {
    fs.writeFileSync(path, textToSave)
  } catch (error) {
    console.error(error)
  }
}
PARA LLAMARLO:
await saveStaticDataToFile(path.resolve(__dirname, './mocks/results/resultado.txt'), resp.data.text)
*/
