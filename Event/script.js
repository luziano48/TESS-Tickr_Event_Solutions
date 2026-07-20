(function () {
  const UNIT_PRICE = 200;

  const $ = (id) => document.getElementById(id);
  const modal = $("modal");
  const form = $("buy-form");
  const success = $("success");
  const qtyEl = $("qty");
  const totalEl = $("total");

  let qty = 1;

  const fmt = (n) =>
    "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const renderTotal = () => {
    qtyEl.textContent = qty;
    totalEl.textContent = fmt(UNIT_PRICE * qty);
  };

  const open = () => {
    form.classList.remove("hidden");
    success.classList.add("hidden");
    $("modal-title").textContent = "Comprar ingresso";
    modal.classList.remove("hidden");
    document.body.classList.add("modal-open");
  };
  const close = () => {
    modal.classList.add("hidden");
    document.body.classList.remove("modal-open");
  };

  $("open-btn").addEventListener("click", open);
  $("close-btn").addEventListener("click", close);
  $("close-btn-2").addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

  $("minus").addEventListener("click", () => { qty = Math.max(1, qty - 1); renderTotal(); });
  $("plus").addEventListener("click", () => { qty = Math.min(10, qty + 1); renderTotal(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    $("s-name").textContent = data.get("name") || "cliente";
    $("s-email").textContent = data.get("email") || "";
    $("s-qty").textContent = qty;
    form.classList.add("hidden");
    success.classList.remove("hidden");
    $("modal-title").textContent = "Compra confirmada";
  });

  renderTotal();
})();