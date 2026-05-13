const firebaseConfig = {
  apiKey: "AIzaSyCvjY8LXYzP8849WHHI18xNocYRkUjSXpU",
  authDomain: "site-comments-b15a5.firebaseapp.com",
  projectId: "site-comments-b15a5",
  storageBucket: "site-comments-b15a5.firebasestorage.app",
  messagingSenderId: "686025413659",
  appId: "1:686025413659:web:2b2b78b21140524c9614be"
};

// conecta Firebase via CDN (sem npm)
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(app);

// pega comentários
async function loadComments() {
  const container = document.getElementById("comments");
  if (!container) return;

  const snapshot = await db.collection("comments").get();

  container.innerHTML = "";

  snapshot.forEach(doc => {
    const data = doc.data();

    const div = document.createElement("div");
    div.style.padding = "8px 0";
    div.style.borderBottom = "1px solid #ccc";

    div.innerHTML = `<strong>${data.name}</strong>: ${data.text}`;

    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadComments);