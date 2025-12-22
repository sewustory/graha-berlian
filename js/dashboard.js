import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btnLogout = document.getElementById("btnLogout");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
