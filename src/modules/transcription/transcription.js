const Replicate = require("replicate")
require('dotenv').config()

const useReplicate = async () => {
    const replicate = new Replicate({
        auth: process.env.API_WHISPER,
      })
      
      const output = await replicate.run(
        "openai/whisper:91ee9c0c3df30478510ff8c8a3a545add1ad0259ad3a9f78fba57fbc05ee64f7",
        {
          input: {
            audio: "./ejemplo_corto.m4a",
            language: "Spanish",
            transcription: "plain text",
      
          }
        }
      )

      await saveStaticDataToFile(output)
}

function saveStaticDataToFile(textToSave) {
    var blob = new Blob([textToSave],
        { type: "text/plain;charset=utf-8" });
    saveAs(blob, "static.txt");
}

module.exports = useReplicate