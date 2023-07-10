require('dotenv').config()

// Importar las integraciones con las diferentes plataformas
const teamsIntegration = require('./integrations/teams')
const slackIntegration = require('./integrations/slack')
const googleMeetIntegration = require('./integrations/googleMeet')

// Determinar qué plataforma se está utilizando
const platform = detectPlatform()

// Iniciar la integración con la plataforma
if (platform === 'teams') {
  teamsIntegration.start()
} else if (platform === 'slack') {
  slackIntegration.start()
} else if (platform === 'googleMeet') {
  googleMeetIntegration.start()
} else {
  console.error(`Unsupported platform: ${platform}`)
}

// Esta función es un ejemplo y su implementación real dependerá de cómo planeas diferenciar entre las plataformas
function detectPlatform () {
  // En este ejemplo, supondremos que tenemos una variable de entorno que indica la plataforma que se está utilizando.
  const platform = process.env.PLATFORM

  // Aquí se pueden agregar verificaciones adicionales, como comprobar si la variable de entorno es válida, si se tienen los permisos necesarios para interactuar con la plataforma, etc.

  return platform
}
