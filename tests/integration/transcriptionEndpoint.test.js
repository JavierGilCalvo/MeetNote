const request = require('supertest')
const app = require('../../app') // tu app Express

/* eslint-env jest */
test('POST /transcript', async () => {
  const response = await request(app)
    .post('/transcript')
    .attach('audio', 'ruta/a/tu/archivo/audio')

  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty('transcription')
})
