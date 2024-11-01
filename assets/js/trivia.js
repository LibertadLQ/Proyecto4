$(document).ready(function () {
    // Variables
    let currentQuestion = 0;
    const totalQuestions = $(".pregunta").length - 1; // -1 para no contar el resultado final

    // Función para mostrar la siguiente pregunta
    function showNextQuestion() {
        // Oculta la pregunta actual
        $(".pregunta").eq(currentQuestion).hide();

        // Si aún hay más preguntas, muestra la siguiente
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            $(".pregunta").eq(currentQuestion).show();
        } else {
            // Si ya no hay más preguntas, muestra el resultado
            calculateHouse();
            $("#resultadoFinal").show();
            $("#siguienteBtn").hide(); // Oculta el botón de siguiente al terminar
        }
    }

    // Función para calcular la casa asignada
    function calculateHouse() {
        const houseScores = {
            athena: 0,
            luminaria: 0,
            nova: 0,
            salus: 0
        };

        // Recorrer todas las preguntas y sumar puntos según las respuestas
        $(".pregunta input[type='radio']:checked").each(function () {
            const selectedValue = $(this).val();
            houseScores[selectedValue]++;
        });

        // Determinar la casa con mayor puntuación
        let assignedHouse = Object.keys(houseScores).reduce((a, b) => houseScores[a] > houseScores[b] ? a : b);

        // Guardar la casa asignada en localStorage
        localStorage.setItem("casaAsignada", assignedHouse);

        // Mostrar la casa asignada con la primera letra en mayúscula
        $("#casaResultado").text(assignedHouse.charAt(0).toUpperCase() + assignedHouse.slice(1));

        // Mostrar la imagen de la casa asignada
        mostrarResultado(assignedHouse);
    }

    // Función para mostrar el resultado de la casa y su imagen
    function mostrarResultado(casa) {
        document.getElementById('imagenCasa').src = casas[casa.charAt(0).toUpperCase() + casa.slice(1)]; // Asignar la imagen de la casa
        document.getElementById('resultadoFinal').style.display = 'block'; // Mostrar el mensaje final
    }

    // Evento de clic para el botón "Siguiente"
    $("#siguienteBtn").click(function () {
        // Verifica si se ha seleccionado una respuesta en la pregunta actual
        if ($(".pregunta").eq(currentQuestion).find("input[type='radio']:checked").length > 0) {
            showNextQuestion();
        } else {
            alert("Por favor, selecciona una respuesta antes de continuar.");
        }
    });

    // Mostrar solo la primera pregunta al cargar
    $(".pregunta").eq(0).show();

    // Evento para el botón "Ir a mi feed"
    $("#goToFeedBtn").click(function () {
        // Redirigir al feed o página principal
        window.location.href = `feed.html`;
    });

    // Selecciona todas las opciones de radio y añade un evento de cambio
    $(".radio-option input[type='radio']").change(function () {
        // Encuentra el contenedor .form-group más cercano
        var parentGroup = $(this).closest('.form-group');
        
        // Quitar la clase 'selected' de todas las tarjetas en el mismo grupo
        parentGroup.find(".radio-option").removeClass("selected");
        
        // Agregar la clase 'selected' a la tarjeta seleccionada
        $(this).closest('.radio-option').addClass("selected");
    });

    // Asegúrate de que las tarjetas respondan a los clics
    $(".radio-option").click(function() {
        $(this).find("input[type='radio']").prop("checked", true).change();
    });
});

// Definición de las casas y sus imágenes
const casas = {
    Athena: '../img/icons-cards/aguila.jpg',  // Asegúrate de que esta ruta sea correcta
    Luminaria: '../img/icons-cards/fenix.jpg', // Asegúrate de que esta ruta sea correcta
    Nova: '../img/icons-cards/leon.jpg',     // Asegúrate de que esta ruta sea correcta
    Salus: '../img/icons-cards/cisne.jpg'          // Asegúrate de que esta ruta sea correcta
};
