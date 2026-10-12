
// AKTIF ALARMLAR

let aktifAlarmlar = [];
let sonIlac = null;

/* ILAC GOSTER */

async function ilacGoster(isim) {

  const ilac =
    await firebaseIlacGetir(isim);
    console.log("ARAMA:", isim);
console.log("GELEN VERI:", ilac);
console.log("ANAHTARLAR:", Object.keys(ilac));
console.log("KULLANIM:", ilac.kullanim);
console.log("ACTOK:", ilac.acTok);
console.log("UYARI:", ilac.uyari);

  /* GECMIS */

  let gecmis =
    JSON.parse(
      localStorage.getItem(
        "ilacGecmisi"
      )
    ) || [];

  if (
    ilac &&
    !gecmis.includes(ilac.isim)
  ) {

    gecmis.push(ilac.isim);
  }

  localStorage.setItem(
    "ilacGecmisi",
    JSON.stringify(gecmis)
  );

  // SAYFALARI GIZLE

  document.getElementById(
    "anaSayfa"
  ).style.display = "none";

  document.getElementById(
    "alarmSayfasi"
  ).style.display = "none";

  document.getElementById(
    "profilSayfasi"
  ).style.display = "none";

  // ILAC DETAY

  document.getElementById(
    "ilacDetaySayfasi"
  ).style.display = "block";

  // ILAC YOK

  if (!ilac) {

    document.getElementById(
      "sonuc"
    ).innerHTML = `

      <div class="kart">

        <h2>
          ❌ İlaç bulunamadı
        </h2>

      </div>
    `;

    return;
  }
  console.log("SON ILAC:", sonIlac);
console.log("YENI ILAC:", ilac);
let etkilesimHTML = "";

if (
  sonIlac &&
  sonIlac.etkenMadde &&
  ilac.etkenMadde
) {

  const etkilesim =
    await firebaseEtkilesimGetir(
      sonIlac.etkenMadde,
      ilac.etkenMadde
    );
    console.log("ETKILESIM:", etkilesim);

  if (etkilesim) {

    etkilesimHTML = `

      <div class="kritik-uyari">

        <h3>
          🚨 ETKİLEŞİM UYARISI
        </h3>

        <p>

          <b>
            Risk Seviyesi:
          </b>

          ${etkilesim.seviye}

        </p>

        <p>
          ${etkilesim.uyari}
        </p>

      </div>
    `;
  }
}
  // ILAC KARTI

  document.getElementById(
    "sonuc"
  ).innerHTML = `
  
    <div class="ilac-detay-kart">

      <div class="ilac-header">

        <div class="ilac-icon">
          💊
        </div>

        <div>

          <h2>
            ${ilac.isim}
          </h2>

          <p>
            Akıllı İlaç Bilgisi
          </p>

        </div>

      </div>

      <div class="bilgi-box">

        <h3>
          🩺 Kullanım
        </h3>

        <p>
          ${ilac.kullanim}
        </p>

      </div>

      <div class="bilgi-box">

        <h3>
          🍽 Aç / Tok
        </h3>

        <p>
          ${ilac.acTok}
        </p>

      </div>

      <div class="uyari-box">

        <h3>
          ⚠ Uyarı
        </h3>

        <p>
          ${ilac.uyari}
        </p>

      </div>
      ${etkilesimHTML}

      <div class="alarm-baslik">

        ⏰ Alarm Seçenekleri

      </div>

      <button onclick="hazirAlarmKur('${ilac.isim}', 'Sabah 08:00')">
        ☀ Sabah Alarmı
      </button>

      <button onclick="hazirAlarmKur('${ilac.isim}', 'Öğle 13:00')">
        🌤 Öğle Alarmı
      </button>

      <button onclick="hazirAlarmKur('${ilac.isim}', 'Akşam 20:00')">
        🌙 Akşam Alarmı
      </button>

      <button onclick="manuelAlarmKur('${ilac.isim}')">
        ⌨ Manuel Saat Gir
      </button>

      <button onclick="sesliOku('${ilac.isim}')">
        🔊 Sesli Oku
      </button>

    </div>
  `;
  sonIlac = ilac;

}


/* HAZIR ALARM */

