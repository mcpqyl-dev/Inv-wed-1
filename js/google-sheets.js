/* ============================================
   INTEGRACIÓN CON GOOGLE SHEETS (Google Apps Script)

   INSTRUCCIONES DE CONFIGURACIÓN:

   1. Ve a https://script.google.com
   2. Crea un nuevo proyecto
   3. Pega el código de abajo (sección GOOGLE APPS SCRIPT)
   4. Guarda y haz "Deploy" > "New deployment" > tipo "Web app"
   5. Configura:
      - Execute as: Me
      - Who has access: Anyone
   6. Copia la URL de deployment
   7. Pégala en GOOGLE_SCRIPT_URL de abajo
   8. En tu Google Sheet, crea una hoja con estos encabezados:
      A: Fecha | B: Nombre | C: Asistencia | D: Cantidad | E: NombresAsistentes | F: Alergias | G: Mensaje

   ============================================ */

// ═══════════════════════════════════════════
// CONFIGURACIÓN
// ═══════════════════════════════════════════
const GOOGLE_SCRIPT_URL = '[PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT]';

// ═══════════════════════════════════════════
// ENVÍO DEL FORMULARIO
// ═══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('rsvp-form');
    const boton = document.getElementById('rsvp-boton');
    const exitoDiv = document.getElementById('rsvp-exito');
    const errorDiv = document.getElementById('rsvp-error');
    const errorMensaje = document.getElementById('error-mensaje');
    const exitoDetalles = document.getElementById('exito-detalles');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validación básica
        const nombre = document.getElementById('rsvp-nombre').value.trim();
        const asistencia = document.querySelector('input[name="asistencia"]:checked');

        if (!nombre) {
            mostrarError('Por favor ingresa tu nombre completo.');
            return;
        }

        if (!asistencia) {
            mostrarError('Por favor indica si asistirás o no.');
            return;
        }

        // Deshabilitar botón durante el envío
        boton.disabled = true;
        boton.querySelector('.boton-texto').textContent = 'Enviando...';

        // Recopilar datos
        const datos = {
            nombre: nombre,
            asistencia: asistencia.value,
            cantidad: document.getElementById('rsvp-cantidad').value,
            nombresAsistentes: document.getElementById('rsvp-nombres-asistentes').value.trim(),
            alergias: document.getElementById('rsvp-alergias').value.trim(),
            mensaje: document.getElementById('rsvp-mensaje').value.trim(),
            fechaEnvio: new Date().toLocaleString('es-ES')
        };

        try {
            // Si aún no has configurado la URL, simula el envío para pruebas
            if (GOOGLE_SCRIPT_URL.includes('PEGA_AQUI')) {
                console.log('📋 Datos a enviar (modo demo):', datos);
                await simularEnvio();
                mostrarExito(datos);
                return;
            }

            // Envío real a Google Sheets
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Necesario para Google Apps Script
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });

            // Como no-cors no devuelve respuesta legible, asumimos éxito
            mostrarExito(datos);

        } catch (error) {
            console.error('Error al enviar:', error);
            mostrarError('Hubo un problema de conexión. Por favor intenta de nuevo.');
        } finally {
            boton.disabled = false;
            boton.querySelector('.boton-texto').textContent = 'Enviar Confirmación';
        }
    });

    function mostrarExito(datos) {
        form.classList.add('hidden');
        exitoDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        let detalleTexto = `<strong>${datos.nombre}</strong><br>`;
        if (datos.asistencia === 'si') {
            detalleTexto += `✓ Asistirás con <strong>${datos.cantidad}</strong> persona(s)`;
        } else {
            detalleTexto += `No podrás asistir. ¡Gracias por avisarnos!`;
        }
        exitoDetalles.innerHTML = detalleTexto;

        // Scroll al mensaje
        exitoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function mostrarError(mensaje) {
        errorDiv.classList.remove('hidden');
        errorMensaje.textContent = mensaje;

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            errorDiv.classList.add('hidden');
        }, 5000);
    }

    function simularEnvio() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }
});

/* ============================================
   GOOGLE APPS SCRIPT (Pega esto en script.google.com)
   ============================================

function doPost(e) {
  // Configurar CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Si es preflight (OPTIONS)
  if (e.parameter && e.parameter.method === 'OPTIONS') {
    return ContentService.createTextOutput('')
      .setHeaders(headers);
  }

  try {
    // Parsear datos
    const datos = JSON.parse(e.postData.contents);

    // ID de tu Google Sheet (reemplaza con el tuyo)
    const SHEET_ID = '[TU_SHEET_ID_AQUI]';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Agregar fila
    sheet.appendRow([
      new Date(),                    // Fecha
      datos.nombre || '',            // Nombre
      datos.asistencia || '',        // Asistencia
      datos.cantidad || '',          // Cantidad
      datos.nombresAsistentes || '', // Nombres asistentes
      datos.alergias || '',          // Alergias
      datos.mensaje || ''            // Mensaje
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Datos guardados correctamente'
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'El servicio está funcionando correctamente'
  }))
  .setMimeType(ContentService.MimeType.JSON);
}

*/
