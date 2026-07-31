# 💌 Invitación de Boda — Web Romántica Botánica

Una invitación de boda web interactiva con estilo romántico botánico (verde salvia / terracota), sobre animado con sello de cera, y confirmación de asistencia integrada con Google Sheets.

---

## 📁 Estructura del Proyecto

```
invitacion-boda/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos (paleta salvia/terracota)
├── js/
│   ├── main.js             # Lógica de la interfaz
│   └── google-sheets.js    # Integración con Google Sheets
├── assets/
│   ├── images/             # Fotos de los novios
│   └── fonts/              # Fuentes personalizadas (opcional)
└── README.md               # Este archivo
```

---

## 🎨 Características

- **Sobre animado** con sello de cera terracota interactivo
- **Personalización por URL**: `?nombre=Juan+Pérez&pases=2`
- **Diseño responsive** para móvil y desktop
- **Paleta romántica botánica**: verde salvia, terracota, crema, dorado
- **Galería de fotos** con grid adaptable
- **Itinerario** con línea de tiempo visual
- **Formulario RSVP** con selector de cantidad y validación
- **Integración con Google Sheets** para recopilar confirmaciones
- **Animaciones suaves** al scroll y confetti al abrir
- **Fuentes elegantes**: Cormorant Garamond (títulos) + Montserrat (cuerpo)

---

## 🚀 Cómo usar en GitHub Pages

### 1. Sube los archivos a GitHub

1. Crea un nuevo repositorio en GitHub
2. Sube todos los archivos de esta carpeta
3. Ve a **Settings** > **Pages**
4. En "Source" selecciona **Deploy from a branch**
5. Selecciona la rama `main` y carpeta `/ (root)`
6. Guarda y espera unos minutos
7. Tu invitación estará en `https://TU-USUARIO.github.io/NOMBRE-REPO/`

### 2. Personaliza los placeholders

Abre `index.html` y reemplaza todos los textos entre corchetes:

| Placeholder | Descripción |
|-------------|-------------|
| `[Nombres de los Novios]` | Título de la página y footer |
| `[Nombre Novia]` / `[Nombre Novio]` | Nombres en el header |
| `[Nombre del Invitado]` | Nombre por defecto (se sobreescribe con URL) |
| `[X]` | Cantidad de pases por defecto |
| `[Sábado]` / `[15]` / `[Septiembre]` / `[2026]` | Fecha de la boda |
| `[Nombre del Lugar / Hacienda]` | Lugar del evento |
| `[Dirección completa del evento]` | Dirección |
| `[4:00 PM]` / `[6:00 PM]` | Horarios |
| `[Formal / Semi-formal / Casual elegante]` | Dress code |
| `[Nota adicional sobre vestimenta]` | Nota del dress code |
| `[Mensaje sobre regalos...]` | Texto de regalos |
| `[Nombre de la tienda]` / `[XXXXX]` | Mesa de regalos |
| `[fecha límite]` | Fecha límite para confirmar |
| `[HashtagDeLaBoda]` | Hashtag para redes sociales |

### 3. Agrega tus fotos

Reemplaza las imágenes en `assets/images/`:
- `novios-1.jpg` — Foto principal (grande)
- `novios-2.jpg` — Foto secundaria
- `novios-3.jpg` — Foto secundaria
- `novios-4.jpg` — Foto ancha

> **Tip**: Si no agregas fotos, se mostrarán imágenes de placeholder de Unsplash.

---

## 📧 Enviar invitaciones personalizadas

Puedes enviar un link diferente a cada invitado con sus datos:

```
https://TU-USUARIO.github.io/invitacion-boda/?nombre=María+García&pases=2
https://TU-USUARIO.github.io/invitacion-boda/?nombre=Carlos+López&pases=4
https://TU-USUARIO.github.io/invitacion-boda/?nombre=Familia+Pérez&pases=5
```

### Parámetros disponibles:

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `nombre` | Nombre del invitado | `nombre=Juan+Pérez` |
| `pases` | Cantidad de pases asignados | `pases=3` |

---

## 📊 Configurar Google Sheets

### Paso 1: Crear la hoja de cálculo

1. Ve a [Google Sheets](https://sheets.google.com) y crea una nueva hoja
2. En la primera fila, agrega estos encabezados:

```
A1: Fecha          B1: Nombre          C1: Asistencia
D1: Cantidad       E1: NombresAsistentes   F1: Alergias
G1: Mensaje
```

3. Copia el **ID de la hoja** de la URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz/edit
                              └─ ESTO ES EL ID ─┘
   ```

### Paso 2: Crear el Apps Script

1. Ve a [Google Apps Script](https://script.google.com)
2. Crea un **nuevo proyecto**
3. Borra el código por defecto y pega el código que está en `js/google-sheets.js` (sección `GOOGLE APPS SCRIPT`)
4. Reemplaza `[TU_SHEET_ID_AQUI]` con el ID de tu hoja
5. Guarda el proyecto (Ctrl+S)

### Paso 3: Desplegar (Deploy)

1. Haz clic en **Deploy** (Desplegar) > **New deployment**
2. En "Select type" elige **Web app**
3. Configura:
   - **Description**: `Invitación Boda RSVP`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Haz clic en **Deploy**
5. Autoriza los permisos (puede que Google muestre una advertencia de "app no verificada", haz clic en "Advanced" > "Go to...")
6. Copia la **URL de la web app**

### Paso 4: Conectar con la invitación

1. Abre `js/google-sheets.js`
2. Reemplaza:
   ```javascript
   const GOOGLE_SCRIPT_URL = '[PEGA_AQUI_TU_URL_DE_GOOGLE_APPS_SCRIPT]';
   ```
   con tu URL real.
3. Sube el archivo actualizado a GitHub
4. ¡Listo! Las confirmaciones llegarán directo a tu Google Sheet

---

## 🎨 Personalizar colores

Si quieres ajustar la paleta, edita las variables CSS en `css/style.css`:

```css
:root {
    --salvia: #9CAF88;        /* Verde principal */
    --terracota: #E2725B;     /* Acento cálido */
    --crema: #F5F0E8;         /* Fondo */
    --dorado: #D4A574;        /* Detalles dorados */
    --marron: #5C4033;        /* Texto principal */
}
```

---

## 📱 Compatibilidad

- ✅ Chrome / Edge / Safari / Firefox
- ✅ iOS Safari (iPhone/iPad)
- ✅ Android Chrome
- ✅ Responsive (320px - 4K)

---

## 💡 Tips adicionales

- **Música de fondo**: Puedes agregar una etiqueta `<audio>` en el HTML
- **Contador regresivo**: Descomenta la sección en `main.js`
- **Mapa de ubicación**: Agrega un iframe de Google Maps en la sección de lugar
- **Múltiples idiomas**: Duplica el HTML y ajusta el texto

---

## 📄 Licencia

Este proyecto es para uso personal en tu boda. ¡Disfrútalo! 💕

---

¿Preguntas o problemas? Revisa la consola del navegador (F12) para ver mensajes de ayuda.