function hazirAlarmKur(ilac, saat) {

  aktifAlarmlar.push({
    ilac,
    saat
  });

  alert(
    ilac +
    " için " +
    saat +
    " alarmı kuruldu."
  );

  alarmListesiniGoster();

  yaklasanAlarmGoster();
}

/* MANUEL ALARM */

function manuelAlarmKur(ilac) {

  const saat = prompt(
    "Saat giriniz (Örnek: 22:15)"
  );

  if (!saat) return;

  aktifAlarmlar.push({
    ilac,
    saat
  });

  alert(
    ilac +
    " için " +
    saat +
    " alarmı oluşturuldu."
  );

  alarmListesiniGoster();

  yaklasanAlarmGoster();

  const kontrol = setInterval(() => {

    const now = new Date();

    const h = String(
      now.getHours()
    ).padStart(2, "0");

    const m = String(
      now.getMinutes()
    ).padStart(2, "0");

    const suan = `${h}:${m}`;

    if (suan === saat) {

      clearInterval(kontrol);

      const ses = new Audio(
        "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      );

      ses.play();

      const konusma =
        new SpeechSynthesisUtterance(
          ilac +
          " kullanım zamanı geldi"
        );

      konusma.lang = "tr-TR";

      speechSynthesis.speak(
        konusma
      );

      alert(
        "⏰ " +
        ilac +
        " zamanı geldi!"
      );
    }

  }, 1000);
}

/* YAKLASAN ALARM */

function yaklasanAlarmGoster() {

  if (
    aktifAlarmlar.length === 0
  ) return;

  const sonAlarm =
    aktifAlarmlar[
      aktifAlarmlar.length - 1
    ];

  document.getElementById(
    "yaklasanAlarmKart"
  ).style.display = "block";

  document.getElementById(
    "yaklasanAlarmText"
  ).innerHTML = `

    💊 ${sonAlarm.ilac}

    <br>

    ⏰ ${sonAlarm.saat}
  `;
}

/* ALARM LISTESI */

function alarmListesiniGoster() {

  let html =
    `<h3>📋 Aktif Alarmlar</h3>`;

  aktifAlarmlar.forEach((alarm, index) => {
    html += `

  <div class="kart">

    <p>
      🔔 ${alarm.ilac}
    </p>

    <p>
      ⏰ ${alarm.saat}
    </p>

    <button
      onclick="alarmSil(${index})"
      class="sil-btn"
    >
      ❌ Alarmı Sil
    </button>

  </div>
`;
  });

  document.getElementById(
    "alarmListesi"
  ).innerHTML = html;
}

/* SESLI OKU */

async function sesliOku(isim) {

  const ilac =
    await firebaseIlacGetir(isim);

  if (!ilac) return;

  const mesaj =
    ilac.isim + ". " +
    ilac.kullanim + ". " +
    ilac.acTok + ". " +
    ilac.uyari;

  const ses =
    new SpeechSynthesisUtterance(
      mesaj
    );

  ses.lang = "tr-TR";

  speechSynthesis.speak(ses);
}


/* QR */

function startQR() {

  const scanner =
    new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250
      }
    );

  scanner.render(function(decodedText) {

    const qr =
      decodedText
      .toLowerCase()
      .trim();

    ilacGoster(qr);
  });
}

/* SAYFA */

function sayfaGoster(sayfa) {

  document.getElementById(
    "anaSayfa"
  ).style.display = "none";

  document.getElementById(
    "alarmSayfasi"
  ).style.display = "none";

  document.getElementById(
    "profilSayfasi"
  ).style.display = "none";

  document.getElementById(
    "ilacDetaySayfasi"
  ).style.display = "none";

  if (sayfa === "ana") {

    document.getElementById(
      "anaSayfa"
    ).style.display = "block";
  }

  if (sayfa === "alarm") {

    document.getElementById(
      "alarmSayfasi"
    ).style.display = "block";

    alarmListesiniGoster();
  }

  if (sayfa === "profil") {

    document.getElementById(
      "profilSayfasi"
    ).style.display = "block";
  }
}

/* MENU */

function aktifMenuDegistir(secili) {

  const menuler =
    document.querySelectorAll(
      ".menu-item"
    );

  menuler.forEach(menu => {

    menu.classList.remove(
      "aktif-menu"
    );
  });

  secili.classList.add(
    "aktif-menu"
  );
}

/* LOGIN */

