import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const jenisEl = document.getElementById("jenis");
const kategoriEl = document.getElementById("kategori");
const jumlahEl = document.getElementById("jumlah");
const ketEl = document.getElementById("keterangan");
const btnSimpan = document.getElementById("btnSimpan");

onAuthStateChanged(auth, user => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// LOAD KATEGORI SESUAI JENIS
async function loadKategori(type) {
  kategoriEl.innerHTML = `<option value="">Pilih kategori</option>`;

  let colName = "";
  if (type === "income") colName = "income_categories";
  if (type === "expense") colName = "expense_categories";
  if (type === "cost") colName = "cost_categories";

  const snap = await getDocs(collection(db, colName));

  snap.forEach(doc => {
    const data = doc.data();

    // 🔒 GUARD WAJIB
    if (!data.nama) return;
    if (data.isActive !== true) return;

    kategoriEl.innerHTML += `
      <option value="${doc.id}">
        ${data.nama}
      </option>
    `;
  });
}

// INIT
loadKategori(jenisEl.value);

// CHANGE JENIS
jenisEl.addEventListener("change", () => {
  loadKategori(jenisEl.value);
});

// SIMPAN TRANSAKSI
btnSimpan.addEventListener("click", async () => {
  if (!kategoriEl.value) {
    alert("Kategori wajib dipilih");
    return;
  }

  if (jumlahEl.value <= 0) {
    alert("Jumlah harus lebih dari 0");
    return;
  }

  await addDoc(collection(db, "transactions"), {
    type: jenisEl.value,            // income | expense | cost
    categoryId: kategoriEl.value,
    amount: Number(jumlahEl.value),
    keterangan: ketEl.value,
    createdAt: serverTimestamp(),
    createdBy: auth.currentUser.uid
  });

  alert("Transaksi berhasil disimpan");
  jumlahEl.value = 0;
  ketEl.value = "";
});
