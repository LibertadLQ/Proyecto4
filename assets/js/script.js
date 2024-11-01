import { registerUser, loginUser, loginWithGoogle } from "./config.js";

document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginForm = document.querySelector("#loginForm");
    const registerForm = document.querySelector("#registerForm");
    const crowContainer = document.getElementById('crow-container');
    const passwordField = document.getElementById('loginPassword');
    const registerPasswordField = document.getElementById('registerPassword');
    const eyeIcon = document.getElementById('eye-icon');
    const eyeSlashIcon = document.getElementById('eye-slash-icon');
    const eyeIcon2 = document.getElementById('eye-icon-2');
    const eyeSlashIcon2 = document.getElementById('eye-slash-icon-2');

    // Cambiar entre formularios
    loginBtn.addEventListener('click', () => {
        loginForm.style.left = "50%";
        registerForm.style.left = "-50%";
        loginForm.style.opacity = 1;
        registerForm.style.opacity = 0;
        loginBtn.classList.add('btn-inactive');
        registerBtn.classList.remove('btn-inactive');
    });

    registerBtn.addEventListener('click', () => {
        loginForm.style.left = "150%";
        registerForm.style.left = "50%";
        loginForm.style.opacity = 0;
        registerForm.style.opacity = 1;
        registerBtn.classList.add('btn-inactive');
        loginBtn.classList.remove('btn-inactive');
    });

    // Envío formulario de registro
    document.querySelector('.register-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const fullName = document.getElementById('registerUser').value;

        if (email && password && fullName) {
            registerUser(email, password, fullName)
                .then(() => {
                    crowContainer.style.display = 'none';
                    document.querySelector('.register-form').reset();
                    console.log("Registro exitoso. ¡Bienvenido!");
                    window.location.href = '../html/feed.html';
                })
                .catch((error) => {
                    console.error(error);
                    alert(`Error: ${error.message}`);
                });
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    // Envío formulario de inicio de sesión
    document.querySelector('.login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (email && password) {
            loginUser(email, password)
                .then(() => {
                    document.querySelector('.login-form').reset();
                })
                .catch((error) => {
                    alert(`Error: ${error.message}`);
                });
        } else {
            alert('Por favor, completa todos los campos.');
        }
    });

    // Iniciar sesión con Google
    document.getElementById('loginGoogleBtn').addEventListener('click', (event) => {
        event.preventDefault();
        loginWithGoogle()
            .then((result) => {
                const user = result.user;
                const email = user.email;

                if (email) {
                    registerUser(email, "someDefaultPassword", user.displayName)
                        .then(() => {
                            alert("Registro exitoso!");
                        })
                        .catch((error) => {
                            console.error(error);
                            alert(`Error al registrar: ${error.message}`);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                alert(`Error al iniciar sesión con Google: ${error.message}`);
            });
    });

    // Mostrar/Ocultar contraseña - Login
    eyeIcon.addEventListener('click', () => {
        passwordField.type = 'text';
        eyeIcon.style.display = 'none';
        eyeSlashIcon.style.display = 'inline';
    });

    eyeSlashIcon.addEventListener('click', () => {
        passwordField.type = 'password';
        eyeSlashIcon.style.display = 'none';
        eyeIcon.style.display = 'inline';
    });

    // Mostrar/Ocultar contraseña - Registro
    eyeIcon2.addEventListener('click', () => {
        registerPasswordField.type = 'text';
        eyeIcon2.style.display = 'none';
        eyeSlashIcon2.style.display = 'inline';
    });

    eyeSlashIcon2.addEventListener('click', () => {
        registerPasswordField.type = 'password';
        eyeSlashIcon2.style.display = 'none';
        eyeIcon2.style.display = 'inline';
    });

    // Animación de letras en el título del formulario
    const letters = document.querySelectorAll('.form-title span');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.1}s`;
    });

    // Activar la animación fade-in en el body
    document.body.classList.add('fade-in-active');
});

