const fs = require('fs')

function removeFile (filePath) {
  fs.unlink(filePath, err => {
    if (err) console.error('Error while removing temporal file: ', err)
  })
}

module.exports = removeFile
