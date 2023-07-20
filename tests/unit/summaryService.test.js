const generateSummary = require('../../app/services/summaryService.js')

/* eslint-env jest */
describe('SummaryService', () => {
  it('should return a summary for a given text', async () => {
    const text = 'Esta es una transcripción larga que necesita ser resumida.'
    const summary = await generateSummary(text)

    expect(summary).toBeDefined()
    expect(summary.length).toBeLessThan(text.length)
  })

  it('should return an empty string for an empty input', async () => {
    const summary = await generateSummary('')

    expect(summary).toEqual('')
  })

  it('should handle null input', async () => {
    const summary = await generateSummary(null)

    expect(summary).toEqual('')
  })

  it('should handle undefined input', async () => {
    const summary = await generateSummary(undefined)

    expect(summary).toEqual('')
  })

  it('should handle text with special characters', async () => {
    const text = 'Texto con caractéres especiales: á, é, í, ó, ú, ü, ñ, ¿, ¡, *, &, #, etc.'
    const summary = await generateSummary(text)

    expect(summary).toBeDefined()
  })

  it('should return a summary shorter than a maximum length, if specified', async () => {
    const maxLength = 50
    const text = 'Este es un texto muy largo que debe ser resumido a menos de 50 caracteres.'
    const summary = await generateSummary(text, maxLength)

    expect(summary.length).toBeLessThan(maxLength)
  })
})
