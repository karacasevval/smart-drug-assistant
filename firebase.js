// FIREBASE

import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIG

const firebaseConfig = {

  apiKey: "AIzaSyBKnT-a483chnkncEHwaoDwjYPeMKJMa1E",

  authDomain:
    "akilliilacasistani.firebaseapp.com",

  projectId:
    "akilliilacasistani",

  storageBucket:
    "akilliilacasistani.firebasestorage.app",

  messagingSenderId:
    "538102631200",

  appId:
    "1:538102631200:web:d2db0e5587ebf23921e545",

  measurementId:
    "G-Y5N9C47V25"
};

// INIT

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

/* ILAC GETIR */

window.firebaseIlacGetir =
async function(isim) {

  const ref =
    doc(db, "ilaclar", isim);

  const belge =
    await getDoc(ref);

  if (belge.exists()) {

    return belge.data();

  } else {

    return null;
  }
};

/* ETKILESIM GETIR */

window.firebaseEtkilesimGetir =
async function(madde1, madde2) {

  const belge1 =
    `${madde1.toLowerCase()}-${madde2.toLowerCase()}`
      .replaceAll(" ", "");
      console.log("BELGE1:", belge1);

  const belge2 =
    `${madde2.toLowerCase()}-${madde1.toLowerCase()}`
      .replaceAll(" ", "");
      console.log("BELGE2:", belge2);

  let ref =
    doc(db, "etkilesimler", belge1);

  let sonuc =
    await getDoc(ref);

  if (sonuc.exists()) {

    return sonuc.data();
  }

  ref =
    doc(db, "etkilesimler", belge2);

  sonuc =
    await getDoc(ref);

  if (sonuc.exists()) {

    return sonuc.data();
  }

  return null;
};

/* KULLANICI GETIR */

window.firebaseKullaniciGetir =
async function(kullaniciAdi) {

  const ref =
    doc(db, "kullanicilar", kullaniciAdi);

  const belge =
    await getDoc(ref);

  if (belge.exists()) {

    return belge.data();

  } else {

    return null;
  }
};
