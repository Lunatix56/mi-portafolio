// Esperar a que el DOM se cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    const loginNav = document.getElementById("login-nav");
    const logoutNav = document.getElementById("logout-nav");
    const loginContainer = document.getElementById("login-container");
    const mainContent = document.getElementById("main-content");
    const backButton = document.getElementById("back-button");
    
    const loginEmail = document.getElementById("login-email");
    const loginPassword = document.getElementById("login-password");
    const loginButton = document.getElementById("login-button");
    const loginError = document.getElementById("login-error");

    const registerEmail = document.getElementById("register-email");
    const registerPassword = document.getElementById("register-password");
    const registerButton = document.getElementById("register-button");
    const registerError = document.getElementById("register-error");
    
    // Manejar el estado de autenticación
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loginNav.style.display = "none";
            logoutNav.style.display = "inline-block";
        } else {
            loginNav.style.display = "inline-block";
            logoutNav.style.display = "none";
        }
    });

    // Mostrar formulario de login
    loginNav.addEventListener("click", (e) => {
        e.preventDefault();
        loginContainer.style.display = "block";
        mainContent.style.display = "none";
    });

    // Volver a la página principal
    backButton.addEventListener("click", () => {
        loginContainer.style.display = "none";
        mainContent.style.display = "block";
    });

    // Iniciar sesión
    loginButton.addEventListener("click", () => {
        const email = loginEmail.value;
        const password = loginPassword.value;
        loginError.textContent = "";

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                loginContainer.style.display = "none";
                mainContent.style.display = "block";
            })
            .catch(error => {
                loginError.textContent = error.message;
            });
    });

    // Registrar usuario
    registerButton.addEventListener("click", () => {
        const email = registerEmail.value;
        const password = registerPassword.value;
        registerError.textContent = "";

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(() => {
                loginContainer.style.display = "none";
                mainContent.style.display = "block";
            })
            .catch(error => {
                registerError.textContent = error.message;
            });
    });

    // Cerrar sesión
    logoutNav.addEventListener("click", (e) => {
        e.preventDefault();
        firebase.auth().signOut()
            .then(() => {
                loginContainer.style.display = "none";
                mainContent.style.display = "block";
            })
            .catch(error => {
                console.error("Error al cerrar sesión: ", error);
            });
    });
});


    