// app/controllers/summaryController.js

const summaryService = require('../services/summary')

exports.getSummary = async (req, res) => {
  try {
    const summary = await summaryService.getSummary(req.body.transcript, req.body.explanation)
    res.json({ summary })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
