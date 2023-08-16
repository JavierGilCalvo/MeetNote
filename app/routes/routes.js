const express = require('express')
const router = express.Router()

// Importing controllers
// Importing controller
const meetingController = require('../controllers/meetingController')

const multer = require('multer')
const path = require('path')

// Multer to storage audio input
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /wav|mp3|m4a/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(null, false)
  }
})

const upload = multer({ storage })

// Unified Route
router.post('/process-meeting', upload.single('audio'), meetingController.processMeeting)

module.exports = router
