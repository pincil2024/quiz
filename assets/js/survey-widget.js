// survey-widget.js (with Firestore tracking)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKFiCF8Foaq6e5LZq9wJ_yphxPuUhn6vE",
  authDomain: "token-f9eeb.firebaseapp.com",
  projectId: "token-f9eeb",
  storageBucket: "token-f9eeb.appspot.com",
  messagingSenderId: "813958921402",
  appId: "1:813958921402:web:dfe905e58af885421ed683"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

signInAnonymously(auth).catch(console.error);

 (function () { 
    const surveyHTML = `
      <div id="survey-floating-btn" style="position: fixed; bottom: 20px; right: 20px; background: #ffcd4b; border-radius: 50%; width: 60px; height: 60px; text-align: center; font-size: 28px; line-height: 60px; cursor: pointer; z-index: 999; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);">📝</div>
      <div id="survey-reminder" style="position: fixed; bottom: 30px; right: 90px; z-index: 1000; display: none; align-items: center; gap: 6px;">
        <div style="color:rgb(14, 12, 1); background: #fff8dc; padding: 10px 14px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.2); font-size: 14px;">
          Mohon luangkan waktu untuk mengisi survei 🙏
        </div>
        <div id="arrow-animation" style="font-size: 30px; animation: bounceArrow 1s infinite;">👉</div>
      </div>
      <style>
        @keyframes bounceArrow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
      </style>
      <div id="survey-dialog" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 100000; display: none; align-items: left; justify-content: center;">
        <div id="survey-box" style="background: white; padding: 20px; max-width: 550px; width: 90%; border-radius: 12px; position: relative;">
          <button id="close-survey" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; font-size: 24px; cursor: pointer;">×</button>
          <div id="survey-form-wrapper" style="text-align: left;">
            <form id="survey-form" style="text-align: left;">
              <h2>📝 Form Umpan Balik Pengujian Pincil</h2>
              <h3>Informasi Peserta</h3>
              <label>Nama:</label>
              <input type="text" name="nama" required><br>

              <label>Nama Anak:</label>
              <input type="text" name="anak"><br>

              <label>Usia anak:</label>
              <input type="number" name="usia" required><br>

              <label>Kelas anak:</label>
              <input type="number" name="kelas" required><br>

              <h3>Pengalaman Menggunakan Aplikasi</h3>
              <label>Seberapa mudah Anda mengakses aplikasi?</label>
              <select name="akses">
                <option>Sangat mudah</option>
                <option>Mudah</option>
                <option>Cukup sulit</option>
                <option>Sulit</option>
              </select><br>

              <label>Apakah tampilan dan navigasi aplikasi cukup jelas?</label>
              <select name="navigasi">
                <option>Sangat jelas</option>
                <option>Cukup jelas</option>
                <option>Kurang jelas</option>
                <option>Tidak jelas sama sekali</option>
              </select><br>

              <label>Apakah Anda mengalami kendala teknis?</label><br>
              <input type="checkbox" name="masalah" value="Tidak ada masalah"> Tidak ada masalah<br>
              <input type="checkbox" name="masalah" value="Aplikasi lambat"> Aplikasi lambat<br>
              <input type="checkbox" name="masalah" value="Tidak bisa login / masuk"> Tidak bisa login / masuk<br>
              <input type="checkbox" name="masalah" value="Halaman tidak tampil dengan benar"> Halaman tidak tampil dengan benar<br>
              <input type="checkbox" name="masalah" value="Lainnya"> Lainnya: <textarea name="lainnya"></textarea><br>

              <label>Fitur yang paling disukai:</label>
              <textarea name="fiturFavorit"></textarea><br>

              <label>Saran untuk peningkatan aplikasi:</label>
              <textarea name="saran"></textarea><br>

              <h3>Penggunaan dan Nilai Edukatif</h3>
              <label>Seberapa bermanfaat aplikasi ini?</label>
              <select name="manfaat">
                <option>Sangat bermanfaat</option>
                <option>Bermanfaat</option>
                <option>Kurang bermanfaat</option>
                <option>Tidak bermanfaat</option>
              </select><br>

              <label>Apakah Anda ingin menggunakan aplikasi ini secara rutin?</label>
              <select name="rutin">
                <option>Ya</option>
                <option>Mungkin</option>
                <option>Tidak</option>
              </select><br>

              <label>Komentar tambahan:</label><br>
              <textarea name="komentar"></textarea><br>

              <button type="submit">Kirim</button>
            </form>
            <p id="survey-status" style="margin-top: 10px; color: green;"></p>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = surveyHTML;
    document.body.appendChild(wrapper);

    const dialog = document.getElementById('survey-dialog');
    const openBtn = document.getElementById('survey-floating-btn');
    const closeBtn = document.getElementById('close-survey');
    const form = document.getElementById('survey-form');
    const statusEl = document.getElementById('survey-status');

    openBtn.addEventListener('click', () => {
      dialog.style.display = 'flex';
      const reminder = document.getElementById("survey-reminder");
      if (reminder) reminder.style.display = "none";
    });

    closeBtn.addEventListener('click', () => {
      dialog.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      const masalah = formData.getAll("masalah");

      try {
        await addDoc(collection(db, "surveyResponses"), {
          ...data,
          masalah,
          timestamp: new Date()
        });

        statusEl.textContent = 'Terima kasih atas waktu Anda!';
        statusEl.style.color = 'green';
        localStorage.setItem("surveySubmitted", "true");
        setTimeout(() => dialog.style.display = 'none', 2000);
        openBtn.style.display = 'none';
      } catch (e) {
        console.error("Survey submission failed", e);
        statusEl.textContent = 'Gagal mengirim. Coba lagi.';
        statusEl.style.color = 'red';
      }
    });

    if (localStorage.getItem("surveySubmitted") === "true") {
      openBtn.style.display = "none";
    } else {
      setTimeout(() => {
        const reminder = document.getElementById("survey-reminder");
        if (reminder) {
          reminder.style.display = "flex";
        }
      }, 5000);
    }
  })();