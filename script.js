const NS = "http://www.w3.org/2000/svg";

const leavesG = $("leaves");
const stemNodes = [];
const stemsG = $("stems");
const tulipsG = $("tulips");
const modal = $("modal");

const STORE = "tulip-bouquet-done-v2";
const done = new Set();        // tulips that were opened and have disappeared
let pending = null;            // tulip whose memory is open right now

function el(name, attrs = {}, parent) {
  const node = document.createElementNS(NS, name);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(node);
  return node;
}

/* ---------- Colour palettes: a = side petals, b = back petal, c = front petal ---------- */
const PALETTES = [
  { a: "#f06c9b", b: "#c93a74", c: "#f9a3c0" }, // pink
  { a: "#e4363f", b: "#a31526", c: "#f26b5e" }, // red
  { a: "#ffd23f", b: "#f0a300", c: "#ffe88a" }, // yellow
  { a: "#a96fd6", b: "#6f3a9e", c: "#cfa4ee" }, // purple
  { a: "#ff8c4a", b: "#e0562a", c: "#ffb987" }  // orange
];

const MOODS = { sweet: 0, romantic: 1, funny: 2, special: 3, adventure: 4 };

/* ---------- Build one coloured symbol per palette (no CSS-variable tricks) ---------- */
const tpl = $("tulip-template");
PALETTES.forEach((p, k) => {
  const sym = tpl.cloneNode(true);
  sym.setAttribute("id", `tulip-${k}`);
  sym.querySelectorAll("[style]").forEach((n) => {
    n.setAttribute("style", n.getAttribute("style").replace(/var\(--(a|b|c)\)/g, (_, key) => p[key]));
  });
  tpl.parentNode.appendChild(sym);
});

/* ---------- Layout: dome-shaped bouquet using a sunflower spiral ---------- */
const CX = 50, CY = 35, RX = 34, RY = 26, GOLDEN = 2.39996;
const BASE = { x: 50, y: 100 };           // where all stems meet (inside the wrap)

const positions = memories.map((_, i) => {
  const t = Math.sqrt((i + 0.5) / memories.length);
  const a = i * GOLDEN;
  return { i, x: CX + RX * t * Math.cos(a), y: CY + RY * t * Math.sin(a) };
});

/* ---------- Long tulip leaves fanning out from the base ---------- */
const leafAngles = [-62, -48, -34, -20, -8, 8, 20, 34, 48, 62];
leafAngles.forEach((deg, k) => {
  const len = 0.82 + (k % 3) * 0.1;
  const flip = deg < 0 ? -1 : 1;
  const g = el("g", {
    class: "leaf",
    transform: `translate(${BASE.x} ${BASE.y - 6}) rotate(${deg}) scale(${flip * len} ${len})`
  }, leavesG);
  el("path", { d: "M0 0 C-5 -22 -3 -44 9 -58 C5 -40 5 -20 1 0 Z", fill: "url(#leaf)" }, g);
  el("path", { d: "M0 0 C-2 -20 0 -40 9 -58", fill: "none", stroke: "#21532d", "stroke-width": ".4", opacity: ".5" }, g);
});

/* ---------- Stems ---------- */
positions.forEach(({ i, x, y }) => {
  const top = y + 6;                       // stem starts under the flower head
  stemNodes[i] = el("path", {
    d: `M${x} ${top} Q${x + (BASE.x - x) * 0.15} ${(top + BASE.y) / 2} ${BASE.x} ${BASE.y}`,
    stroke: "#3b8a4a", "stroke-width": ".9", fill: "none", "stroke-linecap": "round"
  }, stemsG);
});

/* ---------- Tulips (back to front so lower ones overlap upper ones) ---------- */
const tulipNodes = new Array(memories.length);
const order = [];            // draw order, so tulips return to the same layering

[...positions].sort((a, b) => a.y - b.y).forEach(({ i, x, y }) => {
  const w = 10.5 + (i % 3) * 0.5;
  const h = w * 1.3;
  const mood = memories[i].mood;
  const k = mood in MOODS ? MOODS[mood] : (i * 3 + (i >> 2)) % PALETTES.length;
  const tilt = (x - 50) * 0.45 + ((i * 13) % 7 - 3);   // lean outward a little

  const g = el("g", {
    class: "tulip", tabindex: "0", role: "button", "aria-label": `Open memory ${i + 1}`
  }, tulipsG);

  el("use", {
    href: `#tulip-${k}`,
    x: x - w / 2, y: y - h / 2, width: w, height: h,
    transform: `rotate(${tilt} ${x} ${y + h / 2})`
  }, g);

  g.addEventListener("click", () => openMemory(i));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openMemory(i); }
  });
  g.style.setProperty("--d", (Math.random() * 0.9).toFixed(2) + "s");
  tulipNodes[i] = g;
  order.push(i);
});

/* ---------- Disappearing tulips ---------- */
try {
  JSON.parse(localStorage.getItem(STORE) || "[]").forEach((n) => {
    if (n >= 0 && n < memories.length) done.add(n);
  });
} catch (e) { /* storage unavailable: start fresh */ }

function save() {
  try { localStorage.setItem(STORE, JSON.stringify([...done])); } catch (e) {}
}

function removeNow(i) {
  tulipNodes[i].remove();
  stemNodes[i].remove();
}

function vanish(i) {
  petalBurst(tulipNodes[i]);
  tulipNodes[i].classList.add("vanish");
  stemNodes[i].classList.add("vanish");
  setTimeout(() => removeNow(i), 800);
}

done.forEach(removeNow);        // tulips opened in an earlier visit stay gone

/* After she says Yes: all 36 tulips bloom back into the bouquet */
function restoreBouquet() {
  done.clear();
  save();
  stemNodes.forEach((st) => { st.classList.remove("vanish"); stemsG.appendChild(st); });
  order.forEach((i) => {
    const t = tulipNodes[i];
    t.classList.remove("vanish");
    t.style.setProperty("--d", (Math.random() * 1.2).toFixed(2) + "s");
    tulipsG.appendChild(t);
  });
  const b = $("bouquet");
  b.classList.remove("bloom");
  void b.getBoundingClientRect();   // restart the bloom animation
  b.classList.add("bloom");
  updateCount();
}

function updateCount() {
  const left = memories.length - done.size;
  $("count").textContent = left > 0 ? `${left} tulip${left === 1 ? "" : "s"} left` : "";
  if (left === 0 && started) finale();
}

/* ---------- Modal ---------- */
function openMemory(i) {
  if (done.has(i)) return;
  pending = i;
  const m = memories[i];

  const img = $("photo");
  img.src = m.photo;
  img.alt = m.title;
  $("caption").textContent = m.caption || "";
  $("title").textContent = m.title;
  $("date").textContent = m.date || "";
  skipType = type($("letter"), m.letter, 28);
  renderExtra(m);

  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  skipType();
  $("extra").innerHTML = "";
  if (pending === null) return;
  const i = pending;
  pending = null;
  done.add(i);                  // the tulip disappears once she has read it
  save();
  vanish(i);
  updateCount();
}

$("close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

updateCount();
