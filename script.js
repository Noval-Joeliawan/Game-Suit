// Statistik Pertandingan Keseluruhan
let scorePlayer = 0;
let scoreComputer = 0;

// Status Battle Ronde Saat Ini
let hpPlayer = 100;
let hpComputer = 100;
let rageEnergy = 0;
let isMatchOver = false;

const choices = document.querySelectorAll(".choice");
const message = document.getElementById("message");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const playerIcon = document.getElementById("playerIcon");
const computerIcon = document.getElementById("computerIcon");
const playerScore = document.getElementById("scorePlayer");
const computerScore = document.getElementById("scoreComputer");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("result");

// Elemen HUD Baru (HP & Ultimate)
const hpPlayerBar = document.getElementById("hpPlayerBar");
const hpComputerBar = document.getElementById("hpComputerBar");
const hpPlayerText = document.getElementById("hpPlayerText");
const hpComputerText = document.getElementById("hpComputerText");
const rageBar = document.getElementById("rageBar");
const rageText = document.getElementById("rageText");
const ultBtn = document.getElementById("ultBtn");
const playerFrame = document.getElementById("playerFrame");
const cpuFrame = document.getElementById("cpuFrame");

const icons = {
  batu: "🪨",
  gunting: "✂️",
  kertas: "📄",
  naga: "🐉",
};

// Fungsi Acak Pilihan Komputer
function getComputerChoice() {
  const random = Math.random();
  if (random < 0.34) return "batu";
  if (random < 0.67) return "gunting";
  return "kertas";
}

// Fungsi Update Tampilan Bar HP & Rage
function updateBattleHUD() {
  hpPlayer = Math.max(0, hpPlayer);
  hpComputer = Math.max(0, hpComputer);
  rageEnergy = Math.min(100, rageEnergy);

  hpPlayerBar.style.width = hpPlayer + "%";
  hpComputerBar.style.width = hpComputer + "%";
  hpPlayerText.textContent = hpPlayer;
  hpComputerText.textContent = hpComputer;

  // Warna merah saat HP kritis (<= 30 HP)
  hpPlayerBar.classList.toggle("hp-low", hpPlayer <= 30);
  hpComputerBar.classList.toggle("hp-low", hpComputer <= 30);

  // Update Bar Rage / Ultimate
  rageBar.style.width = rageEnergy + "%";
  rageText.textContent = rageEnergy + "%";

  if (rageEnergy >= 100 && !isMatchOver) {
    ultBtn.disabled = false;
    ultBtn.classList.add("ult-ready");
    ultBtn.textContent = "🔥 LEPASKAN JURUS NAGA (40 DMG!) 🔥";
  } else {
    ultBtn.disabled = true;
    ultBtn.classList.remove("ult-ready");
    ultBtn.textContent = `🐉 JURUS NAGA (TERKUNCI - ${rageEnergy}/100%)`;
  }
}

// Fungsi Cek K.O. (Akhir Pertandingan)
function checkKnockout() {
  if (hpComputer <= 0) {
    isMatchOver = true;
    scorePlayer++;
    playerScore.textContent = scorePlayer;
    resultTitle.textContent = "K.O. VICTORY!";
    resultTitle.className = "status-win";
    message.textContent = "🏆 LUAR BIASA! Master CPU Tumbang!";
    setButtonsDisabled(true);
    updateBattleHUD();
  } else if (hpPlayer <= 0) {
    isMatchOver = true;
    scoreComputer++;
    computerScore.textContent = scoreComputer;
    resultTitle.textContent = "DEFEAT!";
    resultTitle.className = "status-lose";
    message.textContent =
      "💀 KAMU TUMBANG! Tekan Ronde Baru untuk Balas Dendam!";
    setButtonsDisabled(true);
    updateBattleHUD();
  }
}

function setButtonsDisabled(disabled) {
  choices.forEach((btn) => {
    btn.disabled = disabled;
  });
  if (disabled) {
    ultBtn.disabled = true;
    ultBtn.classList.remove("ult-ready");
  }
}

