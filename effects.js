/* Effects: falling petals, typewriter, music, intro + gate, finale */
const $ = (id) => document.getElementById(id);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const PETAL_COLORS = ["#f06c9b", "#e4363f", "#ffd23f", "#a96fd6", "#ff8c4a"];
let started = false, skipType = () => {}, typer;

function petal(x, y, color, drift, fall, dur) {
  const d = document.createElement("div");
  d.className = "petal";
  d.style.cssText = `left:${x}px;top:${y}px;background:${color};--dx:${(Math.random() - .5) * drift * 2}px;` +
    `--dy:${fall}px;--r:${Math.random() * 540 - 270}deg;animation-duration:${dur}ms`;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), dur);
}
function petalBurst(node) {
  const r = node.getBoundingClientRect();
  for (let n = 0; n < 9; n++)
    setTimeout(() => petal(r.left + r.width / 2, r.top + r.height / 3, pick(PETAL_COLORS), 50, 140 + Math.random() * 80, 1800 + Math.random() * 900), n * 50);
}
function shower(count) {
  for (let n = 0; n < count; n++)
    setTimeout(() => petal(Math.random() * innerWidth, -12, pick(PETAL_COLORS), 80, innerHeight + 30, 3500 + Math.random() * 2500), n * 70);
}

/* Typewriter: returns a function that skips to the end (tap the letter) */
function type(el, text, speed, done) {
  clearInterval(typer);
  el.textContent = "";
  let n = 0, fin = false;
  const end = () => { if (fin) return; fin = true; clearInterval(typer); el.textContent = text; if (done) done(); };
  typer = setInterval(() => { el.textContent = text.slice(0, ++n); if (n >= text.length) end(); }, speed);
  return end;
}
$("letter").addEventListener("click", () => skipType());

/* Hidden surprises inside a memory card */
function renderExtra(m) {
  const box = $("extra");
  box.innerHTML = "";
  if (m.audio) { const a = document.createElement("audio"); a.controls = true; a.src = m.audio; box.append(a); }
  if (m.video) { const v = document.createElement("video"); v.controls = true; v.playsInline = true; v.src = m.video; box.append(v); }
  if (m.coupon) { const c = document.createElement("div"); c.className = "coupon"; c.textContent = "🎟 " + m.coupon; box.append(c); }
}

/* Music */
const tracks = [].concat(config.music || []);
let track = 0;
const audio = tracks.length ? new Audio(tracks[0]) : null;
if (audio) audio.addEventListener("ended", () => {      // next song, loop back after the last
  track = (track + 1) % tracks.length;
  audio.src = tracks[track];
  audio.play().catch(() => {});
});
$("mute").addEventListener("click", () => {
  if (audio.paused) { audio.play().catch(() => {}); $("mute").textContent = "🔊"; }
  else { audio.pause(); $("mute").textContent = "🔇"; }
});

/* Intro + password gate */
const gate = config.gate;
$("introText").textContent = config.intro;
if (gate) { $("gateWrap").hidden = false; $("gateQ").textContent = gate.question; $("gateHint").textContent = gate.hint || ""; }

function sparkle() {
  const live = tulipNodes.filter((_, i) => !done.has(i));
  if (!live.length) return;
  const t = pick(live);
  t.classList.add("spark");
  setTimeout(() => t.classList.remove("spark"), 900);
}

function startShow() {
  if (gate) {
    const v = $("gateIn").value.trim().toLowerCase();
    if (!gate.answers.some((a) => a.toLowerCase() === v)) {
      const b = $("introBox");
      b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake");
      $("gateHint").textContent = gate.wrong || "Try again";
      return;
    }
  }
  started = true;
  $("intro").classList.add("hide");
  $("bouquet").classList.add("bloom");
  if (audio) { audio.play().catch(() => {}); $("mute").hidden = false; }
  setInterval(() => petal(Math.random() * innerWidth, -12, pick(PETAL_COLORS), 40, innerHeight + 30, 8000), 1400);
  setInterval(sparkle, 1500);
  updateCount();
}
$("start").addEventListener("click", startShow);
$("gateIn").addEventListener("keydown", (e) => { if (e.key === "Enter") startShow(); });

/* Ending: petal shower, typed message, and a question with a shy "No" */
function finale() {
  const box = $("ending");
  if (!box.hidden) return;
  $("ask").hidden = true;
  $("no").style.transform = "";
  box.hidden = false;                       // appears in the centre of the screen
  shower(70);
  type($("final"), config.finalMessage, 60, () => {
    if (config.finalQuestion) { $("askText").textContent = config.finalQuestion; $("ask").hidden = false; }
  });
}
$("yes").addEventListener("click", () => {
  $("ask").hidden = true;
  $("final").textContent = config.yesMessage;
  shower(120);
  setTimeout(() => {                        // the card slides down, the tulips come back
    const box = $("ending");
    box.classList.add("down");
    restoreBouquet();
    setTimeout(() => { box.hidden = true; box.classList.remove("down"); }, 1000);
  }, 2200);
});
const dodge = () => { $("no").style.transform = `translate(${(Math.random() - .5) * 160}px, ${(Math.random() - .5) * 90}px)`; };
$("no").addEventListener("mouseover", dodge);
$("no").addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); });
