# Listentale

## PASOS:
1. Grabar meeting.
2. Llamada a whisper para generar transcripción a partir de la grabación.
3. Llamada a GPT para generar resumen, identificar pasos accionables, próximos pasos, clasificar temas tratados.
4. Publicación de tareas en Slack, Microsoft Tasks, otras integraciones.

### INTEGRACIONES:
- Slack.
- Google Meetings.
- Microsoft Teams.
- Zoom.
- Webex.
- Skype.

### ASPECTOS A TENER EN CUENTA:
- Autenticación.
- Grabación propia? Coger la grabación de la app?

### Módulos
- Módulo de autenticación:
    - SignUp.
    - LogIn.
    - Verificar.
- Módulo de transcripción:
    - Obtención de grabación.
    - Llamada a Whisper para transcribir.
    - Guardar salida en un txt, base de datos.
- Módulo de propuesta y resumen:
    - Obtención de la salida del módulo previo.
    - Llamada a GPT pidiendo: Resumen, clasificación de temas, próximos pasos, pasos accionables.
    - Guardar salida en un txt, base de datos, email, pdf.
    - Crear tareas en Teams, Slack...
- Módulo de integraciones:
    - Integración con Slack.
    - " con Google Meet.
    - " con Teams.
    - " con Zoom.