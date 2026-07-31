/* ============================================
   INVITACION DE BODA - LOGICA UI Y ANIMACIONES
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
    const CONFIG = window.APP_CONFIG || {};
    const uiConfig = CONFIG.ui || {};
    const safeDefaultName = uiConfig.nombreDefault || '[Nombre del Invitado]';
    const safeDefaultPasses = Number.isInteger(uiConfig.pasesDefault) ? uiConfig.pasesDefault : 1;
    const safeAbsoluteMax = Number.isInteger(uiConfig.maxPasesAbsoluto) ? uiConfig.maxPasesAbsoluto : 10;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const sobre = document.getElementById('sobre');
    const selloCera = document.getElementById('sello-cera');
    const sobreHint = document.querySelector('.sobre-hint');
    const sobreSection = document.getElementById('sobre-section');
    const invitacionSection = document.getElementById('invitacion-section');
    const guestStatus = document.getElementById('guest-status');
    const guestStatusText = document.getElementById('guest-status-text');

    const nombreCarta = document.getElementById('nombre-invitado');
    const pasesCarta = document.getElementById('cantidad-pases');
    const maxPasesLabel = document.getElementById('max-pases');
    const codigoInput = document.getElementById('rsvp-codigo');
    const nombreInput = document.getElementById('rsvp-nombre');
    const cantidadInput = document.getElementById('rsvp-cantidad');

    const radiosAsistencia = document.querySelectorAll('input[name="asistencia"]');
    const grupoCantidad = document.getElementById('grupo-cantidad');
    const grupoNombres = document.getElementById('grupo-nombres');
    const grupoAlergias = document.getElementById('grupo-alergias');
    const btnMenos = document.getElementById('btn-menos');
    const btnMas = document.getElementById('btn-mas');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpBoton = document.getElementById('rsvp-boton');

    let sobreAbierto = false;
    let envelopeReady = false;
    let envelopeCanOpen = false;
    let currentGuest = {
        codigo: '',
        nombre: safeDefaultName,
        pasesAutorizados: safeDefaultPasses,
        valido: false
    };

    function clampPasses(value) {
        const parsed = parseInt(String(value), 10);
        if (!Number.isFinite(parsed) || parsed < 1) return 1;
        return Math.min(parsed, safeAbsoluteMax);
    }

    function setGuestStatus(message, variant) {
        if (!guestStatus || !guestStatusText) return;
        guestStatus.classList.remove('status-loading', 'status-ok', 'status-error');
        if (variant) {
            guestStatus.classList.add('status-' + variant);
        }
        guestStatusText.textContent = message;
    }

    function setEnvelopeState(ready, canOpen, message) {
        envelopeReady = Boolean(ready);
        envelopeCanOpen = Boolean(canOpen);

        if (!sobre) return;

        sobre.classList.toggle('sobre-bloqueado', !envelopeCanOpen);
        if (sobreHint && message) {
            sobreHint.textContent = message;
        }
    }

    function setRsvpEnabled(enabled) {
        if (!rsvpForm) return;
        const controls = rsvpForm.querySelectorAll('input, textarea, button');
        controls.forEach((control) => {
            if (control.id === 'rsvp-nombre' || control.id === 'rsvp-codigo') return;
            control.disabled = !enabled;
        });
        if (rsvpBoton) {
            rsvpBoton.disabled = !enabled;
        }
    }

    function updatePassesUI(maxPasses) {
        const limited = clampPasses(maxPasses);
        pasesCarta.textContent = String(limited);
        maxPasesLabel.textContent = String(limited);
        cantidadInput.max = String(limited);
        if (parseInt(cantidadInput.value, 10) > limited) {
            cantidadInput.value = String(limited);
        }
    }

    function toggleAttendanceFields(asistencia) {
        const hideExtraFields = (uiConfig.ocultarCamposSiNoAsiste !== false) && asistencia === 'no';
        const hiddenClass = 'hidden';

        [grupoCantidad, grupoNombres, grupoAlergias].forEach((group) => {
            if (!group) return;
            group.classList.toggle(hiddenClass, hideExtraFields);
        });

        if (hideExtraFields) {
            cantidadInput.value = '1';
        }
    }

    function applyGuestContext(data) {
        const guestName = data && data.nombre ? data.nombre : safeDefaultName;
        const guestCode = data && data.codigo ? String(data.codigo) : '';
        const passes = data && data.pasesAutorizados ? data.pasesAutorizados : safeDefaultPasses;
        const isValid = Boolean(data && data.valido);

        currentGuest = {
            codigo: guestCode,
            nombre: guestName,
            pasesAutorizados: clampPasses(passes),
            valido: isValid
        };

        nombreCarta.textContent = currentGuest.nombre;
        nombreInput.value = currentGuest.nombre;
        codigoInput.value = currentGuest.codigo;

        if (isValid) {
            nombreInput.readOnly = true;
            nombreInput.setAttribute('aria-readonly', 'true');
            updatePassesUI(currentGuest.pasesAutorizados);
            setGuestStatus('Invitacion validada para ' + currentGuest.nombre + '.', 'ok');
            setRsvpEnabled(true);
        } else {
            nombreInput.readOnly = false;
            nombreInput.removeAttribute('aria-readonly');
            updatePassesUI(safeDefaultPasses);
            setGuestStatus('Codigo invalido o inactivo. No es posible confirmar asistencia.', 'error');
            setRsvpEnabled(false);
        }
    }

    function openInvitation() {
        if (!envelopeReady) {
            if (sobreHint) {
                sobreHint.textContent = 'Validando invitacion, espera un momento...';
            }
            return;
        }

        if (!envelopeCanOpen) {
            if (sobreHint) {
                sobreHint.textContent = 'No se pudo validar tu codigo. Revisa el enlace.';
            }
            return;
        }

        if (sobreAbierto) return;
        sobreAbierto = true;
        sobre.classList.add('abierto');

        const revealContent = function () {
            sobreSection.classList.add('hidden');
            invitacionSection.classList.remove('hidden');
            invitacionSection.style.opacity = '1';
            invitacionSection.style.transform = 'translateY(0)';
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            if (!reduceMotion) {
                launchConfetti();
            }
        };

        if (reduceMotion) {
            revealContent();
            return;
        }

        setTimeout(function () {
            sobreSection.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            sobreSection.style.opacity = '0';
            sobreSection.style.transform = 'scale(0.9)';
            setTimeout(revealContent, 600);
        }, 1800);
    }

    function launchConfetti() {
        const container = document.getElementById('confetti-container');
        const colors = ['#9CAF88', '#E2725B', '#D4A574', '#F5F0E8', '#B8C9A6', '#E8947A'];
        if (!container) return;

        for (let i = 0; i < 60; i += 1) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.width = 4 + Math.random() * 8 + 'px';
            confetti.style.height = 4 + Math.random() * 8 + 'px';
            container.appendChild(confetti);
            setTimeout(function () {
                confetti.remove();
            }, 5000);
        }
    }

    function setupQuantitySelector() {
        if (!btnMenos || !btnMas || !cantidadInput) return;

        btnMenos.addEventListener('click', function () {
            const current = parseInt(cantidadInput.value, 10) || 1;
            if (current > 1) {
                cantidadInput.value = String(current - 1);
            }
        });

        btnMas.addEventListener('click', function () {
            const current = parseInt(cantidadInput.value, 10) || 1;
            const max = parseInt(cantidadInput.max, 10) || safeAbsoluteMax;
            if (current < max) {
                cantidadInput.value = String(current + 1);
            }
        });
    }

    function setupAttendanceToggle() {
        radiosAsistencia.forEach(function (radio) {
            radio.addEventListener('change', function () {
                toggleAttendanceFields(this.value);
            });
        });
    }

    function setupRevealAnimation() {
        if (reduceMotion || !('IntersectionObserver' in window)) return;
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.seccion-fecha, .seccion-fotos, .seccion-itinerario, .seccion-dresscode, .seccion-regalos, .seccion-rsvp').forEach(function (section) {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            revealObserver.observe(section);
        });
    }

    function setupParallax() {
        if (reduceMotion) return;
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (ticking) return;
            window.requestAnimationFrame(function () {
                const scrollY = window.scrollY;
                const header = document.querySelector('.invitacion-header');
                if (header && scrollY < 500) {
                    header.style.backgroundPositionY = scrollY * 0.3 + 'px';
                }
                ticking = false;
            });
            ticking = true;
        });
    }

    window.InvitationUI = {
        applyGuestContext: applyGuestContext,
        setGuestStatus: setGuestStatus,
        setRsvpEnabled: setRsvpEnabled,
        toggleAttendanceFields: toggleAttendanceFields,
        setEnvelopeState: setEnvelopeState,
        getCurrentGuest: function () {
            return { ...currentGuest };
        }
    };

    nombreCarta.textContent = 'Validando invitado...';
    pasesCarta.textContent = '...';
    maxPasesLabel.textContent = '...';

    updatePassesUI(safeDefaultPasses);
    setGuestStatus('Validando invitacion...', 'loading');
    setRsvpEnabled(false);
    setEnvelopeState(false, false, 'Validando invitacion...');

    setupQuantitySelector();
    setupAttendanceToggle();
    setupRevealAnimation();
    setupParallax();

    if (selloCera) selloCera.addEventListener('click', openInvitation);
    if (sobre) sobre.addEventListener('click', openInvitation);

    console.log('Invitacion cargada. Esperando validacion por codigo unico.');
});
