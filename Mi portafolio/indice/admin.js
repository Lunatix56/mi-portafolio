document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const mainContent = document.getElementById('main-content');
    const loginContainer = document.getElementById('login-container');
    const loginNav = document.getElementById('login-nav');
    const logoutNav = document.getElementById('logout-nav');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const backButton = document.getElementById('back-button');
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // Verificar el estado de autenticación cuando se carga la página
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuario está logueado
            showMainContent();
            updateNavForLoggedIn();
        } else {
            // No hay usuario logueado, pero mostramos el contenido principal por defecto
            showMainContent();
            updateNavForLoggedOut();
        }
    });

    // Evento para mostrar el formulario de login
    loginNav.addEventListener('click', function(e) {
        e.preventDefault();
        hideMainContent();
        showLoginForm();
    });

    // Evento para cerrar sesión
    logoutNav.addEventListener('click', function(e) {
        e.preventDefault();
        firebase.auth().signOut().then(function() {
            updateNavForLoggedOut();
            showMainContent();
        }).catch(function(error) {
            console.error("Error al cerrar sesión:", error);
        });
    });

    // Evento para iniciar sesión
    loginButton.addEventListener('click', function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        loginError.textContent = '';
        
        if (!email || !password) {
            loginError.textContent = 'Por favor completa todos los campos';
            return;
        }
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function() {
                showMainContent();
                updateNavForLoggedIn();
            })
            .catch(function(error) {
                loginError.textContent = error.message;
            });
    });

    // Evento para registrarse
    registerButton.addEventListener('click', function() {
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        registerError.textContent = '';
        
        if (!email || !password) {
            registerError.textContent = 'Por favor completa todos los campos';
            return;
        }
        
        if (password.length < 6) {
            registerError.textContent = 'La contraseña debe tener al menos 6 caracteres';
            return;
        }
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function() {
                showMainContent();
                updateNavForLoggedIn();
                alert('Cuenta creada con éxito');
            })
            .catch(function(error) {
                registerError.textContent = error.message;
            });
    });

    // Evento para volver a la página principal
    backButton.addEventListener('click', function() {
        showMainContent();
    });

    // Funciones para mostrar/ocultar contenido
    function showMainContent() {
        mainContent.style.display = 'block';
        loginContainer.style.display = 'none';
    }

    function hideMainContent() {
        mainContent.style.display = 'none';
        loginContainer.style.display = 'block';
    }

    function showLoginForm() {
        loginContainer.style.display = 'block';
    }

    function updateNavForLoggedIn() {
        loginNav.style.display = 'none';
        logoutNav.style.display = 'inline-block';
    }

    function updateNavForLoggedOut() {
        loginNav.style.display = 'inline-block';
        logoutNav.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos DOM
    const mainContent = document.getElementById('main-content');
    const loginContainer = document.getElementById('login-container');
    const loginNav = document.getElementById('login-nav');
    const logoutNav = document.getElementById('logout-nav');
    const adminNav = document.getElementById('admin-nav');
    const loginButton = document.getElementById('login-button');
    const backButton = document.getElementById('back-button');
    const loginError = document.getElementById('login-error');

    // Credenciales de administrador
    const ADMIN_USERNAME = "Juandiosgaturro";
    const ADMIN_PASSWORD = "contraseña123456";

    // Variable global para controlar si estamos en modo admin
    window.isAdminMode = false;

    // Verificar el estado de autenticación cuando se carga la página
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // Usuario está logueado
            showMainContent();
            updateNavForLoggedIn();
            
            // Verificar si es admin (comprobando el email)
            if (user.email === "admin@tuportafolio.com") {
                window.isAdminMode = true;
                adminNav.style.display = 'inline-block';
                toggleAdminMode(false); // Por defecto no activamos el modo admin
            }
        } else {
            // No hay usuario logueado
            showMainContent();
            updateNavForLoggedOut();
            window.isAdminMode = false;
        }
    });

    // Evento para mostrar el formulario de login
    loginNav.addEventListener('click', function(e) {
        e.preventDefault();
        hideMainContent();
        showLoginForm();
    });

    // Evento para activar/desactivar modo admin
    adminNav.addEventListener('click', function(e) {
        e.preventDefault();
        toggleAdminMode();
    });

    // Evento para cerrar sesión
    logoutNav.addEventListener('click', function(e) {
        e.preventDefault();
        firebase.auth().signOut().then(function() {
            updateNavForLoggedOut();
            showMainContent();
            window.isAdminMode = false;
            toggleAdminMode(false);
        }).catch(function(error) {
            console.error("Error al cerrar sesión:", error);
        });
    });

    // Evento para iniciar sesión (con credenciales fijas para este ejemplo)
    loginButton.addEventListener('click', function() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        loginError.textContent = '';
        
        if (!username || !password) {
            loginError.textContent = 'Por favor completa todos los campos';
            return;
        }
        
        // Verificar credenciales de administrador
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // En caso de ser el admin, usar una cuenta fija para Firebase
            firebase.auth().signInWithEmailAndPassword("admin@tuportafolio.com", "adminpassword123")
                .then(function() {
                    showMainContent();
                    updateNavForLoggedIn();
                    window.isAdminMode = true;
                    adminNav.style.display = 'inline-block';
                })
                .catch(function(error) {
                    console.error("Error al iniciar sesión en Firebase:", error);
                    // Si la cuenta no existe, la creamos
                    if (error.code === 'auth/user-not-found') {
                        firebase.auth().createUserWithEmailAndPassword("admin@tuportafolio.com", "adminpassword123")
                            .then(function() {
                                showMainContent();
                                updateNavForLoggedIn();
                                window.isAdminMode = true;
                                adminNav.style.display = 'inline-block';
                            })
                            .catch(function(error) {
                                loginError.textContent = "Error al crear cuenta de administrador: " + error.message;
                            });
                    } else {
                        loginError.textContent = error.message;
                    }
                });
        } else {
            loginError.textContent = 'Usuario o contraseña incorrectos';
        }
    });

    // Evento para volver a la página principal
    backButton.addEventListener('click', function() {
        showMainContent();
    });

    // Funciones para mostrar/ocultar contenido
    function showMainContent() {
        mainContent.style.display = 'block';
        loginContainer.style.display = 'none';
    }

    function hideMainContent() {
        mainContent.style.display = 'none';
        loginContainer.style.display = 'block';
    }

    function showLoginForm() {
        loginContainer.style.display = 'block';
    }

    function updateNavForLoggedIn() {
        loginNav.style.display = 'none';
        logoutNav.style.display = 'inline-block';
    }

    function updateNavForLoggedOut() {
        loginNav.style.display = 'inline-block';
        logoutNav.style.display = 'none';
        adminNav.style.display = 'none';
    }

    // Función para activar/desactivar el modo admin
    function toggleAdminMode(toggle = null) {
        if (toggle === null) {
            window.adminModeActive = !window.adminModeActive;
        } else {
            window.adminModeActive = toggle;
        }

        const editButtons = document.querySelectorAll('.edit-button-container, #change-profile-image');
        
        if (window.adminModeActive) {
            adminNav.textContent = "✓ Modo Admin";
            editButtons.forEach(button => button.style.display = 'block');
        } else {
            adminNav.textContent = "Modo Admin";
            editButtons.forEach(button => button.style.display = 'none');
        }
    }
});
