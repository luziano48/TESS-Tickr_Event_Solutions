﻿// ---- DADOS ----
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

  // ---- ATALHOS ----
  const shortcuts = document.querySelectorAll(".shortcut");
  const featuredSection = document.getElementById("featuredSection");
  const weekendSection = document.getElementById("weekendSection");

  // Atalho "Eventos à horas" -> Rola para a seção de destaques
  if (shortcuts[0] && featuredSection) {
    shortcuts[0].addEventListener("click", () => {
      featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Atalho "Neste fim de semana" -> Rola para a seção do fim de semana
  if (shortcuts[1] && weekendSection) {
    shortcuts[1].addEventListener("click", () => {
      weekendSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // Atalho "Faça sua busca" -> Foca na barra de pesquisa
  if (shortcuts[2] && searchInput) {
    shortcuts[2].addEventListener("click", (e) => {
      e.preventDefault();
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => searchInput.focus(), 300);
    });
  }
}


// ---- DADOS DOS EVENTOS ----
const eventosMap = {
  "O SANCLÉ": "osancle",
  "Registro Acústico — Vitor Melo": "registro-acustico",
  "La casa de papel": "la-casa-de-papel",
  "Baile dos finalistas": "baile-finalistas",
  "FORÚM-JUVENIL": "forum-juvenil"
};

// ---- EVENT DELEGATION: Cards ----
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card-featured, .card-weekend");
  if (card) {
    e.preventDefault();
    const title = card.querySelector("h3")?.textContent || "";
    const eventoId = eventosMap[title];
    if (eventoId) {
      window.location.href = `Event/index.html?id=${eventoId}`;
    }
  }
});

// ---- SIDENAV ----
const hamburgerButton = document.getElementById("hamburger-button");
const closeButton = document.getElementById("close-button");
const sidenav = document.getElementById("sidenav");
const overlay = document.getElementById("overlay");

function openSidenav() {
  sidenav.classList.add("open");
  overlay.classList.add("open");
  document.body.classList.add("sidenav-open");
}

function closeSidenav() {
  sidenav.classList.remove("open");
  overlay.classList.remove("open");
  document.body.classList.remove("sidenav-open");
}

hamburgerButton.addEventListener("click", openSidenav);
closeButton.addEventListener("click", closeSidenav);
overlay.addEventListener("click", closeSidenav);