async function girisYap() {

  const kullaniciAdi =
    document.getElementById(
      "kullaniciAdi"
    ).value
    .toLowerCase()
    .trim();

  const sifre =
    document.getElementById(
      "sifre"
    ).value;

  const kullanici =
    await firebaseKullaniciGetir(
      kullaniciAdi
    );

  if (!kullanici) {

    alert(
      "Kullanıcı bulunamadı!"
    );

    return;
  }

  if (
    kullanici.sifre !== sifre
  ) {

    alert(
      "Şifre yanlış!"
    );

    return;
  }

  document.getElementById(
    "loginEkrani"
  ).style.display = "none";

  document.getElementById(
    "uygulama"
  ).style.display = "block";

  const gecmis =
    JSON.parse(
      localStorage.getItem(
        "ilacGecmisi"
      )
    ) || [];

  let gecmisHTML = "";

  gecmis.forEach(ilac => {

    gecmisHTML += `

      <div class="gecmis-ilac">
        💊 ${ilac}
      </div>
    `;
  });

  document.getElementById(
    "profilIsim"
  ).innerHTML = `

    <div class="profil-header">

      <div class="profil-avatar">
        👤
      </div>

      <h2>
        ${kullanici.isim}
      </h2>

    </div>

    <div class="profil-bilgi-kart">

      <span>
        🎂 Yaş
      </span>

      <b>
        ${kullanici.yas}
      </b>

    </div>

    <div class="profil-bilgi-kart">

      <span>
        ⚖ Kilo
      </span>

      <b>
        ${kullanici.kilo} KG
      </b>

    </div>

    <div class="profil-bilgi-kart">

      <span>
        📏 Boy
      </span>

      <b>
        ${kullanici.boy} CM
      </b>

    </div>

    <div class="profil-bilgi-kart">

      <span>
        🩺 Sağlık Durumu
      </span>

      <b>
        ${kullanici.hastalik}
      </b>

    </div>

    <div class="gecmis-box">

      <div
        class="gecmis-baslik"
        onclick="gecmisAcKapat()"
      >

        📋 Son Kullanılan İlaçlar

      </div>

      <div
        id="gecmisListe"
        style="display:none;"
      >

        ${gecmisHTML}

      </div>

    </div>
  `;

  startQR();
}

/* CIKIS */

function cikisYap() {

  location.reload();
}

/* DARK MODE */

function darkModeAcKapat() {

  document.body.classList.toggle(
    "dark-mode"
  );
}

/* YASLI MODU */

function yasliModuAcKapat() {

  document.body.classList.toggle(
    "yasli-mod"
  );
}

/* LOAD */

window.onload = function () {

  setTimeout(() => {

    document.getElementById(
      "splash"
    ).style.display = "none";

  }, 2500);
};

/* YENIDEN QR */

function yenidenQR() {

  document.getElementById(
    "ilacDetaySayfasi"
  ).style.display = "none";

  document.getElementById(
    "anaSayfa"
  ).style.display = "block";
}

/* SEARCH POPUP */

function aramaKutusuAc() {

  document.getElementById(
    "aramaPopup"
  ).style.display = "flex";
}

/* MANUEL ILAC ARA */

async function manuelIlacAra() {

  const ilac =
    document.getElementById(
      "manuelIlacInput"
    ).value
    .toLowerCase()
    .trim();

  document.getElementById(
    "aramaPopup"
  ).style.display = "none";

  await ilacGoster(ilac);
}

/* AYAR MENU */

function ayarMenuAcKapat() {

  const menu =
    document.getElementById(
      "ayarMenu"
    );

  if (
    menu.style.display === "none"
  ) {

    menu.style.display = "block";

  } else {

    menu.style.display = "none";
  }
}

/* GECMIS */

function gecmisAcKapat() {

  const liste =
    document.getElementById(
      "gecmisListe"
    );

  if (
    liste.style.display === "none"
  ) {

    liste.style.display = "block";

  } else {

    liste.style.display = "none";
  }
}
/* ALARM SIL */

function alarmSil(index) {

  aktifAlarmlar.splice(
    index,
    1
  );

  alarmListesiniGoster();

  if (
    aktifAlarmlar.length === 0
  ) {

    document.getElementById(
      "yaklasanAlarmKart"
    ).style.display = "none";
  }
}

