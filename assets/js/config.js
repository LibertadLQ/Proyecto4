import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"; //autentificacion de usuarios
import { getFirestore, collection, query, orderBy, addDoc, getDocs, 
    getDoc, deleteDoc, onSnapshot, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"; //almacena y gestiona datos
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js"; //actualiza el perfil del usuario 
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"; 
import { getStorage, ref, getDownloadURL,  uploadBytes } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";


// Firebase configuration 
export const firebaseConfig = {
    apiKey: "AIzaSyCf_lH7ndXTE405SZc8YDcwXFdg6LrTsQE",
    authDomain: "redsocialeduconect.firebaseapp.com",
    projectId: "redsocialeduconect",
    storageBucket: "redsocialeduconect.appspot.com",
    messagingSenderId: "654346742916",
    appId: "1:654346742916:web:b392def2f54a9b1e3466d1",
    measurementId: "G-C48L1Z9T1Q"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // Proveedor de Google
const storage = getStorage(app);

export function registerUser(email, password, fullName) {
    return createUserWithEmailAndPassword(auth,email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Registro exitoso. ¡Bienvenido!");

            // Actualiza el nombre en Firebase Authentication
            return updateProfile(user, {
                displayName: fullName,
            }).then(() => {
                console.log("Nombre actualizado exitosamente");
                // Agrega el usuario a Firestore
                return addUserToFirestore(user.uid, fullName);
            });
        })
        .catch((error) => {
            console.error("Error al registrar:", error.code, error.message);
            alert("Error al registrar: " + error.message);
        });
}

// Función para agregar el usuario a Firestore
function addUserToFirestore(uid, fullName) {
    return addDoc(collection(db, "users"), {
        uid: uid,
        displayName: fullName,
        timestamp: serverTimestamp(),
    }).then(() => {
        console.log("Usuario agregado a Firestore");
    }).catch((error) => {
        console.error("Error al agregar usuario a Firestore:", error.message);
    });
}

// Función para iniciar sesión
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Inicio de sesión exitoso. ¡Bienvenido!");
            window.location.href = "./assets/html/feed.html";//Cmbiar segun nombre de la carpeta del feed
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error.code, error.message);
            alert("Error al iniciar sesión: " + error.message);
        });
}

// Función para iniciar sesión con Google
export function loginWithGoogle() {
    return signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Inicio de sesión con Google exitoso. ¡Bienvenido!", result.user);
            window.location.href = './assets/html/feed.html';//Cambiar segun nombre de la carpeta del feed
            return result; // Retorna el resultado para que se maneje en script.js
        })
        .catch((error) => {
            console.error("Error al iniciar sesión con Google:", error.code, error.message);
            alert("Error al iniciar sesión con Google: " + error.message);
        });
}



// Función para agregar un comentario
export function agregarComentario(postId, comentario) {
    const publicacionRef = doc(db, "publicaciones", postId);
    const comentariosRef = collection(publicacionRef, "comentarios");
    return addDoc(comentariosRef, {
        postId: postId,
        comentario: comentario,
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || 'Usuario anónimo',
        timestamp: serverTimestamp()
    });
}

// Función para obtener comentarios en tiempo real
export function cargarComentariosEnTiempoReal(postId, callback) {
    const comentariosRef = collection(db, "publicaciones", postId, "comentarios");
    const q = query(comentariosRef, orderBy("timestamp", "asc"));
    return onSnapshot(q, callback);
}

//             FEEED 
// Función para agregar una post
export function agregarPost(comentario, imageFile) {
    let imageUrl = null;
    console.log("guardando el post:", comentario);
    // Verifica si hay un archivo de imagen
    if (imageFile) {
        const storageRef = ref(storage, `images/${auth.currentUser.uid}/${imageFile.name}`);
        return uploadBytes(storageRef, imageFile).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
        }).then((url) => {
            imageUrl = url;
            // Guarda el post con el comentario y la URL de la imagen
            return addDoc(collection(db, 'publicaciones'), {
                comentario: comentario,
                uid: auth.currentUser.uid, 
                likeContador: 0, 
                likePost: [],
                imageUrl: imageUrl, 
                displayName: auth.currentUser.displayName || 'Usuario anónimo',
                timestamp: serverTimestamp() // Marca de tiempo del servidor
            });
        });
    } else {
        // Guarda el post sin imagen
        return addDoc(collection(db, 'publicaciones'), {
            comentario: comentario,
            uid: auth.currentUser.uid,
            likeContador: 0, // Contador de likes
            imageUrl: null, // Sin imagen
            displayName: auth.currentUser.displayName || 'Usuario anónimo',
            timestamp: serverTimestamp() 
        });
    }
}

export function totalPost() {
    console.log("publicaciones totales");
    return getDocs(query(collection(db, 'publicaciones'), orderBy("timestamp", "desc")));
}


export function obtenerPost(id) {
    console.log("post buscado:", id);
    return getDoc(doc(db, 'publicaciones', id));
}

export function actualizado(id, newFields) {
    console.log("actualizado:", id);
    return updateDoc(doc(db, 'publicaciones', id), newFields);
}

export function eliminar(id) {
    console.log("eliminado:", id);
    return deleteDoc(doc(db, "publicaciones", id));
}

export function modificarLike(postId) {
    const userId = auth.currentUser.uid; 

    // Referencia al documento del post
    const postRef = doc(db, "publicaciones", postId);

    return getDoc(postRef).then((doc) => {
        if (doc.exists()) {
            const postData = doc.data();

            if (postData.likePost && postData.likePost.includes(userId)) {
                const updatedLikes = postData.likePost.filter(uid => uid !== userId); 
                const newLikeCount = postData.likeContador - 1; 

                return updateDoc(postRef, {
                    likePost: updatedLikes,
                    likeContador: newLikeCount
                }).then(() => {
                    console.log("Like eliminado.");
                });
            } else {
                const updatedLikes = postData.likePost ? [...postData.likePost, userId] : [userId]; 
                const newLikeCount = postData.likeContador + 1; 

                return updateDoc(postRef, {
                    likePost: updatedLikes,
                    likeContador: newLikeCount
                }).then(() => {
                    console.log("Like añadido.");
                });
            }
        } else {
            console.error("El documento no existe.");
        }
    }).catch((error) => {
        console.error("Error al modificar el like:", error);
    });
}

  
//Profile
// Función para actualizar perfil de usuario con descripción, IG, y LinkedIn
export const updateUserProfileStats = async (userId, description, instagramUrl, linkedinUrl) => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Contar el número de posts y likes (si estas funciones están definidas)
            const postCount = await totalPostByUser(userId);
            const likeCount = await totalLikesByUser(userId);

            // Actualizar la información del perfil, incluyendo descripción, IG y LinkedIn
            await updateDoc(userDocRef, {
                description: description || userData.description || '',
                instagramUrl: instagramUrl || userData.instagramUrl || '',
                linkedinUrl: linkedinUrl || userData.linkedinUrl || '',
                postCount: postCount,
                likeCount: likeCount,
            });

            console.log("Perfil actualizado exitosamente con descripción, Instagram y LinkedIn.");
        }
    } catch (error) {
        console.error("Error al actualizar las estadísticas del usuario:", error);
    }
};

// Ejemplo de uso
// updateUserProfileStats('userId123', 'Nueva descripción', 'https://instagram.com/tuperfil', 'https://linkedin.com/in/tuperfil');

export { auth };
