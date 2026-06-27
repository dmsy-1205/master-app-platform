import { auth } from './firebase.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const loginBtn = document.getElementById('loginBtn');
const content = document.getElementById('main-content');
const authSection = document.getElementById('auth-section');

loginBtn.addEventListener('click', async () => {
    try {
        await signInWithEmailAndPassword(auth, document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
        location.reload();
    } catch (e) { alert(e.message); }
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        authSection.style.display = 'none';
        content.style.display = 'block';
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(() => location.reload()));