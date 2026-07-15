// ---- DADOS ----
const heroSlides = [
  { img: "assets/hero-1.jpg", title: "Together Tour 2026", city: "São Paulo — 17 & 18 de Julho" },
  { img: "assets/hero-2.jpg", title: "Rock Festival", city: "Rio de Janeiro — 22 de Agosto" },
  { img: "assets/hero-3.jpg", title: "Neon Nights Festival", city: "Curitiba — 05 de Setembro" },
];

const featured = [
  { img: "assets/event-park.jpg", count: 1152, title: "Parque Aventura Verão", place: "Parque Central • SP" },
  { img: "assets/event-acoustic.jpg", count: 330, title: "Registro Acústico — Vitor Melo", place: "Teatro Bravo • RJ" },
  { img: "assets/event-cake.jpg", count: 58, title: "Cake Cup — Festival de Doces", place: "Expo Center • BH" },
  { img: "assets/event-metal.jpg", count: 359, title: "Bestas de Ferro — Turnê Nacional", place: "Arena Sul • POA" },
  { img: "assets/event-kpop.jpg", count: 598, title: "SEVN World Tour", place: "Allianz Parque • SP" },
];

const weekend = [
  { img: "assets/event-theatre.jpg", title: "Musical: Luzes da Cidade", date: "SÁB 18 JUL", place: "Teatro Real • SP", price: "R$ 90" },
  { img: "assets/event-comedy.jpg", title: "Noite do Riso", date: "SEX 17 JUL", place: "Comedy Club • SP", price: "R$ 60" },
  { img: "assets/event-park.jpg", title: "Feira Gastronômica", date: "DOM 19 JUL", place: "Parque das Nações • SP", price: "Grátis" },
  { img: "assets/event-cake.jpg", title: "Festival do Doce", date: "SÁB 18 JUL", place: "Expo Center • BH", price: "R$ 45" },
];

// ---- CARROSSEL DO HERO ----
let slide = 0;
const slideEl = document.getElementById("heroSlide");
const titleEl = document.getElementById("heroTitle");
const cityEl = document.getElementById("heroCity");
const dotsEl = document.getElementById("heroDots");

function renderHero() {
  const s = heroSlides[slide];
  slideEl.style.backgroundImage = `url('${s.img}')`;
  titleEl.textContent = s.title;
  cityEl.textContent = s.city;
  dotsEl.innerHTML = heroSlides.map((_, i) =>
    `<button class="${i === slide ? "active" : ""}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`
  ).join("");
}

document.getElementById("heroPrev").onclick = () => { slide = (slide - 1 + heroSlides.length) % heroSlides.length; renderHero(); };
document.getElementById("heroNext").onclick = () => { slide = (slide + 1) % heroSlides.length; renderHero(); };
dotsEl.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-i]");
  if (!b) return;
  slide = Number(b.dataset.i);
  renderHero();
});
setInterval(() => { slide = (slide + 1) % heroSlides.length; renderHero(); }, 6000);
renderHero();

// ---- BUSCA ----
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("focus", () => {
    searchInput.parentElement.style.borderColor = "var(--brand)";
    searchInput.parentElement.style.background = "#fff";
    searchInput.parentElement.style.boxShadow = "0 0 0 3px var(--brand-soft)";
  });
  searchInput.addEventListener("blur", () => {
    searchInput.parentElement.style.borderColor = "var(--border)";
    searchInput.parentElement.style.background = "#f5f6fa";
    searchInput.parentElement.style.boxShadow = "none";
  });
  
  // Atalho "Faça sua busca"
  const shortcuts = document.querySelectorAll(".shortcut");
  if (shortcuts[2]) {
    shortcuts[2].addEventListener("click", (e) => {
      e.preventDefault();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => searchInput.focus(), 300);
    });
  }
}

// ---- EM DESTAQUE ----
document.getElementById("featuredGrid").innerHTML = featured.map(e => `
  <a class="card-featured" href="#">
    <div class="thumb">
      <img src="${e.img}" alt="${e.title}" loading="lazy" />
      <span class="badge">🎟 ${e.count}</span>
    </div>
    <h3>${e.title}</h3>
    <p>${e.place}</p>
  </a>
`).join("");

// ---- FIM DE SEMANA ----
document.getElementById("weekendGrid").innerHTML = weekend.map(w => `
  <article class="card-weekend">
    <div class="thumb">
      <img src="${w.img}" alt="${w.title}" loading="lazy" />
      <span class="date-tag">${w.date}</span>
    </div>
    <div class="body">
      <h3>${w.title}</h3>
      <p class="muted-text" style="margin-top:4px">${w.place}</p>
      <div class="row">
        <span class="price">${w.price}</span>
        <button class="buy">Comprar</button>
      </div>
    </div>
  </article>
`).join("");

// ---- LIVE SEARCH ----
if (searchInput) {
  let searchTimeout;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) return;
    
    searchTimeout = setTimeout(() => {
      const results = featured.filter(f => 
        f.title.toLowerCase().includes(query) || f.place.toLowerCase().includes(query)
      );
      console.log(`Busca: "${query}" → ${results.length} resultados`);
    }, 300);
  });
}

// ---- EVENT DELEGATION: Cards ----
document.addEventListener("click", (e) => {
  const buyBtn = e.target.closest(".buy");
  if (buyBtn) {
    e.preventDefault();
    const card = buyBtn.closest(".card-weekend");
    if (card) {
      const title = card.querySelector("h3")?.textContent || "Evento";
      console.log(`Comprar: ${title}`);
    }
  }
});