import {
    getAuth,
    updateProfile,
    signOut,
    onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
    getStorage,
    ref,
    uploadString,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from './config.js';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    const avatarInput = document.getElementById("profileImageInput");
    const userAvatarElement = document.getElementById("userAvatar");
    const userNameElement = document.getElementById("userName");
    const userEmailElement = document.getElementById("userEmail");
    const descriptionDisplay = document.getElementById("descriptionDisplay");
    const birthdateDisplay = document.getElementById("birthdateDisplay");
    const instagramDisplay = document.getElementById("instagramDisplay");
    const linkedinDisplay = document.getElementById("linkedinDisplay");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            userNameElement.innerText = user.displayName || user.email.split("@")[0];
            userEmailElement.innerText = user.email;
            userAvatarElement.src = user.photoURL || 'https://i.pinimg.com/736x/37/02/a2/3702a28ea98faf933c92767cb527a269.jpg';

            loadProfileData(user.uid);

            avatarInput.addEventListener("change", async (event) => {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                        userAvatarElement.src = reader.result;

                        try {
                            const storageRef = ref(storage, `profileImages/${user.uid}`);
                            await uploadString(storageRef, reader.result, "data_url");
                            const downloadURL = await getDownloadURL(storageRef);

                            await updateProfile(user, { photoURL: downloadURL });
                            await setDoc(
                                doc(db, "perfiles", user.uid),
                                { profileImageUrl: downloadURL },
                                { merge: true }
                            );

                            console.log("Foto de perfil actualizada exitosamente");
                        } catch (error) {
                            console.error("Error al cargar la imagen:", error);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    });

    async function loadProfileData(userId) {
        try {
            const userDoc = await getDoc(doc(db, "perfiles", userId));
            if (userDoc.exists()) {
                const data = userDoc.data();

                if (data.profileImageUrl) {
                    userAvatarElement.src = data.profileImageUrl;
                }
                if (data.description) {
                    descriptionDisplay.textContent = data.description;
                    descriptionDisplay.classList.remove("d-none");
                }
                if (data.birthdate) {
                    birthdateDisplay.textContent = data.birthdate;
                    birthdateDisplay.classList.remove("d-none");
                    setupCountdown(data.birthdate);
                }
                if (data.instagram) {
                    document.getElementById("instagramLink").href = data.instagram;
                    instagramDisplay.classList.remove("d-none");
                }
                if (data.linkedin) {
                    document.getElementById("linkedinLink").href = data.linkedin;
                    linkedinDisplay.classList.remove("d-none");
                }
            }
        } catch (error) {
            console.error("Error al cargar los datos de perfil:", error);
        }
    }

    function setupCountdown(birthdate) {
        const today = new Date();
        const birthdateDate = new Date(birthdate);
        birthdateDate.setFullYear(today.getFullYear());

        if (birthdateDate < today) {
            birthdateDate.setFullYear(today.getFullYear() + 1);
        }

        const timeUntilBirthday = birthdateDate - today;
        const daysUntilBirthday = Math.ceil(timeUntilBirthday / (1000 * 60 * 60 * 24));

        if (daysUntilBirthday === 0) {
            birthdateDisplay.textContent = "¡Feliz cumpleaños!";
        } else {
            birthdateDisplay.textContent = `Faltan ${daysUntilBirthday} días para tu cumpleaños`;
        }
    }

    document.getElementById("editProfileForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (user) {
            const description = document.getElementById("descriptionEdit").value;
            const birthdate = document.getElementById("birthdateEdit").value;
            const instagram = document.getElementById("instagramEdit").value;
            const linkedin = document.getElementById("linkedinEdit").value;

            await setDoc(
                doc(db, "perfiles", user.uid),
                { description, birthdate, instagram, linkedin },
                { merge: true }
            );

            loadProfileData(user.uid);

            const modal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
            modal.hide();
        }
    });
});
//btnLogout
document.getElementById("btnLogout").addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            window.location.href = "../../index.html";
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Intenta de nuevo.");
        });
});