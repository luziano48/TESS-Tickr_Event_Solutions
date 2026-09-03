﻿// ---- DADOS ----
const heroSlides = [
  { img: "assets/hero-1.jpg", title: "Together Tour 2026", city: "São Paulo — 17 & 18 de Julho" },
  { img: "assets/hero-2.jpg", title: "Rock Festival", city: "Rio de Janeiro — 22 de Agosto" },
  { img: "assets/hero-3.jpg", title: "Neon Nights Festival", city: "Curitiba — 05 de Setembro" },
];


const authState = {
  key: "ticketa-auth",
  get() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  },
  set(user) {
    localStorage.setItem(this.key, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(this.key);
  }
};

let currentCategory = "all";

// ---- CARROSSEL DO HERO ----
let slide = 0;
let heroTimer = null;
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

function startHeroLoop() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = setInterval(() => {
    if (document.visibilityState === "visible") {
      slide = (slide + 1) % heroSlides.length;
      renderHero();
    }
  }, 6000);
}

function stopHeroLoop() {
  if (heroTimer) clearInterval(heroTimer);
  heroTimer = null;
}

document.getElementById("heroPrev").onclick = () => { slide = (slide - 1 + heroSlides.length) % heroSlides.length; renderHero(); startHeroLoop(); };
document.getElementById("heroNext").onclick = () => { slide = (slide + 1) % heroSlides.length; renderHero(); startHeroLoop(); };
dotsEl.addEventListener("click", (e) => {
  const b = e.target.closest("button[data-i]");
  if (!b) return;
  slide = Number(b.dataset.i);
  renderHero();
  startHeroLoop();
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopHeroLoop();
    return;
  }
  startHeroLoop();
});
renderHero();
startHeroLoop();

// ---- AUTENTICAÇÃO BÁSICA ----
const authModal = document.getElementById("authModal");
const authForm = document.getElementById("authForm");
const authError = document.getElementById("authError");
const authClose = document.getElementById("authClose");
const authButtons = document.querySelectorAll("[data-auth-button]");
const logoutButton = document.getElementById("logoutButton");

function setAuthError(message) {
  authError.textContent = message;
  authError.classList.toggle("hidden", !message);
}

function openAuthModal() {
  if (!authModal) return;
  authModal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeAuthModal() {
  if (!authModal) return;
  authModal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  setAuthError("");
  authForm?.reset();
}

function updateAuthUI() {
  const user = authState.get();
  const authButton = authButtons[0];

  if (!authButton) return;

  if (!user) {
    authButton.textContent = "Entrar";
    authButton.title = "Fazer login";
    authButton.classList.remove("is-authenticated");
    logoutButton?.classList.add("hidden");
    return;
  }

  const firstName = user.name.split(" ")[0] || "Usuário";
  authButton.textContent = `Olá, ${firstName}`;
  authButton.title = "Conta ativa";
  authButton.classList.add("is-authenticated");
  logoutButton?.classList.remove("hidden");
}

authButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const user = authState.get();
    if (user) {
      return;
    }
    openAuthModal();
  });
});

logoutButton?.addEventListener("click", () => {
  authState.clear();
  updateAuthUI();
});

authClose?.addEventListener("click", closeAuthModal);
authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});

authForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(authForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  if (!email || !email.includes("@") || password.length < 6) {
    setAuthError("Informe um e-mail válido e uma senha com pelo menos 6 caracteres.");
    return;
  }

  const user = {
    name: email.split("@")[0].replace(/[._-]/g, " ").trim() || "Visitante",
    email,
    isLogged: true,
    createdAt: new Date().toISOString()
  };

  authState.set(user);
  updateAuthUI();
  closeAuthModal();
});
updateAuthUI();

// ---- BUSCA DINÂMICA ----
const searchInput = document.getElementById("searchInput");
const citySelect = document.getElementById("citySelect");
const searchEmptyState = document.getElementById("searchEmptyState");
const searchWrap = document.querySelector(".search");
const categoryButtons = document.querySelectorAll(".cat");

const normalizeText = (value = "") =>
  value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

function showSearchLoading(isLoading) {
  if (!searchWrap) return;
  searchWrap.classList.toggle("is-loading", isLoading);
  const input = searchWrap.querySelector("input");
  if (input) input.setAttribute("aria-busy", String(isLoading));
}

function applySearchFilter() {
  const term = normalizeText(searchInput?.value || "");
  const cityValue = (citySelect?.value || "all").toLowerCase();
  const cards = document.querySelectorAll(".card-featured, .card-weekend");
  let visibleCount = 0;

  cards.forEach((card) => {
    const searchableText = normalizeText(card.dataset.search || card.textContent);
    const cityText = normalizeText(card.dataset.city || "");
    const categoryText = (card.dataset.category || "all").toLowerCase();
    const matchesText = !term || searchableText.includes(term);
    const matchesCity = cityValue === "all" || cityText.includes(cityValue);
    const matchesCategory = currentCategory === "all" || categoryText === currentCategory;
    const shouldShow = matchesText && matchesCity && matchesCategory;

    card.classList.toggle("hidden", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  if (searchEmptyState) {
    searchEmptyState.classList.toggle("hidden", visibleCount !== 0);
  }

  showSearchLoading(false);
}

function handleSearchChange() {
  showSearchLoading(true);
  clearTimeout(window.__ticketaSearchTimer);
  window.__ticketaSearchTimer = setTimeout(() => {
    applySearchFilter();
  }, 180);
}

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

  searchInput.addEventListener("input", handleSearchChange);
}

if (citySelect) {
  citySelect.addEventListener("change", handleSearchChange);
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    currentCategory = button.dataset.category || "all";
    categoryButtons.forEach((item) => item.classList.toggle("active", item === button));
    handleSearchChange();
  });
});

// ---- ATALHOS ----
const shortcuts = document.querySelectorAll(".shortcut");
const featuredSection = document.getElementById("featuredSection");
const weekendSection = document.getElementById("weekendSection");

if (shortcuts[0] && featuredSection) {
  shortcuts[0].addEventListener("click", () => {
    featuredSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (shortcuts[1] && weekendSection) {
  shortcuts[1].addEventListener("click", () => {
    weekendSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (shortcuts[2] && searchInput) {
  shortcuts[2].addEventListener("click", (event) => {
    event.preventDefault();
    searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => searchInput.focus(), 300);
  });
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
document.addEventListener("click", (event) => {
  const card = event.target.closest(".card-featured, .card-weekend");
  if (!card || card.classList.contains("hidden")) return;

  const title = card.querySelector("h3")?.textContent || "";
  const eventoId = eventosMap[title];
  if (eventoId) {
    event.preventDefault();
    window.location.href = `Event/index.html?id=${eventoId}`;
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

hamburgerButton?.addEventListener("click", openSidenav);
closeButton?.addEventListener("click", closeSidenav);
overlay?.addEventListener("click", closeSidenav);
