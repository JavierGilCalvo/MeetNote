const express = require('express')
const router = express.Router()

// Importing controllers
const transcriptController = require('../controllers/transcriptController')
const summaryController = require('../controllers/summaryController')

// Routes
router.post('/transcript', transcriptController.transcribeAudio)
router.post('/summary', summaryController.generateSummary)

module.exports = router