// Event Klik Senjata Normal (Batu / Gunting / Kertas)
choices.forEach((button) => {
  button.addEventListener("click", () => {
    if (isMatchOver) return;

    const player = button.dataset.choice;
    const komputer = getComputerChoice();
    let hasil;

    if (player === komputer) {
      hasil = "SERI!";
    } else if (player === "batu") {
      hasil = komputer === "gunting" ? "MENANG!" : "KALAH!";
    } else if (player === "gunting") {
      hasil = komputer === "batu" ? "KALAH!" : "MENANG!";
    } else {
      hasil = komputer === "batu" ? "MENANG!" : "KALAH!";
    }

    resultTitle.className = "";
    playerFrame.classList.remove("hit-damage");
    cpuFrame.classList.remove("hit-damage");

    if (hasil === "MENANG!") {
      hpComputer -= 20;
      rageEnergy += 35;
      message.textContent = "🔥 Serangan Masuk! Lawan terkena -20 HP!";
      resultTitle.classList.add("status-win");
      cpuFrame.classList.add("hit-damage");
    } else if (hasil === "KALAH!") {
      hpPlayer -= 20;
      rageEnergy += 40; // Saat terkena pukul, energi amarah naik lebih cepat!
      message.textContent = "💥 Pertahanan Jebol! Kamu terkena -20 HP!";
      resultTitle.classList.add("status-lose");
      playerFrame.classList.add("hit-damage");
    } else {
      rageEnergy += 20;
      message.textContent = "⚡ Tangkisan Sempurna! Energi bertambah +20%";
      resultTitle.classList.add("status-draw");
    }

    playerIcon.textContent = icons[player];
    computerIcon.textContent = icons[komputer];

    resultTitle.textContent = hasil;
    resultDescription.textContent =
      player.charAt(0).toUpperCase() +
      player.slice(1) +
      " vs " +
      komputer.charAt(0).toUpperCase() +
      komputer.slice(1);

    triggerClashAnim();
    updateBattleHUD();
    checkKnockout();
  });
});

// Event Klik Tombol Jurus Ultimate (Pasti Menang & 40 Damage)
ultBtn.addEventListener("click", () => {
  if (isMatchOver || rageEnergy < 100) return;

  const komputer = getComputerChoice();
  rageEnergy = 0; // Kosongkan energi setelah dipakai
  hpComputer -= 40; // Damage ganda!

  playerFrame.classList.remove("hit-damage");
  cpuFrame.classList.add("hit-damage");

  playerIcon.textContent = icons.naga;
  computerIcon.textContent = icons[komputer];

  resultTitle.className = "status-win";
  resultTitle.textContent = "ULTIMATE HIT!";
  resultDescription.textContent = `Jurus Naga vs ${komputer.charAt(0).toUpperCase() + komputer.slice(1)} (-40 HP!)`;
  message.textContent =
    "🐉 SERANGAN NAGA TELAK! Pertahanan CPU Hancur (-40 HP)!";

  triggerClashAnim();
  updateBattleHUD();
  checkKnockout();
});

function triggerClashAnim() {
  resultBox.classList.remove("clash-anim");
  void resultBox.offsetWidth;
  resultBox.classList.add("clash-anim");
}

// Tombol Reset Pertandingan (Pulihkan HP ke 100)
resetBtn.addEventListener("click", () => {
  hpPlayer = 100;
  hpComputer = 100;
  rageEnergy = 0;
  isMatchOver = false;

  playerFrame.classList.remove("hit-damage");
  cpuFrame.classList.remove("hit-damage");

  playerIcon.textContent = "❔";
  computerIcon.textContent = "❔";

  resultTitle.textContent = "READY";
  resultTitle.className = "status-idle";
  resultDescription.textContent = "100 HP Battle";
  message.textContent = "Pilih senjatamu untuk menyerang!";

  setButtonsDisabled(false);
  updateBattleHUD();
});
