// app/controllers/summaryController.js

const summaryService = require('../services/summary')

exports.generateSummary = async (req, res) => {
  const { transcription, description } = req.body

  try {
    const summary = await summaryService.getSummary(transcription, description)
    res.json({ summary })
  } catch (err) {
    res.status(500).json({ error: 'An error occurred while generating the summary.' })
  }
}
