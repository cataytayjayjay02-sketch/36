// EDIT THIS FILE. Photos go in a "photos" folder next to index.html.
const config = {
  intro: "I made something for you...\n36 tulips, 36 memories.",
  // Password gate. Set gate: null to remove it. (It is for fun, not real security.)
  gate: { question: "Anong kulay si Banana Boat?", answers: ["yellow"], hint: "", wrong: "Not quite, try again 💭" },
  music: ["music/song1.mp3", "music/song2.mp3"],   // plays in order, then repeats. Use [] for no music
  finalMessage: "That was all 36 of our memories.\nI love you.",
  finalQuestion: "Will you spend more years with me?",   // set to "" to skip
  yesMessage: "Here's to many more years together 💖"
};

const memories = [
  { photo: "photos/1.png", letter: "Unang Picture HAHAHA sanaol honorr" },
  { photo: "photos/2.png", letter: "Eto love unang punta sa tanawan after sa sumacab" },
  { photo: "photos/3.png", letter: "Graduation flowers" },
  { photo: "photos/4.png", letter: "eto yung pic na nakita nila charr. with mimi and friends" },
  { photo: "photos/5.png", letter: "debut ng taga tapat nyo me jabi" },
  { photo: "photos/6.png", letter: "motmot sa better coffe" },
  { photo: "photos/7.png", letter: "kala mimi to nung me perya" },
  { photo: "photos/8.png", letter: "practice ng sayaww sa school yung naka gown ka na blue" },
  { photo: "photos/9.png", letter: "mask on pic muna bago sumayaw" },
  { photo: "photos/10.png", letter: "fiestaa HAHAH tinakbo ko mula simbahan hangang 711" },
  { photo: "photos/11.png", letter: "xmas party ata to " },
  { photo: "photos/12.png", letter: "eto intrams sa bago building HAHA me matcha panga tyo dito" },
  { photo: "photos/13.png", letter: "eto sa mantama to feel ko" },
  { photo: "photos/14.png", letter: "pogi ko dito HAHHAAHA room gaming" },
  { photo: "photos/15.png", letter: "pinaka maganda ft me bahog" },
  { photo: "photos/16.png", letter: "sa practice din to ng sayaw " },
  { photo: "photos/17.png", letter: "HAHAH " },
  { photo: "photos/18.png", letter: "event sa sempol yung gagayahin mga gods and goddess" },
  { photo: "photos/19.png", letter: "eto sinend mo saken " },
  { photo: "photos/20.png", letter: "first photo booth" },
  { photo: "photos/21.png", letter: "sa room din to sa malapit sa gym" },
  { photo: "photos/22.png", letter: "HAHA motmot sa kapetonio first time" },
  { photo: "photos/23.png", letter: "bonsai legal na " },
  { photo: "photos/24.png", letter: "happy bday ate via" },
  { photo: "photos/25.png", letter: "baguio cutiee" },
  { photo: "photos/26.png", letter: "wake up like this sa benguet " },
  { photo: "photos/27.png", letter: "bumili ako shoes" },
  { photo: "photos/28.png", letter: "syempre with jonjon" },
  { photo: "photos/29.png", letter: "with baby jay" },
  { photo: "photos/30.png", letter: "jabi cabiao after inasal kase umuulan HAHHA" },
  { photo: "photos/31.png", letter: "Best PIC" },
  { photo: "photos/32.png", letter: "Mantama gala " },
  { photo: "photos/33.jpg", letter: "Gandaa" },
  { photo: "photos/34.jpg", letter: "HAHHA solo at the balcony" },
  { photo: "photos/35.jpg", letter: "salamat poo sa libre" },
  { photo: "photos/36.jpg", letter: "samg sa san antonio " }
];
