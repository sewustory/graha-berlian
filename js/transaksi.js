import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =====================
// ELEMENT
// =====================
const jenisSelect = document.getElementById("jenisTransaksi");
const kategoriSelect = document.getElementById("kategori");
const jumlahInput = document.getElementById("jumlah");
const keteranganInput = document.getElementById("keterangan");
const form = document.getElementById("formTransaksi");

// =====================
// MAP JENIS → COLLECTION
// =====================
const CATEGORY_MAP = {
  Cost: "cost_categories",
  Expense: "expense_categories",
  Income: "income_categories"
};

// =====================
// LOAD KATEGORI
// =====================
async function loadKategori(jenis) {
  kategoriSelect.innerHTML = `<option value="">Pilih kategori</option>`;

  const collectionName = CATEGORY_MAP[jenis];
  if (!collectionName) return;

  const snap = await getDocs(collection(db, collectionName));

  snap.forEach(doc => {
    const data = doc.data();

    // ⛔ HARD GUARD (INI PENTING)
    if (!data.isActive || !data.nama) return;

    const opt = document.createElement("option");
    opt.value = doc.id;
    opt.textContent = data.nama;
    kategoriSelect.appendChild(opt);
  });
}

// =====================
// EVENT: JENIS BERUBAH
// =====================
jenisSelect.addEventListener("change", e => {
  loadKategori(e.target.value);
});

// =====================
// SUBMIT TRANSAKSI
// =====================
form.addEventListener("submit", async e => {
  e.preventDefault();

  const jenis = jenisSelect.value;
  const kategoriId = kategoriSelect.value;
  const jumlah = Number(jumlahInput.value);
  const keterangan = keteranganInput.value;

  if (!jenis || !kategoriId || jumlah <= 0) {
    alert("Lengkapi data transaksi");
    return;
  }

  await addDoc(collection(db, "transactions"), {
    type: jenis.toLowerCase(),        // cost | expense | income
    categoryType: jenis,              // Cost | Expense | Income
    categoryId: kategoriId,
    amount: jumlah,
    keterangan,
    createdAt: serverTimestamp()
  });

  alert("Transaksi berhasil disimpan");
  form.reset();
  loadKategori(jenis);
});

// =====================
// INIT
// =====================
loadKategori(jenisSelect.value);
