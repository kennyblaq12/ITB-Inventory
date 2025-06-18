import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCoXwugLJOEV0IRpoueZxCETVeeyOL9Y9I",
  authDomain: "itb-project-5727e.firebaseapp.com",
  projectId: "itb-project-5727e",
  storageBucket: "itb-project-5727e.firebasestorage.app",
  messagingSenderId: "113955313782",
  appId: "1:113955313782:web:99f4733a2cf623912ee757",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // alert("Login successful!");
      window.location.href = "dashboard.html"; // Redirect on success
    })
    .catch((error) => {
      alert(" Incorrect Email or Password");
    });
};

document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById("toggle-password");
  const passwordInput = document.getElementById("password");

  togglePassword.addEventListener("click", () => {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Toggle icon
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
});
