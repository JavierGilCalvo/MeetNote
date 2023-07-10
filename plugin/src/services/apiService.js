fetch('https://your-api-url/transcript', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ audio })
})
  .then(response => response.json())
  .then(data => {
    const transcript = data.transcript
    // Haz algo con la transcripción aquí...
  })
  .catch(err => {
    console.error('Error:', err)
  })

fetch('https://your-api-url/summary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ transcript })
})
  .then(response => response.json())
  .then(data => {
    const summary = data.summary
    // Haz algo con el resumen aquí...
  })
  .catch(err => {
    console.error('Error:', err)
  })
