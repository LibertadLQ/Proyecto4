document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.querySelector('.btn-primary');
    const backButton = document.querySelector('.btn-secondary');

    logoutButton.addEventListener('click', function () {
        // Lógica para cerrar sesión
        alert('Sesión cerrada.'); // Reemplaza esto con la lógica de cierre de sesión
    });

    backButton.addEventListener('click', function () {
        // Lógica para volver al feed
        window.location.href = '../html/feed.html'; 
    });
});


