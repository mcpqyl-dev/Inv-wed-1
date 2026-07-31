/* ============================================
   INVITACIÓN DE BODA — Lógica Principal
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ═══════════════════════════════════════════
    // CONFIGURACIÓN: Personaliza estos valores
    // ═══════════════════════════════════════════
    const CONFIG = {
        // Datos del invitado (puedes pasarlos por URL: ?nombre=Juan&pases=2)
        nombreDefault: '[Nombre del Invitado]',
        pasesDefault: 2,
        maxPases: 10,

        // Si quieres que el formulario de cantidad se oculte cuando dice "No asistiré"
        ocultarCantidadSiNoAsiste: true
    };

    // ═══════════════════════════════════════════
    // OBTENER PARÁMETROS DE URL
    // ═══════════════════════════════════════════
    function getParametroURL(nombre) {
        const params = new URLSearchParams(window.location.search);
        return params.get(nombre);
    }

    // Aplicar datos del invitado desde URL o defaults
    const nombreInvitado = getParametroURL('nombre') || CONFIG.nombreDefault;
    const cantidadPases = parseInt(getParametroURL('pases')) || CONFIG.pasesDefault;

    document.getElementById('nombre-invitado').textContent = nombreInvitado;
    document.getElementById('cantidad-pases').textContent = cantidadPases;
    document.getElementById('max-pases').textContent = cantidadPases;

    // Pre-llenar el nombre en el formulario RSVP
    if (nombreInvitado !== CONFIG.nombreDefault) {
        document.getElementById('rsvp-nombre').value = nombreInvitado;
    }

    // Limitar cantidad máxima en el selector
    document.getElementById('rsvp-cantidad').setAttribute('max', cantidadPases);

    // ═══════════════════════════════════════════
    // APERTURA DEL SOBRE
    // ═══════════════════════════════════════════
    const sobre = document.getElementById('sobre');
    const selloCera = document.getElementById('sello-cera');
    const sobreSection = document.getElementById('sobre-section');
    const invitacionSection = document.getElementById('invitacion-section');
    let sobreAbierto = false;

    function abrirSobre() {
        if (sobreAbierto) return;
        sobreAbierto = true;

        // Animar apertura
        sobre.classList.add('abierto');

        // Sonido sutil (opcional - descomenta si tienes un archivo de sonido)
        // const audio = new Audio('assets/sounds/abrir-sobre.mp3');
        // audio.play().catch(() => {});

        // Esperar a que termine la animación del sobre
        setTimeout(() => {
            // Ocultar sección del sobre suavemente
            sobreSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            sobreSection.style.opacity = '0';
            sobreSection.style.transform = 'scale(0.9)';

            setTimeout(() => {
                sobreSection.classList.add('hidden');

                // Mostrar invitación
                invitacionSection.classList.remove('hidden');
                invitacionSection.style.opacity = '0';
                invitacionSection.style.transform = 'translateY(20px)';

                // Forzar reflow
                void invitacionSection.offsetWidth;

                invitacionSection.style.transition = 'opacity 1s ease, transform 1s ease';
                invitacionSection.style.opacity = '1';
                invitacionSection.style.transform = 'translateY(0)';

                // Scroll suave al inicio
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Lanzar confetti
                lanzarConfetti();

            }, 600);
        }, 1800);
    }

    selloCera.addEventListener('click', abrirSobre);
    sobre.addEventListener('click', abrirSobre);

    // ═══════════════════════════════════════════
    // CONFETTI
    // ═══════════════════════════════════════════
    function lanzarConfetti() {
        const container = document.getElementById('confetti-container');
        const colores = ['#9CAF88', '#E2725B', '#D4A574', '#F5F0E8', '#B8C9A6', '#E8947A'];

        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colores[Math.floor(Math.random() * colores.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.width = (4 + Math.random() * 8) + 'px';
            confetti.style.height = (4 + Math.random() * 8) + 'px';
            container.appendChild(confetti);

            // Limpiar después de la animación
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    // ═══════════════════════════════════════════
    // SELECTOR DE CANTIDAD (+ / -)
    // ═══════════════════════════════════════════
    const btnMenos = document.getElementById('btn-menos');
    const btnMas = document.getElementById('btn-mas');
    const inputCantidad = document.getElementById('rsvp-cantidad');

    btnMenos.addEventListener('click', () => {
        let val = parseInt(inputCantidad.value) || 1;
        if (val > 1) {
            inputCantidad.value = val - 1;
        }
    });

    btnMas.addEventListener('click', () => {
        let val = parseInt(inputCantidad.value) || 1;
        const max = parseInt(inputCantidad.getAttribute('max')) || CONFIG.maxPases;
        if (val < max) {
            inputCantidad.value = val + 1;
        }
    });

    // ═══════════════════════════════════════════
    // MOSTRAR/OCULTAR CAMPOS SEGÚN ASISTENCIA
    // ═══════════════════════════════════════════
    const radiosAsistencia = document.querySelectorAll('input[name="asistencia"]');
    const grupoCantidad = document.getElementById('grupo-cantidad');
    const grupoNombres = document.getElementById('grupo-nombres');

    radiosAsistencia.forEach(radio => {
        radio.addEventListener('change', function() {
            if (CONFIG.ocultarCantidadSiNoAsiste) {
                if (this.value === 'no') {
                    grupoCantidad.style.display = 'none';
                    grupoNombres.style.display = 'none';
                } else {
                    grupoCantidad.style.display = 'flex';
                    grupoNombres.style.display = 'flex';
                }
            }
        });
    });

    // ═══════════════════════════════════════════
    // ANIMACIONES AL SCROLL (reveal)
    // ═══════════════════════════════════════════
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar a secciones
    document.querySelectorAll('.seccion-fecha, .seccion-fotos, .seccion-itinerario, .seccion-dresscode, .seccion-regalos, .seccion-rsvp').forEach(seccion => {
        seccion.style.opacity = '0';
        seccion.style.transform = 'translateY(30px)';
        seccion.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        revealObserver.observe(seccion);
    });

    // ═══════════════════════════════════════════
    // CONTADOR REGRESIVO (opcional)
    // ═══════════════════════════════════════════
    // Descomenta y configura la fecha de tu boda
    /*
    const fechaBoda = new Date('2026-09-15T16:00:00').getTime();

    function actualizarContador() {
        const ahora = new Date().getTime();
        const distancia = fechaBoda - ahora;

        if (distancia > 0) {
            const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));

            // Actualiza elementos con clase .contador-dias, .contador-horas, etc.
        }
    }

    setInterval(actualizarContador, 60000);
    actualizarContador();
    */

    // ═══════════════════════════════════════════
    // EFECTO PARALLAX SUAVE EN HEADER
    // ═══════════════════════════════════════════
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const header = document.querySelector('.invitacion-header');
                if (header && scrollY < 500) {
                    header.style.backgroundPositionY = (scrollY * 0.3) + 'px';
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    console.log('✨ Invitación de boda cargada correctamente');
    console.log('💡 Tip: Puedes personalizar la invitación con URL params:');
    console.log('   ?nombre=Juan+Pérez&pases=2');
});
