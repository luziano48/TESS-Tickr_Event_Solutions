// ---- DADOS ----
const heroSlides = [
  { img: "assets/hero-1.jpg", title: "Together Tour 2026", city: "São Paulo — 17 & 18 de Julho" },
  { img: "assets/hero-2.jpg", title: "Rock Festival", city: "Rio de Janeiro — 22 de Agosto" },
  { img: "assets/hero-3.jpg", title: "Neon Nights Festival", city: "Curitiba — 05 de Setembro" },
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
    searchInput.parentElement.style.borderColor = "#03624c";
    searchInput.parentElement.style.background = "#fff";
    searchInput.parentElement.style.boxShadow = "0 0 0 3px #d2ebe5";
  });
  searchInput.addEventListener("blur", () => {
    searchInput.parentElement.style.borderColor = "#d2ebe5";
    searchInput.parentElement.style.background = "#fafbfc";
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