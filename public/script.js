let ducks = parseInt(localStorage.getItem("ducks")) || 0;
let dps = parseInt(localStorage.getItem("dps")) || 0;
let clickPower = parseInt(localStorage.getItem("clickPower")) || 1;

const countEl = document.getElementById("count");
const dpsEl = document.getElementById("dps");
const cpEl = document.getElementById("cp");
const shopEl = document.getElementById("shop");
const leaderboardEl = document.getElementById("leaderboard");
const clicker = document.getElementById("clicker");

const upgrades = [
  { name: "Tiny Rubber Duck", cost: 50, value: 1, type: "dps" },
  { name: "Duck Pond", cost: 200, value: 5, type: "dps" },
  { name: "Duck Factory", cost: 1000, value: 20, type: "dps" },
  { name: "Golden Beak", cost: 150, value: 1, type: "click" },
  { name: "Rubber Duck Kung Fu", cost: 600, value: 3, type: "click" },
];

function updateDisplay() {
  countEl.textContent = ducks;
  dpsEl.textContent = dps;
  cpEl.textContent = clickPower;
  localStorage.setItem("ducks", ducks);
  localStorage.setItem("dps", dps);
  localStorage.setItem("clickPower", clickPower);
}

function buildShop() {
  shopEl.innerHTML = "";
  upgrades.forEach((upg) => {
    const btn = document.createElement("button");
    const label =
      upg.type === "dps"
        ? `(+${upg.value} DPS)`
        : `(+${upg.value} Click Power)`;
    btn.textContent = `${upg.name} - ${upg.cost} ducks ${label}`;
    btn.onclick = () => {
      if (ducks >= upg.cost) {
        ducks -= upg.cost;
        if (upg.type === "dps") dps += upg.value;
        else clickPower += upg.value;
        updateDisplay();
      }
    };
    shopEl.appendChild(btn);
  });
}

clicker.onclick = () => {
  ducks += clickPower;
  updateDisplay();
};

setInterval(() => {
  ducks += dps;
  updateDisplay();
}, 1000);

async function loadLeaderboard() {
  const res = await fetch("/api/leaderboard");
  const data = await res.json();
  leaderboardEl.innerHTML = data
    .map((entry) => `<li>${entry.name}: ${entry.score}</li>`)
    .join("");
}

document.getElementById("score-form").onsubmit = async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  await fetch("/api/leaderboard", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, score: ducks }),
  });
  loadLeaderboard();
};

buildShop();
updateDisplay();
loadLeaderboard();
