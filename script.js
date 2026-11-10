/**
 * ============================================================================
 * SCRIPT DE INICIO DE SESIÓN - VALIDACIÓN EN EL CLIENTE
 * ============================================================================
 * 
 * AVISO ACADÉMICO / DIDÁCTICO:
 * La comprobación de credenciales hardcodeadas en JavaScript realizada en este
 * script tiene fines EXCLUSIVAMENTE DIDÁCTICOS. 
 * En entornos de producción reales, NUNCA se deben almacenar ni validar
 * contraseñas en el frontend, ya que cualquier usuario puede inspeccionar el
 * código fuente. La autenticación real debe procesarse siempre en el backend
 * de manera segura con protocolos como HTTPS, hashing (bcrypt/Argon2) y tokens.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. CREDENCIALES DE DEMOSTRACIÓN (SIMULACIÓN)
  // --------------------------------------------------------------------------
  const MOCK_CREDENTIALS = {
    email: 'demo@ejemplo.com',
    password: 'Demo1234!'
  };

  // --------------------------------------------------------------------------
  // 2. REFERENCIAS A ELEMENTOS DEL DOM
  // --------------------------------------------------------------------------
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberMeCheckbox = document.getElementById('remember-me');
  const togglePasswordBtn = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  
  const emailError = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const globalAlert = document.getElementById('global-alert');
  const forgotPasswordLink = document.getElementById('forgot-password');

  // --------------------------------------------------------------------------
  // 3. PERSISTENCIA: RECORDAR CORREO (localStorage)
  // --------------------------------------------------------------------------
  // Se verifica si existe un correo guardado previamente en el navegador.
  // Cumpliendo los requerimientos técnicos: NUNCA guardamos contraseñas.
  const savedEmail = localStorage.getItem('remembered_email');
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberMeCheckbox.checked = true;
  }

  // --------------------------------------------------------------------------
  // 4. MOSTRAR / OCULTAR CONTRASEÑA
  // --------------------------------------------------------------------------
  togglePasswordBtn.addEventListener('click', () => {
    const isPasswordType = passwordInput.getAttribute('type') === 'password';
    const newType = isPasswordType ? 'text' : 'password';
    
    passwordInput.setAttribute('type', newType);
    
    // Actualización del atributo ARIA para accesibilidad
    togglePasswordBtn.setAttribute(
      'aria-label', 
      isPasswordType ? 'Ocultar contraseña' : 'Mostrar contraseña'
    );

    // Cambio del icono visual (SVG)
    if (isPasswordType) {
      // Icono de ojo tachado (ocultar)
      eyeIcon.innerHTML = `
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      `;
    } else {
      // Icono de ojo estándar (mostrar)
      eyeIcon.innerHTML = `
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      `;
    }
  });

  // --------------------------------------------------------------------------
  // 5. FUNCIONES AUXILIARES DE VALIDACIÓN Y UI
  // --------------------------------------------------------------------------
  
  /**
   * Muestra un error específico en un campo de entrada.
   */
  function showError(inputElement, errorElement, message) {
    errorElement.textContent = message;
    inputElement.closest('.form-group').classList.add('input-group-error');
  }

  /**
   * Limpia los errores de un campo de entrada.
   */
  function clearError(inputElement, errorElement) {
    errorElement.textContent = '';
    inputElement.closest('.form-group').classList.remove('input-group-error');
  }

  /**
   * Muestra una alerta de nivel global (éxito o error de credenciales).
   */
  function showGlobalAlert(message, type) {
    globalAlert.textContent = message;
    globalAlert.className = `alert alert-${type}`;
  }

  /**
   * Limpia la alerta global.
   */
  function clearGlobalAlert() {
    globalAlert.textContent = '';
    globalAlert.className = 'alert hidden';
  }

  /**
   * Valida la estructura mediante Expresión Regular para emails estándar.
   */
  function isValidEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // --------------------------------------------------------------------------
  // 6. VALIDACIÓN EN TIEMPO REAL (INPUT EVENTS)
  // --------------------------------------------------------------------------
  emailInput.addEventListener('input', () => {
    clearError(emailInput, emailError);
    clearGlobalAlert();
  });

  passwordInput.addEventListener('input', () => {
    clearError(passwordInput, passwordError);
    clearGlobalAlert();
  });

  // --------------------------------------------------------------------------
  // 7. MANEJO Y ENVÍO DEL FORMULARIO
  // --------------------------------------------------------------------------
  form.addEventListener('submit', (e) => {
    // Evitar la recarga de página predeterminada por el navegador
    e.preventDefault();
    clearGlobalAlert();

    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value;
    let isValid = true;

    // --- Validación 1: Correo electrónico ---
    if (emailValue === '') {
      showError(emailInput, emailError, 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!isValidEmailFormat(emailValue)) {
      showError(emailInput, emailError, 'Por favor, ingresa un correo electrónico válido.');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // --- Validación 2: Contraseña ---
    if (passwordValue === '') {
      showError(passwordInput, passwordError, 'La contraseña es obligatoria.');
      isValid = false;
    } else if (passwordValue.length < 8) {
      showError(passwordInput, passwordError, 'La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else {
      clearError(passwordInput, passwordError);
    }

    // Si existen errores de validación local, detenemos la ejecución
    if (!isValid) return;

    // --- Lógica de la Opción "Recordar mi correo" ---
    if (rememberMeCheckbox.checked) {
      localStorage.setItem('remembered_email', emailValue);
    } else {
      localStorage.removeItem('remembered_email');
    }

    // --- Simulación de Autenticación con Credenciales Didácticas ---
    if (emailValue === MOCK_CREDENTIALS.email && passwordValue === MOCK_CREDENTIALS.password) {
      showGlobalAlert(`¡Bienvenido de nuevo, ${emailValue}! Accediendo al sistema...`, 'success');
      // En una aplicación real, aquí redirigiríamos al dashboard:
      // window.location.href = '/dashboard.html';
    } else {
      showGlobalAlert('El correo electrónico o la contraseña son incorrectos.', 'error');
    }
  });

  // Evento opcional para la acción de recuperación de contraseña
  forgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Esta funcionalidad es didáctica. Para esta demostración utiliza la contraseña suministrada abajo.');
  });
});