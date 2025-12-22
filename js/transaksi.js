import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById("formTransaksi");
const typeEl = document.getElementById("type");
const categoryEl = document.getElementById("categoryId");

// 🔥 LOAD KATEGORI DARI FIRESTORE (TIDAK HALU)
async function loadCategories() {
  categoryEl.innerHTML = "<option value=''>Pilih kategori</option>";

  const type = typeEl.value;
  let collectionName = "";

if (type === "expense") {
  collectionName = "expense_categories";
}

if (type === "income") {
  collectionName = "cost_categories"; 
  // atau nanti: income_categories kalau kamu bikin
}

  const snap = await getDocs(collection(db, collectionName));

  snap.forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = doc.data().nama;
    categoryEl.appendChild(opt);
  });
}

// reload kategori saat jenis berubah
typeEl.addEventListener("change", loadCategories);

// submit transaksi
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    type: typeEl.value,
    categoryId: categoryEl.value,
    amount: Number(amount.value),
    keterangan: keterangan.value,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser.uid
  };

  if (!data.categoryId) {
    alert("Kategori wajib dipilih");
    return;
  }

  if (!data.amount || data.amount <= 0) {
    alert("Jumlah tidak valid");
    return;
  }

  await addDoc(collection(db, "transactions"), data);
  alert("Transaksi berhasil disimpan");
  window.location.href = "dashboard.html";
});

// auth guard
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
  else loadCategories();
});
