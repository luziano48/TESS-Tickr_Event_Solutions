document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const eventId = params.get("id");
  const form = document.getElementById("buy-form");
  const error = document.getElementById("form-error");
  const submitButton = form.querySelector('button[type="submit"]');
  let qty = 1;
  let evento;
  let isSubmitting = false;

  const showError = (message = "") => {
    error.textContent = message;
    error.hidden = !message;
  };

  const updateTotal = () => {
    const price = Number(String(evento?.price || "").replace(/\./g, "").replace(",", "."));
    document.getElementById("total").textContent = Number.isFinite(price)
      ? `KZ ${(price * qty).toFixed(2).replace(".", ",")}`
      : "A definir";
  };

  try {
    const response = await fetch("../eventos.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar os eventos.");
    evento = (await response.json()).find((item) => item.id === eventId);
    if (!evento) throw new Error("Evento não encontrado.");
  } catch {
    document.getElementById("event-name").textContent = "Evento não encontrado";
    document.getElementById("event-details").textContent = "Volte à página inicial e escolha um evento válido.";
    form.hidden = true;
    return;
  }

  document.title = `Comprar ${evento.title} — Ingressos`;
  document.getElementById("event-name").textContent = evento.title;
  document.getElementById("event-details").textContent = `${evento.date} · ${evento.location}, ${evento.city}`;
  document.getElementById("back").href = `index.html?id=${encodeURIComponent(evento.id)}`;
  updateTotal();

  const changeQuantity = (amount) => {
    if (isSubmitting) return;
    qty = Math.max(1, qty + amount);
    document.getElementById("qty").textContent = qty;
    updateTotal();
  };

  document.getElementById("minus").addEventListener("click", () => changeQuantity(-1));
  document.getElementById("plus").addEventListener("click", () => changeQuantity(1));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").replace(/\D/g, "");

    if (name.length < 2) return showError("Informe um nome completo válido.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError("Informe um e-mail válido.");
    if (phone.length < 9) return showError("Informe um telefone válido.");

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = "A processar...";

    const order = {
      id: `TCK-${Date.now().toString().slice(-8)}`,
      eventId: evento.id,
      eventName: evento.title,
      eventDate: evento.date,
      eventLocation: `${evento.location}, ${evento.city}`,
      titular: name,
      email,
      telefone: phone,
      quantidade: qty,
      tipo: "Pista",
      total: document.getElementById("total").textContent,
      status: "pendente",
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem("ticketa-orders") || "[]");
    orders.push(order);
    localStorage.setItem("ticketa-orders", JSON.stringify(orders));

    window.setTimeout(() => {
      location.assign(`solicitacao.html?order=${encodeURIComponent(order.id)}`);
    }, 700);
  });
});
