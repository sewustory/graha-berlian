import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("btnSave").addEventListener("click", async () => {
    const type = document.getElementById("type").value;
    const categoryType = document.getElementById("categoryType").value;
    const categoryId = document.getElementById("categoryId").value;
    const amount = Number(document.getElementById("amount").value);
    const keterangan = document.getElementById("keterangan").value;

    if (!amount || amount <= 0) {
      alert("Jumlah tidak valid");
      return;
    }

    try {
      await addDoc(collection(db, "transactions"), {
        type,
        categoryType,
        categoryId,
        amount,
        keterangan,
        tanggal: serverTimestamp(),
        createdAt: serverTimestamp(),
        createdBy: user.uid
      });

      alert("Transaksi berhasil disimpan");
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan transaksi");
    }
  });
});

