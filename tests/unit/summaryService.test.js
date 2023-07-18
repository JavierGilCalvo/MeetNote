const summaryService = require('../../app/services/summaryService.js')

describe('SummaryService', () => {
  it('should return a summary for a given transcription', async () => {
    const text = 'Esta es una transcripción larga que necesita ser resumida.'
    const summary = await summaryService.summarize(text)

    expect(summary).toBeDefined()
    expect(summary.length).toBeLessThan(text.length)
  })

  it('should return an empty string for an empty input', async () => {
    const summary = await summaryService.summarize('')

    expect(summary).toEqual('')
  })
})
