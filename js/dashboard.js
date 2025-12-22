import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User tidak terdaftar");
    await signOut(auth);
    window.location.href = "login.html";
    return;
  }

  const data = snap.data();

  if (!data.isActive) {
    alert("Akun tidak aktif");
    await signOut(auth);
    window.location.href = "login.html";
    return;
  }

  const allowedRoles = ["admin", "staff"];

if (!allowedRoles.includes(data.role)) {
  alert("Akses ditolak");
  await signOut(auth);
  window.location.href = "login.html";
  return;
}


  // ✅ LOLOS → ADMIN
  console.log("Login sukses:", data.role, data.email);
});

// logout
document.getElementById("btnLogout")?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "login.html";
});
