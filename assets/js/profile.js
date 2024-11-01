import { getAuth, updateProfile, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from './config.js';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Espera a que el DOM se cargue completamente antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    const avatarInput = document.getElementById('profileImageInput');
    const userAvatarElement = document.getElementById('userAvatar');
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const displayName = user.displayName || user.email.split('@')[0];
            const photoURL = user.photoURL || 'https://i.pinimg.com/736x/37/02/a2/3702a28ea98faf933c92767cb527a269.jpg';
            const email = user.email;

            userNameElement.innerText = displayName;
            userAvatarElement.src = photoURL;
            userEmailElement.innerText = email;

            // Cargar datos de perfil desde Firestore
            loadProfileData(user.uid);

            // Evento para cambiar la foto de perfil
            avatarInput.addEventListener('change', async (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        userAvatarElement.src = reader.result; // Muestra la imagen seleccionada

                        try {
                            const storageRef = ref(storage, `profileImages/${user.uid}`);
                            await uploadString(storageRef, reader.result, 'data_url');
                            const downloadURL = await getDownloadURL(storageRef);

                            // Actualiza el perfil del usuario y guarda la URL en Firestore
                            await updateProfile(user, { photoURL: downloadURL });
                            await setDoc(doc(db, 'users', user.uid), { profileImageUrl: downloadURL }, { merge: true });

                            console.log("Foto de perfil actualizada exitosamente");
                        } catch (error) {
                            console.error("Error al cargar la imagen:", error);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            userNameElement.innerText = 'Bienvenido, visitante!';
            userAvatarElement.src = 'https://i.pinimg.com/736x/37/02/a2/3702a28ea98faf933c92767cb527a269.jpg';
            userEmailElement.innerText = '';
        }
    });
});

// Función para cargar los datos de perfil desde Firestore
async function loadProfileData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.profileImageUrl) {
                document.getElementById('userAvatar').src = data.profileImageUrl;
            }
            // Puedes agregar más campos aquí según tus necesidades
        }
    } catch (error) {
        console.error("Error al cargar los datos de perfil:", error);
    }
}


// Cerrar sesión, si funciona :D 
btnLogout.addEventListener('click', () => {
    console.log("click en salir");
    
    signOut(auth)
        .then(() => {
            console.log("Cierre de sesión exitoso.");
            window.location.href = '../../index.html';
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Intenta de nuevo.");
        });
  });
  
  