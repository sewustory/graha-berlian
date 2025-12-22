import { db } from "./firebase.js";
import { collection, getDocs } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const output = document.getElementById("output");

document.getElementById("loadData").onclick = async () => {
  const snap = await getDocs(collection(db, "expense_categories"));
  const data = [];
  snap.forEach(d => data.push({ id: d.id, ...d.data() }));
  output.textContent = JSON.stringify(data, null, 2);
};
