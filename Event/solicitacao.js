document.addEventListener("DOMContentLoaded", () => {
  const orderId = new URLSearchParams(location.search).get("order");
  const orders = JSON.parse(localStorage.getItem("ticketa-orders") || "[]");
  const order = orders.find((item) => item.id === orderId);

  if (!order) return;

  document.getElementById("message").textContent =
    `A solicitação para ${order.eventName} foi guardada. O organizador entrará em contacto consigo pelo telefone informado.`;
});
