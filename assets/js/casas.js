// Obtener elementos del DOM
const logoutButton = document.getElementById('logout-button');
const modal = document.getElementById('myModal');
const closeButton = document.getElementsByClassName('close')[0];
const confirmLogoutButton = document.getElementById('confirm-logout');

// Mostrar el modal al hacer clic en el botón de "Ir al feed"
logoutButton.onclick = function() {
    modal.style.display = 'block';
};

// Cerrar el modal cuando se hace clic en la "x"
closeButton.onclick = function() {
    modal.style.display = 'none';
};

// Cerrar el modal si se hace clic fuera del contenido del modal
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Redirigir a feed.html al confirmar el retorno
confirmLogoutButton.onclick = function() {
    window.location.href = 'feed.html';
};