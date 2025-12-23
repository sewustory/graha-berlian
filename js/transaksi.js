import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const jenisEl = document.getElementById("jenis");
const kategoriEl = document.getElementById("kategori");
const jumlahEl = document.getElementById("jumlah");
const keteranganEl = document.getElementById("keterangan");
const btnSimpan = document.getElementById("btnSimpan");

// 🔥 mapping JELAS, TIDAK HALU
const CATEGORY_MAP = {
  income: "income_categories",
  expense: "expense_categories",
  cost: "cost_categories"
};

// ==========================
// LOAD KATEGORI
// ==========================
async function loadKategori() {
  kategoriEl.innerHTML = `<option value="">Pilih kategori</option>`;

  const jenis = jenisEl.value;
  const collectionName = CATEGORY_MAP[jenis];

  if (!collectionName) return;

  const snap = await getDocs(collection(db, collectionName));

  snap.forEach(doc => {
    const data = doc.data();

    // ❗ JANGAN FILTER isActive dulu biar GA KE-SKIP
    if (!data.nama) return;

    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = data.nama; // ✅ BUKAN label
    kategoriEl.appendChild(opt);
  });
}

// ==========================
// EVENT
// ==========================
jenisEl.addEventListener("change", loadKategori);

// ==========================
// SIMPAN TRANSAKSI
// ==========================
btnSimpan.addEventListener("click", async () => {
  if (!kategoriEl.value || !jumlahEl.value) {
    alert("Lengkapi data");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Belum login");
    return;
  }

  await addDoc(collection(db, "transactions"), {
    type: jenisEl.value,
    categoryId: kategoriEl.value,
    amount: Number(jumlahEl.value),
    keterangan: keteranganEl.value,
    createdBy: user.uid,
    createdAt: serverTimestamp()
  });

  alert("Transaksi tersimpan");
  window.location.href = "dashboard.html";
});

// load awal
loadKategori();
